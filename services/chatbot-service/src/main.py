import os
import uuid
import asyncio
from datetime import datetime, timezone
from contextlib import asynccontextmanager

import httpx
from openai import AsyncOpenAI          # async client — never blocks the loop
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from prometheus_fastapi_instrumentator import Instrumentator

from db import get_mongo_db
from middleware.auth import verify_token, AuthUser
from models.chat_models import ChatMessage, ChatResponse
from plugins.nlp_plugin import parse_intent
from plugins.intent_resolver import resolve
from plugins.data_fetch_plugin import fetch_data

load_dotenv()

_openai: AsyncOpenAI | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _openai
    _openai = AsyncOpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        timeout=httpx.Timeout(10.0, connect=3.0),  # hard wall — no 504s
    )
    print(f"Chatbot Service running on port {os.getenv('PORT', 3006)}")
    yield
    await _openai.close()

app = FastAPI(title="Novacampus Chatbot Service", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Instrumentator().instrument(app).expose(app)


@app.get("/health")
async def health():
    return {
        "status":    "healthy",
        "service":   "chatbot-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/chat/message", response_model=ChatResponse)
async def handle_message(
    body: ChatMessage,
    user: AuthUser = Depends(verify_token),
):
    session_id = body.session_id or str(uuid.uuid4())

    # Step 1 — parse intent (your existing NLP plugin)
    intent = await parse_intent(body.message)

    # Step 2 — resolve service target
    resolution = resolve(intent, user.id)

    # Step 3 — fetch live data if needed
    data = {}
    if resolution["needs_fetch"]:
        try:
            data = await asyncio.wait_for(
                fetch_data(resolution, ""),
                timeout=5.0,    # never let a downstream microservice hang the gateway
            )
        except asyncio.TimeoutError:
            data = {"error": "downstream_timeout"}

    # Step 4 — call OpenAI asynchronously
    response_text = await _generate_response(body.message, intent.type, data)

    # Step 5 — persist to MongoDB (fire-and-forget, never blocks the response)
    asyncio.create_task(
        _save_session(user.id, "", session_id, body.message, response_text, intent.type)
    )

    return ChatResponse(
        response=response_text,
        intent=intent.type,
        session_id=session_id,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


async def _generate_response(message: str, intent_type: str, data: dict) -> str:
    """Calls OpenAI with a hard timeout. Falls back to rule-based on any failure."""
    if _openai is None or not os.getenv("OPENAI_API_KEY"):
        return _rule_based_fallback(intent_type, data)

    try:
        system = (
            "You are Nova, the NovaCampus academic assistant. "
            "Answer concisely based on the data provided. "
            "If data is empty, say you could not retrieve it right now."
        )
        user_content = f"Student asked: {message}\n\nLive data: {data}"
        completion = await asyncio.wait_for(
            _openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user",   "content": user_content},
                ],
                max_tokens=300,
            ),
            timeout=8.0,    # OpenAI hard cap — Kong proxy timeout is 10s
        )
        return completion.choices[0].message.content.strip()

    except asyncio.TimeoutError:
        return "I'm taking too long to respond. Please try again."
    except Exception as e:
        print(f"OpenAI error: {e}")
        return _rule_based_fallback(intent_type, data)


def _rule_based_fallback(intent_type: str, data: dict) -> str:
    if intent_type == "UNKNOWN":
        return "I didn't understand that. Try asking about your timetable, grades, or payments."
    if data.get("error") == "downstream_timeout":
        return f"I understood your {intent_type.replace('_', ' ').lower()}, but the data service is slow right now. Please try again shortly."
    return f"I found some information for your {intent_type.replace('_', ' ').lower()}: {data}"


@app.get("/api/chat/history")
async def get_history(user: AuthUser = Depends(verify_token)):
    if user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Access denied")
    try:
        db = get_mongo_db()
        cursor = db.chat_sessions.find(
            {"student_id": user.id}, {"_id": 0}
        ).sort("timestamp", -1).limit(50)
        history = await cursor.to_list(length=50)
        return {"status": "success", "data": history}
    except Exception:
        return {"status": "success", "data": []}


async def _save_session(
    student_id: str, campus_id: str, session_id: str,
    message: str, response: str, intent_type: str,
) -> None:
    """Non-blocking fire-and-forget. A MongoDB outage never affects chat."""
    try:
        db = get_mongo_db()
        await asyncio.wait_for(
            db.chat_sessions.insert_one({
                "student_id": student_id,
                "campus_id":  campus_id,
                "session_id": session_id,
                "message":    message,
                "response":   response,
                "intent":     intent_type,
                "timestamp":  datetime.now(timezone.utc),
            }),
            timeout=3.0,    # MongoDB gets 3s max — then silently dropped
        )
    except Exception as e:
        print(f"[non-fatal] Session save failed: {e}")