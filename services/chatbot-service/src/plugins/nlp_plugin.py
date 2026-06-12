import os
import json
from openai import AsyncOpenAI
from models.chat_models import IntentResult

# 1. Swapped to AsyncOpenAI
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"), timeout = 10.0)

INTENT_SYSTEM_PROMPT = """
You are an intent classifier for a university ERP chatbot.
Classify the student's message into one of these intents:
- TIMETABLE_QUERY: asking about schedule, classes, rooms, timetable
- GRADE_QUERY: asking about grades, scores, results, marks
- ATTENDANCE_QUERY: asking about attendance, absences, presence rate
- PAYMENT_QUERY: asking about payments, fees, tuition, due dates
- FAQ: general questions about the university, rules, procedures
- UNKNOWN: cannot be classified

Respond ONLY with valid JSON in this exact format:
{
  "type": "INTENT_TYPE",
  "entities": {
    "course": "course name if mentioned or null",
    "date": "date if mentioned or null",
    "semester": "S1 or S2 if mentioned or null"
  },
  "confidence": 0.0 to 1.0
}
"""

async def parse_intent(message: str) -> IntentResult:
    # Fallback if no API key is configured
    if not os.getenv("OPENAI_API_KEY") or \
       os.getenv("OPENAI_API_KEY") == "your-openai-api-key-here":
        return _rule_based_fallback(message)

    try:
        # 2. Added the 'await' keyword here
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                { "role": "system",  "content": INTENT_SYSTEM_PROMPT },
                { "role": "user",    "content": message }
            ],
            temperature=0,
            max_tokens=150
        )

        raw = response.choices[0].message.content.strip()
        parsed = json.loads(raw)

        return IntentResult(
            type        = parsed.get("type", "UNKNOWN"),
            entities    = parsed.get("entities", {}),
            confidence  = float(parsed.get("confidence", 0.5)),
            raw_message = message
        )

    except Exception as e:
        print(f"OpenAI error: {e} — falling back to rule-based", flush=True)
        return _rule_based_fallback(message)


def _rule_based_fallback(message: str) -> IntentResult:
    """
    Simple keyword-based fallback when OpenAI is not available.
    Used in development without an API key.
    """
    msg = message.lower()

    if any(w in msg for w in ["schedule", "timetable", "class", "room", "course", "tomorrow", "today"]):
        intent_type = "TIMETABLE_QUERY"
    elif any(w in msg for w in ["grade", "mark", "score", "result", "exam", "note"]):
        intent_type = "GRADE_QUERY"
    elif any(w in msg for w in ["attendance", "absent", "presence", "miss"]):
        intent_type = "ATTENDANCE_QUERY"
    elif any(w in msg for w in ["payment", "fee", "tuition", "due", "pay", "money"]):
        intent_type = "PAYMENT_QUERY"
    elif any(w in msg for w in ["help", "what", "how", "when", "where", "who"]):
        intent_type = "FAQ"
    else:
        intent_type = "UNKNOWN"

    return IntentResult(
        type        = intent_type,
        entities    = {},
        confidence  = 0.6,
        raw_message = message
    )