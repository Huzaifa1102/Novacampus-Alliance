import { Router, Request, Response } from 'express';
import { requireRole }        from '../middleware/auth.middleware';
import { reportingRepository } from '../repositories/reporting.repository';

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


// ── Campus KPIs ────────────────────────────────────────────

// GET /api/reports/kpis
// MANAGEMENT → all 4 campuses
// ADMIN      → their campus only
router.get(
  '/kpis',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const campusId = req.user!.role === 'MANAGEMENT'
        ? undefined                 // all campuses
        : req.user!.campusId;       // own campus only

      const result = await reportingRepository.getCampusKpis(campusId);
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Program KPIs ───────────────────────────────────────────

// GET /api/reports/programs
router.get(
  '/programs',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await reportingRepository.getProgramKpis(
        req.user!.campusId,
        req.query['academicYear'] as string
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── At-Risk Students ───────────────────────────────────────

// GET /api/reports/at-risk
router.get(
  '/at-risk',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await reportingRepository.getAtRiskStudents(
        req.user!.campusId,
        {
          minGrade:      req.query['minGrade']
            ? parseFloat(req.query['minGrade'] as string) : undefined,
          minAttendance: req.query['minAttendance']
            ? parseFloat(req.query['minAttendance'] as string) : undefined
        }
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Enrollment Trends ──────────────────────────────────────

// GET /api/reports/trends
router.get(
  '/trends',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await reportingRepository.getEnrollmentTrends(
        req.user!.campusId
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Grade Distribution ─────────────────────────────────────

// GET /api/reports/grades
router.get(
  '/grades',
  requireRole('ADMIN', 'MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await reportingRepository.getGradeDistribution(
        req.user!.campusId,
        req.query['academicYear'] as string
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);


// ── Consolidated Report ────────────────────────────────────

// GET /api/reports/consolidated
// Management only — all 4 campuses side by side
router.get(
  '/consolidated',
  requireRole('MANAGEMENT'),
  async (req: Request, res: Response) => {
    try {
      const result = await reportingRepository.getConsolidatedReport(
        req.query['academicYear'] as string
      );
      respond(res, result.rows);
    } catch (err) {
      fail(res, (err as Error).message, 500);
    }
  }
);

export default router;