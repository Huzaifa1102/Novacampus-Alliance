# Scheduling & Logistics Microservice (`scheduling-service`)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

The **Scheduling Service** handles room reservations, timetable scheduling, collision detection, and physical space logistics across all university campuses.

## 🎯 Features

- Campus room directory and capacity management.
- Collision avoidance for overlapping course room bookings.
- Student & Teacher timetable grid mappings.

## 📡 Endpoints

- `GET /api/schedules/my` — Fetch current user's weekly timetable.
- `GET /api/schedules/rooms` — Fetch campus room availability.
- `POST /api/schedules/book` — Reserve a room for a course or event.

## ⚙️ Running Locally

```bash
npm install
npm start
```
Default Port: `3003`
