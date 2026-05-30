import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import dotenv  from 'dotenv';
import { collectDefaultMetrics, Registry } from 'prom-client';

import { authMiddleware }    from './middleware/auth.middleware';
import { errorMiddleware }   from './middleware/error.middleware';
import financialRouter       from './controllers/financial.controller';
import { pool, testConnection } from './db';
import { connectRabbitMQ }   from './events/publishers/payment.publisher';
import { startReminderCron } from './plugins/reminder.plugin';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3004;

const register = new Registry();
collectDefaultMetrics({ register });

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'http://localhost:4203',
    'http://localhost:8000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status:    'healthy',
      service:   'financial-service',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status:    'unhealthy',
      service:   'financial-service',
      timestamp: new Date().toISOString()
    });
  }
});

// Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// TEMPORARY TEST ROUTE — remove before Phase 5
// app.get('/test/payments', async (req, res) => {
//   const result = await pool.query(
//     `SELECT p.payment_id, s.first_name, s.last_name,
//             p.amount, p.due_date, p.status, p.academic_year
//      FROM payments p
//      JOIN students s ON p.student_id = s.student_id
//      LIMIT 5`
//   );
//   res.json(result.rows);
// });

// Protected routes
app.use('/api/finance', authMiddleware, financialRouter);

// Error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Financial Service running on port ${PORT}`);
  await testConnection();
  await connectRabbitMQ();
  startReminderCron();
});

export default app;