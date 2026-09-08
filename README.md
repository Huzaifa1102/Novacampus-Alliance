# NovaCampus Alliance — Academic ERP Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)
![License](https://img.shields.io/badge/license-MIT-blue)

A distributed, enterprise-grade, microservices-based Academic ERP system designed for multi-campus higher education institutions. Features a unified Angular 19 frontend workspace with student, teacher, admin, and management portals, backed by 6 distributed microservices, Kong API Gateway, Keycloak OIDC authentication, PostgreSQL Row-Level Security, and an AI Chatbot.

---

## 🌟 Key Features

- **Multi-Role Workspace**: Dedicated interfaces for Students, Faculty, Administrators, and Executives.
- **GitHub Repositories Showcase**: Embedded portfolio section with live GitHub API synchronization (`Huzaifa1102/Novacampus-Alliance`), commit history feeds, and clone quick-copy options.
- **Document Vault**: Official transcript and certificate management with cloud storage statistics and document upload dialogs.
- **Financial Ledger & Invoicing**: Automated tuition invoicing, payment processing, status filtering, and CSV export.
- **Smart Timetable & Logistics**: Room collision detection, capacity tracking, and multi-campus scheduling.
- **AI Academic Chatbot**: Python FastAPI assistant integrated into the web interface for answering campus queries.
- **Multi-Campus RLS Security**: Row-Level Security in PostgreSQL enforcing tenant isolation per campus.

---

## 🏗️ Architecture Overview

```
                          ┌────────────────────────┐
                          │   Angular 19 Frontend  │
                          │ (Portals & Dashboard)  │
                          └───────────┬────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │   Kong API Gateway     │
                          │   (Port 8000 / 8001)   │
                          └───────────┬────────────┘
                                      │
       ┌──────────────┬───────────────┼───────────────┬──────────────┬──────────────┐
       │              │               │               │              │              │
       ▼              ▼               ▼               ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│   Student    ││   Academic   ││  Scheduling  ││  Financial   ││  Reporting   ││   Chatbot    │
│   Service    ││   Service    ││   Service    ││   Service    ││   Service    ││   Service    │
│  (Port 3001) ││  (Port 3002) ││  (Port 3003) ││  (Port 3004) ││  (Port 3005) ││  (Port 3006) │
└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘
       │              │               │               │              │              │
       └──────────────┴───────┬───────┴───────────────┴──────────────┘              │
                              ▼                                                     ▼
                     ┌──────────────────┐                                  ┌──────────────────┐
                     │  PostgreSQL 17   │                                  │    MongoDB 7     │
                     │ (Relational DB)  │                                  │ (Chatbot Store)  │
                     └──────────────────┘                                  └──────────────────┘
```

---

## 📊 Ports & Services Matrix

| Service | Technology | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Kong API Gateway** | Lua / OpenResty | `8000` / `8001` | Central API Proxy & CORS management |
| **Keycloak OIDC** | Java / Quarkus | `8080` | Identity provider & Realm auth |
| **PostgreSQL** | Postgres 17 | `5432` | Relational store with Row-Level Security |
| **MongoDB** | Mongo 7 | `27017` | AI Chatbot document store |
| **RabbitMQ** | Erlang / AMQP | `5672` / `15672` | Asynchronous message bus |
| **Student Service** | Node.js / Express | `3001` | Student profiles & enrollment |
| **Academic Service** | Node.js / Express | `3002` | Courses, grades, attendance |
| **Scheduling Service** | Node.js / Express | `3003` | Timetables & room logistics |
| **Financial Service** | Node.js / Express | `3004` | Tuition & ledger payments |
| **Reporting Service** | Node.js / Express | `3005` | Executive KPI analytics |
| **Chatbot Service** | Python / FastAPI | `3006` | AI natural language assistant |
| **Prometheus** | Go | `9090` | Metrics scraping |
| **Grafana** | Go / TS | `3000` | Operational monitoring dashboards |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Angular CLI**: `npm install -g @angular/cli`
- **Docker Desktop**: Running locally

### 1. Running the Frontend
```bash
cd novacampus-frontend
npm install
npm start
```
Access the application at `http://localhost:4200`.

### 2. Launching the Backend Stack
```bash
# Set environment configuration
cp .env.example .env

# Start all 13 services with Docker Compose
docker compose up -d
```

---

## 💻 Tech Stack Summary

- **Frontend**: Angular 19 (Standalone Components, RxJS, TailwindCSS)
- **Backend Services**: Node.js (TypeScript, Express.js), Python 3.11 (FastAPI)
- **Databases**: PostgreSQL 17 (Prisma ORM, RLS), MongoDB 7 (PyMongo)
- **Messaging**: RabbitMQ (AMQP)
- **Authentication**: Keycloak 23 (OpenID Connect / JWT)
- **API Gateway**: Kong 3.4
- **Monitoring**: Prometheus + Grafana

---

## 👤 Author & Maintainer

Developed and maintained by **Huzaifa Mudassar** ([@Huzaifa1102](https://github.com/Huzaifa1102)).
