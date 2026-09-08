# API Gateway (`gateway`)

![Kong](https://img.shields.io/badge/Kong-3.4-blue?logo=kong)

The **API Gateway** layer is powered by **Kong 3.4** running in declarative DB-less mode. It serves as the single entry point for all frontend client requests on port `8000`.

## ⚙️ Configuration (`kong.yml`)

- **CORS Management**: Enforces allowed origins (`http://localhost:4200`, `http://localhost:4201`, etc.) and HTTP methods.
- **Rate Limiting**: Protects backend microservices against abuse.
- **Route Proxies**:
  - `/api/students` ➔ `student-service:3001`
  - `/api/academic` ➔ `academic-service:3002`
  - `/api/schedules` ➔ `scheduling-service:3003`
  - `/api/finance` ➔ `financial-service:3004`
  - `/api/reports` ➔ `reporting-service:3005`
  - `/api/chat` ➔ `chatbot-service:3006`

## 📡 Ports

- Proxy Port: `8000`
- Admin API: `8001`
