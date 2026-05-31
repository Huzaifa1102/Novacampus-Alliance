from db import get_mongo_db
from datetime import datetime, timezone

async def escalate_to_advisor(
    student_id: str,
    campus_id:  str,
    message:    str,
    session_id: str
) -> str:
    """
    Saves an escalation request to MongoDB for human follow-up.
    """
    try:
        db = get_mongo_db()
        await db.escalations.insert_one({
            "student_id":  student_id,
            "campus_id":   campus_id,
            "message":     message,
            "session_id":  session_id,
            "status":      "pending",
            "created_at":  datetime.now(timezone.utc)
        })
    except Exception as e:
        print(f"Escalation save failed: {e}")

    return (
        "I have forwarded your question to a campus advisor. "
        "They will get back to you within 1 business day. "
        "You can also visit the administration office directly."
    )