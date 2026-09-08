# Student Microservice (`student-service`)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

The **Student Service** manages student registrations, academic files, enrollment statuses, and student profiles across campuses in the NovaCampus Alliance system.

## 🎯 Features

- Student Registration & Profile management.
- Integration with PostgreSQL Row-Level Security for campus isolation.
- AMQP event publishing for student registration events via RabbitMQ.
- JWT Authentication middleware.

## 📡 Endpoints

- `GET /api/students` — List all registered students (campus isolated).
- `GET /api/students/:id` — Get student profile details.
- `POST /api/students` — Register a new student profile.
- `PUT /api/students/:id` — Update student information.

## ⚙️ Running Locally

```bash
npm install
npm run build
npm start
```
Default Port: `3001`
