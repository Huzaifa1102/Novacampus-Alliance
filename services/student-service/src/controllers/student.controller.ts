import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { requireRole } from '../middleware/auth.middleware';
import { studentRepository } from '../repositories/student.repository';
import { registerStudent }     from '../plugins/registration.plugin';
import { enrollStudent }       from '../plugins/enrollment.plugin';
import { updateStudentStatus } from '../plugins/status.plugin';
import { pool } from '../db';

const router = Router();

// Helper — standard response format
const respond = (
  res: Response,
  data: unknown,
  status = 200
) => res.status(status).json({
  status:    'success',
  data,
  error:     null,
  timestamp: new Date().toISOString()
});

const fail = (
  res: Response,
  error: string,
  status = 400
) => res.status(status).json({
  status:    'failure',
  data:      null,
  error,
  timestamp: new Date().toISOString()
});


// GET /api/students
// Admin and Management can list all students for their campus
router.get(
  '/',
  requireRole('ADMIN', 'MANAGEMENT', 'TEACHER'),
  async (req: Request, res: Response) => {
    try {
      const result = await studentRepository.findAll(req.user!.campusId);
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// GET /api/students/:id
// Students can only view their own profile
router.get(
  '/:id',
  requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Students can only access their own profile
      if (req.user!.role === 'STUDENT' && req.user!.id !== id) {
        fail(res, 'Access denied', 403);
        return;
      }

      const result = await studentRepository.findById(
        id,
        req.user!.campusId
      );

      if (result.rowCount === 0) {
        fail(res, `Student ${id} not found`, 404);
        return;
      }

      respond(res, result.rows[0]);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// POST /api/students
// Admin only
router.post(
  '/',
  requireRole('ADMIN'),
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('programId').notEmpty().withMessage('Program ID is required'),
    body('enrollmentDate').isISO8601().withMessage('Valid enrollment date required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }

    try {
      const student = await registerStudent({
        ...req.body,
        campusId: req.user!.campusId
      });
      respond(res, student, 201);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// POST /api/students/:id/enroll
// Admin only
router.post(
  '/:id/enroll',
  requireRole('ADMIN'),
  [
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }

    try {
      const enrollment = await enrollStudent({
        studentId: req.params['id'],
        courseId:  req.body.courseId,
        campusId:  req.user!.campusId
      });
      respond(res, enrollment, 201);
    } catch (err) {
      fail(res, (err as Error).message, 400);
    }
  }
);


// GET /api/students/:id/enrollments
router.get(
  '/:id/enrollments',
  requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (req.user!.role === 'STUDENT' && req.user!.id !== id) {
        fail(res, 'Access denied', 403);
        return;
      }

      const result = await studentRepository.findEnrollments(
        id,
        req.user!.campusId
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// PATCH /api/students/:id/status
// Admin only
router.patch(
  '/:id/status',
  requireRole('ADMIN'),
  [
    body('status').notEmpty().withMessage('Status is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }

    try {
      const student = await updateStudentStatus(
        req.params['id'],
        req.body.status,
        req.user!.campusId
      );
      respond(res, student);
    } catch (err) {
      fail(res, (err as Error).message, 400);
    }
  }
);

// GET /api/students/:id/timetable
// Student can only view their own timetable
router.get(
  '/:id/timetable',
  requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (req.user!.role === 'STUDENT' && req.user!.id !== id) {
        fail(res, 'Access denied', 403);
        return;
      }

      const result = await pool.query(
        `SELECT
           s.schedule_id,
           s.day_of_week,
           s.start_time,
           s.end_time,
           s.semester,
           s.academic_year,
           s.room_id,
           s.instructor_id,
           c.course_id,
           c.course_name        AS course_name
         FROM enrollments e
         JOIN schedules s ON s.course_id = e.course_id
                         AND s.campus_id = e.campus_id
         JOIN courses   c ON c.course_id = e.course_id
         WHERE e.student_id = $1
           AND e.campus_id  = $2
           AND e.status     = 'Active'
         ORDER BY
           CASE s.day_of_week
             WHEN 'Monday'    THEN 1
             WHEN 'Tuesday'   THEN 2
             WHEN 'Wednesday' THEN 3
             WHEN 'Thursday'  THEN 4
             WHEN 'Friday'    THEN 5
           END,
           s.start_time`,
        [id, req.user!.campusId]
      );

      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

export default router;