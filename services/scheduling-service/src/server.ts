import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import dotenv  from 'dotenv';
import { collectDefaultMetrics, Registry } from 'prom-client';

import { authMiddleware }    from './middleware/auth.middleware';
import { errorMiddleware }   from './middleware/error.middleware';
import schedulingRouter      from './controllers/scheduling.controller';
import { pool, testConnection } from './db';
import { connectRabbitMQ }   from './events/publishers/schedule.publisher';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3003;

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
      service:   'scheduling-service',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status:    'unhealthy',
      service:   'scheduling-service',
      timestamp: new Date().toISOString()
    });
  }
});

// Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// TEMPORARY TEST ROUTE
// app.get('/test/schedules', async (req, res) => {
//   const result = await pool.query(
//     `SELECT s.schedule_id, c.course_name, r.room_name,
//             s.day_of_week, s.start_time, s.end_time
//      FROM schedules s
//      JOIN courses c ON s.course_id = c.course_id
//      JOIN rooms   r ON s.room_id   = r.room_id
//      LIMIT 5`
//   );
//   res.json(result.rows);
// });

// Protected routes
app.use('/api/schedules', authMiddleware, schedulingRouter);

// Error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Scheduling Service running on port ${PORT}`);
  await testConnection();
  await connectRabbitMQ();
});

export default app;