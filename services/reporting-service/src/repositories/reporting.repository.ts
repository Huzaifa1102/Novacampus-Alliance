import { QueryResult } from 'pg';
import { query } from '../db';

// ── KPI Types ──────────────────────────────────────────────

export interface CampusKpiRow {
  campus_id:          string;
  campus_name:        string;
  total_students:     number;
  active_students:    number;
  total_enrollments:  number;
  success_rate:       number;
  avg_grade:          number;
  avg_attendance:     number;
  paid_payments:      number;
  total_payments:     number;
  default_rate:       number;
  collected_amount:   number;
  total_amount:       number;
}

export interface ProgramKpiRow {
  program_id:         string;
  program_name:       string;
  campus_id:          string;
  total_students:     number;
  active_students:    number;
  success_rate:       number;
  avg_grade:          number;
  avg_attendance:     number;
}

export interface AtRiskRow {
  student_id:      string;
  first_name:      string;
  last_name:       string;
  email:           string;
  campus_id:       string;
  program_name:    string;
  avg_grade:       number | null;
  avg_attendance:  number | null;
  payment_status:  string | null;
  risk_reasons:    string[];
}

export interface EnrollmentTrendRow {
  academic_year:    string;
  semester:         string;
  campus_id:        string;
  total_enrollments: number;
  completed:        number;
  failed:           number;
  dropped:          number;
  success_rate:     number;
}

export interface GradeDistributionRow {
  campus_id:    string;
  course_id:    string;
  course_name:  string;
  grade_range:  string;
  count:        number;
  percentage:   number;
}

