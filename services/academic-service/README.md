# Academic Microservice (`academic-service`)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

The **Academic Service** handles curriculum courses, instructor assignments, student grading, and attendance tracking across campuses.

## 🎯 Features

- Course catalog and credit management.
- Grade entry and calculation plugins.
- Attendance logging per course session.
- Student transcript generation endpoints.

## 📡 Endpoints

- `GET /api/academic/courses` — Retrieve available course listings.
- `GET /api/academic/grades/my` — Get current student grades.
- `POST /api/academic/grades` — Save & publish course grades.
- `POST /api/academic/attendance` — Log student attendance.

## ⚙️ Running Locally

```bash
npm install
npm start
```
Default Port: `3002`
