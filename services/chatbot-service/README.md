# AI Chatbot Microservice (`chatbot-service`)

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)

The **Chatbot Service** is an AI-assisted conversational microservice powered by FastAPI and MongoDB. It answers student queries regarding schedules, grades, campus logistics, and administrative procedures.

## 🎯 Features

- FastAPI async API server.
- MongoDB integration for query logs and conversation contexts.
- Natural Language processing query handler.
- Integration with Academic, Scheduling, and Financial backend APIs.

## 📡 Endpoints

- `POST /api/chat` — Submit a question to the AI assistant.
- `GET /health` — Health check endpoint.

## ⚙️ Running Locally

```bash
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn src.main:app --port 3006 --reload
```
Default Port: `3006`
