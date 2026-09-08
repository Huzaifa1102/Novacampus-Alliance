# Executive Reporting Microservice (`reporting-service`)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

The **Reporting Service** aggregates operational metrics, institutional KPI indicators, enrollment trends, and payment collection rates using PostgreSQL materialized views (`kpi_per_campus`).

## 🎯 Features

- Real-time institutional KPI aggregation.
- Fast queries against PostgreSQL materialized views.
- Campus comparison analytics for executive dashboards.

## 📡 Endpoints

- `GET /api/reports/kpis` — Fetch operational KPI summary.
- `GET /api/reports/campus` — Fetch campus directory metrics.

## ⚙️ Running Locally

```bash
npm install
npm start
```
Default Port: `3005`
