import { Router, Request, Response } from 'express';
import { body, query as queryParam, validationResult } from 'express-validator';
import { requireRole }      from '../middleware/auth.middleware';
import { academicRepository } from '../repositories/academic.repository';
import { saveGrade, publishGrades } from '../plugins/grade.plugin';
import { recordAttendance }         from '../plugins/attendance.plugin';

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


// ── Courses ────────────────────────────────────────────────

// GET /api/academic/courses
router.get(
  '/courses',
  requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await academicRepository.findAllCourses(
        req.user!.campusId,
        {
          semester:     req.query['semester']     as string,
          academicYear: req.query['academicYear'] as string,
          programId:    req.query['programId']    as string
        }
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// GET /api/academic/courses/:id
router.get(
  '/courses/:id',
  requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await academicRepository.findCourseById(
        req.params['id'],
        req.user!.campusId
      );
      if (result.rowCount === 0) {
        fail(res, `Course ${req.params['id']} not found`, 404);
        return;
      }
      respond(res, result.rows[0]);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Grades ─────────────────────────────────────────────────

// GET /api/academic/grades/:courseId
// Teacher sees all student grades for their course
router.get(
  '/grades/:courseId',
  requireRole('TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await academicRepository.findGradesByCourse(
        req.params['courseId'],
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

// PUT /api/academic/grades/:enrollmentId
// Teacher saves a grade for one student enrollment
router.put(
  '/grades/:enrollmentId',
  requireRole('TEACHER', 'ADMIN'),
  [
    body('grade')
      .isFloat({ min: 0, max: 20 })
      .withMessage('Grade must be a number between 0 and 20')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }
    try {
      const result = await saveGrade(
        req.params['enrollmentId'],
        parseFloat(req.body.grade),
        req.user!.campusId
      );
      respond(res, result);
    } catch (err) {
      fail(res, (err as Error).message, 400);
    }
  }
);

// POST /api/academic/grades/:courseId/publish
// Teacher publishes all grades for a course (locks them)
router.post(
  '/grades/:courseId/publish',
  requireRole('TEACHER', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const result = await publishGrades(
        req.params['courseId'],
        req.user!.campusId
      );
      respond(res, result);
    } catch (err) {
      fail(res, (err as Error).message, 400);
    }
  }
);


// ── Attendance ─────────────────────────────────────────────

// POST /api/academic/attendance
// Teacher records attendance for a session
router.post(
  '/attendance',
  requireRole('TEACHER', 'ADMIN'),
  [
    body('enrollmentId').notEmpty().withMessage('Enrollment ID is required'),
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('sessionDate').isISO8601().withMessage('Valid session date required'),
    body('present').isBoolean().withMessage('Present must be true or false')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      fail(res, errors.array().map(e => e.msg).join(', '));
      return;
    }
    try {
      const result = await recordAttendance({
        ...req.body,
        campusId: req.user!.campusId
      });
      respond(res, result, 201);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

// GET /api/academic/attendance/:courseId
// Teacher sees attendance summary per student for a course
router.get(
  '/attendance/:courseId',
  requireRole('TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await academicRepository.findGradesByCourse(
        req.params['courseId'],
        req.user!.campusId
      );
      // Return only attendance-relevant fields
      const attendance = result.rows.map(row => ({
        studentId:      row.student_id,
        studentName:    row.student_name,
        enrollmentId:   row.enrollment_id,
        attendanceRate: row.attendance_rate
      }));
      respond(res, attendance);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── History ────────────────────────────────────────────────

// GET /api/academic/history/:studentId
// Students see their own history; admins see any student
router.get(
  '/history/:studentId',
 // requireRole('STUDENT', 'TEACHER', 'ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      // Students can only view their own history
    //  if (req.user!.role === 'STUDENT' && req.user!.id !== studentId) {
    //    fail(res, 'Access denied', 403);
    //    return;
    //docker compose build academic-service  }

      const result = await academicRepository.findHistory(
        studentId,
        req.user!.campusId
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

export default router;