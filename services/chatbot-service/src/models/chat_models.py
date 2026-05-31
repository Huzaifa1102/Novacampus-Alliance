from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response:    str
    intent:      str
    session_id:  str
    timestamp:   str

class ConversationEntry(BaseModel):
    student_id:  str
    campus_id:   str
    session_id:  str
    message:     str
    response:    str
    intent:      str
    timestamp:   datetime

class IntentResult(BaseModel):
    type:        str          # TIMETABLE, GRADE, ATTENDANCE, PAYMENT, FAQ, UNKNOWN
    entities:    dict         # extracted entities (course name, date, etc.)
    confidence:  float
    raw_message: str