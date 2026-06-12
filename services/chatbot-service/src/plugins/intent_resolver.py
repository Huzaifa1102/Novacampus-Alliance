import os
from models.chat_models import IntentResult

# Docker DNS service names — no more localhost
SERVICE_MAP = {
    "TIMETABLE_QUERY":  os.getenv("SCHEDULING_SERVICE_URL", "http://scheduling-service:3003"),
    "GRADE_QUERY":      os.getenv("ACADEMIC_SERVICE_URL",   "http://academic-service:3002"),
    "ATTENDANCE_QUERY": os.getenv("ACADEMIC_SERVICE_URL",   "http://academic-service:3002"),
    "PAYMENT_QUERY":    os.getenv("FINANCIAL_SERVICE_URL",  "http://financial-service:3004"),
    "FAQ":              None,
    "UNKNOWN":          None,
}

PATH_MAP = {
    "TIMETABLE_QUERY":  "/api/schedules/my",
    "GRADE_QUERY":      "/api/academic/history/{student_id}",
    "ATTENDANCE_QUERY": "/api/academic/history/{student_id}",
    "PAYMENT_QUERY":    "/api/finance/payments/my",
    "FAQ":              None,
    "UNKNOWN":          None,
}

def resolve(intent: IntentResult, student_id: str) -> dict:
    service_url = SERVICE_MAP.get(intent.type)
    path = PATH_MAP.get(intent.type)
    if path:
        path = path.replace("{student_id}", student_id)
    return {
        "service_url": service_url,
        "path":        path,
        "intent_type": intent.type,
        "entities":    intent.entities,
        "needs_fetch": bool(service_url and path),
    }