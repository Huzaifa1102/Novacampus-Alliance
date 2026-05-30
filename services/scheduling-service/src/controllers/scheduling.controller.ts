import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { requireRole }        from '../middleware/auth.middleware';
import { schedulingRepository } from '../repositories/scheduling.repository';
import { checkAndCreate, checkAndUpdate, ConflictError }
  from '../plugins/conflict-detection.plugin';
import { publishScheduleEvent } from '../events/publishers/schedule.publisher';

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


// ── Rooms ──────────────────────────────────────────────────

// GET /api/schedules/rooms
router.get(
  '/rooms',
  requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await schedulingRepository.findAllRooms(
        req.user!.campusId
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Schedules ──────────────────────────────────────────────

// GET /api/schedules
// Returns all schedules for the campus (admin/teacher view)
router.get(
  '/',
  requireRole('TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await schedulingRepository.findAll(
        req.user!.campusId,
        {
          semester:     req.query['semester']     as string,
          academicYear: req.query['academicYear'] as string,
          instructorId: req.query['instructorId'] as string,
          roomId:       req.query['roomId']       as string
        }
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// GET /api/schedules/my
// Returns the schedule for the logged-in student
router.get(
  '/my',
  requireRole('STUDENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await schedulingRepository.findByStudent(
        req.user!.id,
        req.user!.campusId,
        req.query['semester']     as string,
        req.query['academicYear'] as string
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// GET /api/schedules/:id
router.get(
  '/:id',
  requireRole('TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await schedulingRepository.findById(
        req.params['id'],
        req.user!.campusId
      );
      if (result.rowCount === 0) {
        fail(res, `Schedule ${req.params['id']} not found`, 404);
        return;
      }
      respond(res, result.rows[0]);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// POST /api/schedules
// Create a new schedule entry — runs conflict detection first
router.post(
  '/',
  requireRole('ADMIN'),
  [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('roomId').notEmpty().withMessage('Room ID is required'),
    body('instructorId').notEmpty().withMessage('Instructor ID is required'),
    body('dayOfWeek')
      .isIn(['Monday','Tuesday','Wednesday','Thursday','Friday'])
      .withMessage('Day must be a weekday'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('semester').isIn(['S1','S2']).withMessage('Semester must be S1 or S2'),
    body('academicYear').notEmpty().withMessage('Academic year is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }

    try {
      const schedule = await checkAndCreate({
        ...req.body,
        campusId: req.user!.campusId
      });

      // Publish creation event to RabbitMQ
      await publishScheduleEvent('schedule.created', {
        scheduleId: schedule.schedule_id,
        campusId:   req.user!.campusId,
        courseId:   schedule.course_id,
        roomId:     schedule.room_id,
        dayOfWeek:  schedule.day_of_week,
        startTime:  schedule.start_time,
        endTime:    schedule.end_time
      });

      respond(res, schedule, 201);
    } catch (err) {
      if (err instanceof ConflictError) {
        fail(res, err.message, 409);  // 409 Conflict
      } else {
        fail(res, (err as Error).message, 500);
      }
    }
  }
);

// PUT /api/schedules/:id
// Update a schedule (room change, time change) — runs conflict detection
router.put(
  '/:id',
  requireRole('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const scheduleId = req.params['id'];

      // Fetch affected students BEFORE updating
      const affected = await schedulingRepository.findAffectedStudents(
        scheduleId,
        req.user!.campusId
      );

      const schedule = await checkAndUpdate(
        scheduleId,
        req.body,
        req.user!.campusId
      );

      // Publish change event with list of affected student IDs
      await publishScheduleEvent('schedule.changed', {
        scheduleId,
        campusId:         req.user!.campusId,
        changes:          req.body,
        affectedStudents: affected.rows.map(s => s.student_id),
        updatedSchedule:  schedule
      });

      respond(res, schedule);
    } catch (err) {
      if (err instanceof ConflictError) {
        fail(res, err.message, 409);
      } else {
        fail(res, (err as Error).message, 500);
      }
    }
  }
);

// DELETE /api/schedules/:id
router.delete(
  '/:id',
  requireRole('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const scheduleId = req.params['id'];

      const affected = await schedulingRepository.findAffectedStudents(
        scheduleId,
        req.user!.campusId
      );

      const result = await schedulingRepository.delete(
        scheduleId,
        req.user!.campusId
      );

      if (result.rowCount === 0) {
        fail(res, `Schedule ${scheduleId} not found`, 404);
        return;
      }

      await publishScheduleEvent('schedule.deleted', {
        scheduleId,
        campusId:         req.user!.campusId,
        affectedStudents: affected.rows.map(s => s.student_id)
      });

      respond(res, { deleted: scheduleId });
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

export default router;