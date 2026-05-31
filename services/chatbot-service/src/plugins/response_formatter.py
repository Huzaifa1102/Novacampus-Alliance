from models.chat_models import IntentResult

async def format_response(
    intent:  IntentResult,
    data:    dict | list,
    message: str
) -> str:
    """
    Converts raw microservice data into a natural language response.
    """

    if isinstance(data, dict) and data.get("error"):
        return (
            "I could not retrieve that information right now. "
            "Please try again in a moment or contact your campus advisor."
        )

    if intent.type == "TIMETABLE_QUERY":
        return _format_timetable(data)

    elif intent.type == "GRADE_QUERY":
        return _format_grades(data, intent.entities)

    elif intent.type == "ATTENDANCE_QUERY":
        return _format_attendance(data, intent.entities)

    elif intent.type == "PAYMENT_QUERY":
        return _format_payments(data)

    elif intent.type == "FAQ":
        return _format_faq(message)

    else:
        return (
            "I am not sure I understood your question. "
            "You can ask me about your timetable, grades, attendance, "
            "or payments. How can I help?"
        )


def _format_timetable(data: list) -> str:
    if not data:
        return "You have no scheduled classes at the moment."

    lines = ["Here is your current timetable:\n"]
    days  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    # Group by day
    grouped: dict = {day: [] for day in days}
    for session in data:
        day = session.get("day_of_week")
        if day in grouped:
            grouped[day].append(session)

    for day in days:
        sessions = grouped[day]
        if sessions:
            lines.append(f"**{day}**")
            for s in sorted(sessions, key=lambda x: x.get("start_time", "")):
                lines.append(
                    f"  {s.get('start_time','')}–{s.get('end_time','')}  "
                    f"{s.get('course_name','Unknown')}  "
                    f"({s.get('room_name','TBD')})"
                )

    return "\n".join(lines)


def _format_grades(data: list, entities: dict) -> str:
    if not data:
        return "No grade records found for your account."

    # Filter by course if mentioned
    course_filter = entities.get("course", "").lower()
    if course_filter:
        data = [
            r for r in data
            if course_filter in r.get("course_name", "").lower()
        ]
        if not data:
            return f"No grades found for a course matching '{entities['course']}'."

    published = [r for r in data if r.get("published")]
    if not published:
        return "Your grades have not been published yet."

    lines = ["Here are your published grades:\n"]
    for r in published:
        grade = r.get("grade")
        grade_str = f"{grade}/20" if grade is not None else "Not yet graded"
        status = r.get("status", "")
        lines.append(
            f"• {r.get('course_name','Unknown')} "
            f"({r.get('semester','')} {r.get('academic_year','')}) — "
            f"{grade_str}  [{status}]"
        )

    return "\n".join(lines)


def _format_attendance(data: list, entities: dict) -> str:
    if not data:
        return "No attendance records found for your account."

    course_filter = entities.get("course", "").lower()
    if course_filter:
        data = [
            r for r in data
            if course_filter in r.get("course_name", "").lower()
        ]
        if not data:
            return f"No attendance found for a course matching '{entities['course']}'."

    lines = ["Here is your attendance summary:\n"]
    for r in data:
        rate    = r.get("attendance_rate", 0)
        warning = " ⚠️ Below 75%" if rate < 75 else ""
        lines.append(
            f"• {r.get('course_name','Unknown')} — "
            f"{rate}%{warning}"
        )

    return "\n".join(lines)


def _format_payments(data: list) -> str:
    if not data:
        return "No payment records found for your account."

    lines = ["Here is your payment status:\n"]
    for p in data:
        status    = p.get("status", "Unknown")
        amount    = p.get("amount", 0)
        due_date  = p.get("due_date", "")[:10]
        paid_date = p.get("payment_date")

        if status == "Paid":
            lines.append(
                f"• €{amount} — Paid on {paid_date[:10] if paid_date else 'N/A'} ✅"
            )
        elif status == "Delay":
            lines.append(
                f"• €{amount} — OVERDUE since {due_date} ❌ "
                f"Please contact your campus administration."
            )
        elif status == "Pending":
            lines.append(
                f"• €{amount} — Due on {due_date} ⏳"
            )
        else:
            lines.append(f"• €{amount} — {status}")

    return "\n".join(lines)


def _format_faq(message: str) -> str:
    msg = message.lower()

    if "contact" in msg or "advisor" in msg:
        return (
            "You can contact your campus academic advisor by visiting "
            "the administration office or emailing advisor@novacampus.fr."
        )
    if "deadline" in msg or "registration" in msg:
        return (
            "Course registration deadlines are published at the start "
            "of each semester. Check the announcements section or ask "
            "your campus admin for the exact dates."
        )
    if "exam" in msg:
        return (
            "Exam schedules are published 4 weeks before the exam session. "
            "Check your timetable or contact your program coordinator."
        )

    return (
        "I can help you with your timetable, grades, attendance, and payments. "
        "For other questions, please contact your campus administration."
    )