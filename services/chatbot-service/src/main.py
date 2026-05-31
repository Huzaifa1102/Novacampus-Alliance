import os
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from prometheus_fastapi_instrumentator import Instrumentator

from db import test_mongo_connection, get_mongo_db
from middleware.auth import verify_token, AuthUser
from models.chat_models import ChatMessage, ChatResponse
from plugins.nlp_plugin import parse_intent
from plugins.intent_resolver import resolve
from plugins.data_fetch_plugin import fetch_data
from plugins.response_formatter import format_response
from plugins.escalation_plugin import escalate_to_advisor

load_dotenv()

app = FastAPI(
    title="Novacampus Chatbot Service",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Prometheus metrics
Instrumentator().instrument(app).expose(app)


# ── Startup ────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    print(f"Chatbot Service running on port {os.getenv('PORT', 3006)}")
    await test_mongo_connection()


# ── Health check ───────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status":    "healthy",
        "service":   "chatbot-service",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ── Main chat endpoint ─────────────────────────────────────

@app.post("/api/chat/message", response_model=ChatResponse)
async def handle_message(
    body:  ChatMessage,
    token: str = None,
    user:  AuthUser = Depends(verify_token)
):
    # Only students can use the chatbot
    if user.role != "STUDENT":
        raise HTTPException(
            status_code=403,
            detail="Chatbot is only available for students"
        )

    session_id = body.session_id or str(uuid.uuid4())

    # Step 1 — Parse intent from the message
    intent = await parse_intent(body.message)

    # Step 2 — Resolve which service to call
    resolution = resolve(intent, user.id)

    # Step 3 — Fetch live data from the microservice
    # Extract the raw Bearer token from the Authorization header
    from fastapi import Request
    data = {}
    if resolution["needs_fetch"]:
        # We pass an empty token here — in Phase 5 Kong forwards
        # the original token automatically
        data = await fetch_data(resolution, "")

    # Step 4 — Escalate if unknown intent or data error
    if intent.type == "UNKNOWN" or (
        isinstance(data, dict) and data.get("error")
        and intent.confidence < 0.4
    ):
        response_text = await escalate_to_advisor(
            student_id = user.id,
            campus_id  = user.campus_id,
            message    = body.message,
            session_id = session_id
        )
    else:
        # Step 5 — Format data into natural language
        response_text = await format_response(intent, data, body.message)

    # Step 6 — Save conversation to MongoDB
    await _save_session(
        student_id    = user.id,
        campus_id     = user.campus_id,
        session_id    = session_id,
        message       = body.message,
        response      = response_text,
        intent_type   = intent.type
    )

    return ChatResponse(
        response   = response_text,
        intent     = intent.type,
        session_id = session_id,
        timestamp  = datetime.now(timezone.utc).isoformat()
    )


# ── Conversation history ───────────────────────────────────

@app.get("/api/chat/history")
async def get_history(user: AuthUser = Depends(verify_token)):
    if user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        db      = get_mongo_db()
        cursor  = db.chat_sessions.find(
            { "student_id": user.id },
            { "_id": 0 }
        ).sort("timestamp", -1).limit(50)
        history = await cursor.to_list(length=50)
        return { "status": "success", "data": history }
    except Exception:
        return { "status": "success", "data": [] }


# ── TEMPORARY TEST ROUTE — remove before Phase 5 ──────────

@app.get("/test/chat")
async def test_chat():
    intent = await parse_intent("What is my timetable for tomorrow?")
    return {
        "intent_type": intent.type,
        "entities":    intent.entities,
        "confidence":  intent.confidence
    }


# ── Helpers ────────────────────────────────────────────────

async def _save_session(
    student_id:  str,
    campus_id:   str,
    session_id:  str,
    message:     str,
    response:    str,
    intent_type: str
):
    try:
        db = get_mongo_db()
        await db.chat_sessions.insert_one({
            "student_id":  student_id,
            "campus_id":   campus_id,
            "session_id":  session_id,
            "message":     message,
            "response":    response,
            "intent":      intent_type,
            "timestamp":   datetime.now(timezone.utc)
        })
    except Exception as e:
        # MongoDB failure must never crash the chatbot
        print(f"Session save failed: {e}")