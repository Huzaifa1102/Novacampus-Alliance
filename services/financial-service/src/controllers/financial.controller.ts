import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { requireRole }        from '../middleware/auth.middleware';
import { financialRepository } from '../repositories/financial.repository';
import { publishPaymentEvent } from '../events/publishers/payment.publisher';
import { runReminderJob }      from '../plugins/reminder.plugin';

const router = Router();

const respond = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({
    status: 'success', data, error: null,
    timestamp: new Date().toISOString()
  });

const fail = (res: Response, error: string, status = 400) =>
  res.status(status).json({
    status: 'failure', data: null, error,
    timestamp: new Date().toISOString()
  });


// ── Summary / Dashboard ────────────────────────────────────

// GET /api/finance/summary
router.get(
  '/summary',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await financialRepository.getSummary(
        req.user!.campusId
      );
      respond(res, result.rows[0]);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Payments ───────────────────────────────────────────────

// GET /api/finance/payments
router.get(
  '/payments',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await financialRepository.findAll(
        req.user!.campusId,
        {
          status:       req.query['status']       as string,
          academicYear: req.query['academicYear'] as string,
          studentId:    req.query['studentId']    as string
        }
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// GET /api/finance/payments/my
// Student sees only their own payments
router.get(
  '/payments/my',
  requireRole('STUDENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await financialRepository.findByStudent(
        req.user!.id,
        req.user!.campusId
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// GET /api/finance/payments/:id
router.get(
  '/payments/:id',
  requireRole('STUDENT', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await financialRepository.findById(
        req.params['id'],
        req.user!.campusId
      );
      if (result.rowCount === 0) {
        fail(res, `Payment ${req.params['id']} not found`, 404);
        return;
      }

      const payment = result.rows[0];

      // Students can only see their own payments
      if (
        req.user!.role === 'STUDENT' &&
        payment.student_id !== req.user!.id
      ) {
        fail(res, 'Access denied', 403);
        return;
      }

      respond(res, payment);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// POST /api/finance/payments
// Admin creates a payment record for a student
router.post(
  '/payments',
  requireRole('ADMIN'),
  [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('academicYear').notEmpty().withMessage('Academic year is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }
    try {
      const payment = await financialRepository.create({
        ...req.body,
        campusId: req.user!.campusId
      });
      respond(res, payment.rows[0], 201);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// PATCH /api/finance/payments/:id/confirm
// Admin marks a payment as Paid
router.patch(
  '/payments/:id/confirm',
  requireRole('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const result = await financialRepository.confirmPayment(
        req.params['id'],
        req.user!.campusId
      );

      if (result.rowCount === 0) {
        fail(res, 'Payment not found or already confirmed', 404);
        return;
      }

      const payment = result.rows[0];

      // Publish confirmation event
      await publishPaymentEvent('payment.confirmed', {
        paymentId: payment.payment_id,
        studentId: payment.student_id,
        campusId:  payment.campus_id,
        amount:    payment.amount
      });

      respond(res, payment);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// PATCH /api/finance/payments/:id/status
// Admin manually sets payment status
router.patch(
  '/payments/:id/status',
  requireRole('ADMIN'),
  [
    body('status')
      .isIn(['Paid', 'Pending', 'Delay', 'Exempted'])
      .withMessage('Status must be Paid, Pending, Delay, or Exempted')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }
    try {
      const result = await financialRepository.updateStatus(
        req.params['id'],
        req.body.status,
        req.user!.campusId
      );
      if (result.rowCount === 0) {
        fail(res, 'Payment not found', 404);
        return;
      }
      respond(res, result.rows[0]);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Dev/Test Endpoints ─────────────────────────────────────

// POST /api/finance/dev/trigger-reminders
// Manually triggers the CRON job for testing — remove before production
// router.post(
//   '/dev/trigger-reminders',
//   requireRole('ADMIN'),
//   async (req: Request, res: Response) => {
//     try {
//       console.log('[DEV] Manually triggering reminder job...');
//       const result = await runReminderJob();
//       respond(res, {
//         message:   'Reminder job completed',
//         processed: result.processed,
//         escalated: result.escalated
//       });
//     } catch (err) {
//       fail(res, (err as Error).message, 500);
//     }
//   }
// );

export default router;