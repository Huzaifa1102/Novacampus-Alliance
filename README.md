# Novacampus Alliance - Academic ERP

A distributed, microservices-based ERP for a multi-campus higher education group.

## Architecture
- 6 backend microservices (Node.js + Express, Python + FastAPI)
- 4 Angular frontend portals
- PostgreSQL + MongoDB + RabbitMQ + Kong + Keycloak

## Local Setup

### Prerequisites
- Node.js 20+
- Docker Desktop (running)
- Angular CLI: `npm install -g @angular/cli`

### Start the infrastructure
```bash
cp .env.example .env
# Edit .env with your values
docker-compose up -d
```

### Ports
| Service       | Port  |
|---------------|-------|
| Kong Gateway  | 8000  |
| Keycloak      | 8080  |
| PostgreSQL    | 5432  |
| MongoDB       | 27017 |
| RabbitMQ UI   | 15672 |
| Prometheus    | 9090  |
| Grafana       | 3000  |