export const reportingRepository = {

  // ── Campus-level KPIs (Management dashboard) ──────────────

  async getCampusKpis(
    campusId?: string
  ): Promise<QueryResult<CampusKpiRow>> {
    const condition = campusId ? `WHERE c.campus_id = $1` : '';
    const params    = campusId ? [campusId] : [];

    return query(
      `SELECT
         c.campus_id,
         c.campus_name,

         -- Student counts
         COUNT(DISTINCT s.student_id)
           AS total_students,
         COUNT(DISTINCT s.student_id) FILTER (WHERE s.status = 'Active')
           AS active_students,

         -- Enrollment counts
         COUNT(e.enrollment_id)
           AS total_enrollments,

         -- Academic performance
         ROUND(
           100.0 * COUNT(e.enrollment_id) FILTER (WHERE e.status = 'Completed')
           / NULLIF(COUNT(e.enrollment_id) FILTER (
               WHERE e.status IN ('Completed','Failed')
             ), 0),
           2
         ) AS success_rate,

         ROUND(AVG(e.grade) FILTER (WHERE e.grade IS NOT NULL), 2)
           AS avg_grade,

         ROUND(AVG(e.attendance_rate), 2)
           AS avg_attendance,

         -- Financial health
         COUNT(p.payment_id) FILTER (WHERE p.status = 'Paid')
           AS paid_payments,
         COUNT(p.payment_id)
           AS total_payments,
         ROUND(
           100.0 * COUNT(p.payment_id) FILTER (WHERE p.status = 'Delay')
           / NULLIF(COUNT(p.payment_id), 0),
           2
         ) AS default_rate,
         COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'Paid'), 0)
           AS collected_amount,
         COALESCE(SUM(p.amount), 0)
           AS total_amount

       FROM campuses    c
       LEFT JOIN students    s  ON s.campus_id   = c.campus_id
       LEFT JOIN enrollments e  ON e.student_id  = s.student_id
       LEFT JOIN payments    p  ON p.student_id  = s.student_id
       ${condition}
       GROUP BY c.campus_id, c.campus_name
       ORDER BY c.campus_name`,
      params
    );
  },

  // ── Program-level KPIs (Admin dashboard) ──────────────────

  async getProgramKpis(
    campusId: string,
    academicYear?: string
  ): Promise<QueryResult<ProgramKpiRow>> {
    return query(
      `SELECT
         p.program_id,
         p.program_name,
         p.campus_id,

         COUNT(DISTINCT s.student_id)
           AS total_students,
         COUNT(DISTINCT s.student_id) FILTER (WHERE s.status = 'Active')
           AS active_students,

         ROUND(
           100.0 * COUNT(e.enrollment_id) FILTER (WHERE e.status = 'Completed')
           / NULLIF(COUNT(e.enrollment_id) FILTER (
               WHERE e.status IN ('Completed','Failed')
             ), 0),
           2
         ) AS success_rate,

         ROUND(AVG(e.grade) FILTER (WHERE e.grade IS NOT NULL), 2)
           AS avg_grade,

         ROUND(AVG(e.attendance_rate), 2)
           AS avg_attendance

       FROM programs    p
       LEFT JOIN students    s  ON s.program_id  = p.program_id
                                AND s.campus_id  = p.campus_id
       LEFT JOIN enrollments e  ON e.student_id  = s.student_id
       LEFT JOIN courses     c  ON c.course_id   = e.course_id
       WHERE p.campus_id = $1
         AND ($2::text IS NULL OR c.academic_year = $2)
       GROUP BY p.program_id, p.program_name, p.campus_id
       ORDER BY p.program_name`,
      [campusId, academicYear || null],
      campusId
    );
  },

  // ── At-Risk Students ───────────────────────────────────────

  async getAtRiskStudents(
    campusId: string,
    thresholds: {
      minGrade?:      number;   // default 10
      minAttendance?: number;   // default 75
    } = {}
  ): Promise<QueryResult<AtRiskRow>> {
    const minGrade      = thresholds.minGrade      ?? 10;
    const minAttendance = thresholds.minAttendance ?? 75;

    return query(
      `SELECT
         s.student_id,
         s.first_name,
         s.last_name,
         s.email,
         s.campus_id,
         pr.program_name,

         ROUND(AVG(e.grade) FILTER (WHERE e.grade IS NOT NULL), 2)
           AS avg_grade,
         ROUND(AVG(e.attendance_rate), 2)
           AS avg_attendance,

         -- Latest payment status
         (SELECT p2.status
          FROM payments p2
          WHERE p2.student_id = s.student_id
          ORDER BY p2.due_date DESC
          LIMIT 1)            AS payment_status,

         -- Build risk reasons array
         ARRAY_REMOVE(ARRAY[
           CASE WHEN AVG(e.grade) FILTER (WHERE e.grade IS NOT NULL) < $2
                THEN 'Low average grade'         END,
           CASE WHEN AVG(e.attendance_rate) < $3
                THEN 'Low attendance rate'       END,
           CASE WHEN (
             SELECT p3.status FROM payments p3
             WHERE p3.student_id = s.student_id
             ORDER BY p3.due_date DESC LIMIT 1
           ) = 'Delay'
                THEN 'Payment overdue'           END
         ], NULL)             AS risk_reasons

       FROM students    s
       JOIN programs    pr ON pr.program_id = s.program_id
                           AND pr.campus_id = s.campus_id
       LEFT JOIN enrollments e ON e.student_id = s.student_id
       WHERE s.campus_id = $1
         AND s.status    = 'Active'
       GROUP BY s.student_id, s.first_name, s.last_name,
                s.email, s.campus_id, pr.program_name
       HAVING
         AVG(e.grade) FILTER (WHERE e.grade IS NOT NULL) < $2
         OR AVG(e.attendance_rate) < $3
         OR (
           SELECT p4.status FROM payments p4
           WHERE p4.student_id = s.student_id
           ORDER BY p4.due_date DESC LIMIT 1
         ) = 'Delay'
       ORDER BY avg_grade ASC NULLS LAST`,
      [campusId, minGrade, minAttendance],
      campusId
    );
  },

  // ── Enrollment Trends ──────────────────────────────────────

  async getEnrollmentTrends(
    campusId: string
  ): Promise<QueryResult<EnrollmentTrendRow>> {
    return query(
      `SELECT
         c.academic_year,
         c.semester,
         e.campus_id,
         COUNT(e.enrollment_id)                                     AS total_enrollments,
         COUNT(e.enrollment_id) FILTER (WHERE e.status = 'Completed') AS completed,
         COUNT(e.enrollment_id) FILTER (WHERE e.status = 'Failed')    AS failed,
         COUNT(e.enrollment_id) FILTER (WHERE e.status = 'Dropped')   AS dropped,
         ROUND(
           100.0 * COUNT(e.enrollment_id) FILTER (WHERE e.status = 'Completed')
           / NULLIF(COUNT(e.enrollment_id) FILTER (
               WHERE e.status IN ('Completed','Failed')
             ), 0),
           2
         ) AS success_rate
       FROM enrollments e
       JOIN courses c ON e.course_id = c.course_id
       WHERE e.campus_id = $1
       GROUP BY c.academic_year, c.semester, e.campus_id
       ORDER BY c.academic_year DESC, c.semester`,
      [campusId],
      campusId
    );
  },

  // ── Grade Distribution ─────────────────────────────────────

  async getGradeDistribution(
    campusId:      string,
    academicYear?: string
  ): Promise<QueryResult<GradeDistributionRow>> {
    return query(
      `SELECT
         e.campus_id,
         c.course_id,
         c.course_name,
         CASE
           WHEN e.grade >= 16 THEN '16-20 (Excellent)'
           WHEN e.grade >= 14 THEN '14-16 (Very Good)'
           WHEN e.grade >= 12 THEN '12-14 (Good)'
           WHEN e.grade >= 10 THEN '10-12 (Pass)'
           ELSE                    '0-10  (Fail)'
         END AS grade_range,
         COUNT(*)                                               AS count,
         ROUND(
           100.0 * COUNT(*)
           / NULLIF(COUNT(*) OVER (PARTITION BY c.course_id), 0),
           2
         )                                                      AS percentage
       FROM enrollments e
       JOIN courses c ON e.course_id = c.course_id
       WHERE e.campus_id  = $1
         AND e.grade IS NOT NULL
         AND e.published  = true
         AND ($2::text IS NULL OR c.academic_year = $2)
       GROUP BY e.campus_id, c.course_id, c.course_name, grade_range
       ORDER BY c.course_name, grade_range`,
      [campusId, academicYear || null],
      campusId
    );
  },

  // ── Consolidated cross-campus report (Management only) ────

  async getConsolidatedReport(
    academicYear?: string
  ): Promise<QueryResult<CampusKpiRow>> {
    // Reuse getCampusKpis without a campusId filter
    // to get all 4 campuses in one query
    return reportingRepository.getCampusKpis();
  }
};