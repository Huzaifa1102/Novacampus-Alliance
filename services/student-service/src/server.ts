import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import dotenv  from 'dotenv';
import { collectDefaultMetrics, Registry, Gauge } from 'prom-client';

import { authMiddleware }  from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import studentRouter       from './controllers/student.controller';
import { pool }            from './db';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Prometheus metrics ──────────────────────────────────────
const register = new Registry();
collectDefaultMetrics({ register });

// ── Security & parsing middleware ───────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'http://localhost:4203',
    'http://localhost:8000'   // Kong Gateway
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check (no auth required) ────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status:    'healthy',
      service:   'student-service',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status:    'unhealthy',
      service:   'student-service',
      timestamp: new Date().toISOString()
    });
  }
});

// ── Prometheus metrics endpoint ─────────────────────────────
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// TEMPORARY TEST ROUTE — remove before Phase 5
// app.get('/test/students', async (req, res) => {
//   const result = await pool.query(
//     `SELECT student_id, first_name, last_name, campus_id
//      FROM students LIMIT 5`
//   );
//   res.json(result.rows);
// });

// ── Protected routes ────────────────────────────────────────
app.use('/api/students', authMiddleware, studentRouter);

// ── Global error handler ────────────────────────────────────
app.use(errorMiddleware);

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Student Service running on port ${PORT}`);
});

export default app;