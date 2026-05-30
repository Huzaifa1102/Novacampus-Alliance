import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import dotenv  from 'dotenv';
import cron    from 'node-cron';
import { collectDefaultMetrics, Registry } from 'prom-client';

import { authMiddleware }    from './middleware/auth.middleware';
import { errorMiddleware }   from './middleware/error.middleware';
import reportingRouter       from './controllers/reporting.controller';
import { pool, testConnection } from './db';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3005;

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

// ── Cache invalidation CRON ────────────────────────────────
// Logs a cache refresh every 5 minutes
// In Phase 6 this will refresh PostgreSQL materialized views
cron.schedule('*/5 * * * *', () => {
  console.log('[CRON] Reporting cache refresh tick');
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status:    'healthy',
      service:   'reporting-service',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status:    'unhealthy',
      service:   'reporting-service',
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
app.get('/test/kpis', async (req, res) => {
  const result = await pool.query(
    `SELECT c.campus_id, c.campus_name,
            COUNT(DISTINCT s.student_id) AS total_students
     FROM campuses c
     LEFT JOIN students s ON s.campus_id = c.campus_id
     GROUP BY c.campus_id, c.campus_name
     ORDER BY c.campus_name`
  );
  res.json(result.rows);
});

// Protected routes
app.use('/api/reports', authMiddleware, reportingRouter);

// Error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Reporting Service running on port ${PORT}`);
  await testConnection();
});

export default app;