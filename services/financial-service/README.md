# Financial Microservice (`financial-service`)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

The **Financial Service** manages student tuition ledger, payment processing, invoices, overdue notices, and reminder event publishing via RabbitMQ.

## 🎯 Features

- Tuition invoice generation.
- Payment status tracking (Paid, Pending, Overdue, Delay).
- Automated payment reminder plugin publishing AMQP events.
- Executive financial aggregation queries.

## 📡 Endpoints

- `GET /api/finance/payments` — Get financial ledger entries.
- `POST /api/finance/invoices` — Create a new student invoice.
- `POST /api/finance/pay` — Process tuition payment.

## ⚙️ Running Locally

```bash
npm install
npm start
```
Default Port: `3004`
