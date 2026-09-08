# PostgreSQL Database (`database`)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)

The relational database layer runs **PostgreSQL 17** with Row-Level Security (RLS) policies enforcing multi-campus tenant isolation.

## 🗄️ Database Schemas (`init.sql`)

- `campuses`: Campus locations (Paris, Lyon, Toulouse, Marseille).
- `programs`: Degree programs and tuition pricing.
- `instructors`: Faculty members and campus assignments.
- `students`: Enrolled student directory.
- `rooms`: Physical spaces, equipment, and capacity.
- `courses`: Curriculum courses and instructor links.
- `enrollments`: Student course registrations and published grades.
- `schedules`: Class timetable slots and collision constraints.
- `payments`: Tuition invoices and payment status records.

## 🔒 Security & Analytics

- **Row-Level Security (RLS)**: Enforces `campus_isolation` policies based on `app.current_campus_id`.
- **Materialized Views**: `kpi_per_campus` pre-calculates attendance averages and payment collection rates.
