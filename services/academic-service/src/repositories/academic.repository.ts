import { QueryResult } from 'pg';
import { query } from '../db';

export interface CourseRow {
  course_id:     string;
  course_name:   string;
  campus_id:     string;
  program_id:    string;
  instructor_id: string;
  instructor_name?: string;
  credits:       number;
  semester:      string;
  academic_year: string;
  enrolled_count?: number;
}

export interface GradeRow {
  enrollment_id:   string;
  student_id:      string;
  course_id:       string;
  grade:           number | null;
  attendance_rate: number;
  status:          string;
  published:       boolean;
}

export interface AttendanceRow {
  attendance_id: string;
  enrollment_id: string;
  student_id:    string;
  course_id:     string;
  session_date:  string;
  present:       boolean;
}

export interface HistoryRow {
  enrollment_id:   string;
  course_id:       string;
  course_name:     string;
  credits:         number;
  semester:        string;
  academic_year:   string;
  grade:           number | null;
  attendance_rate: number;
  status:          string;
  published:       boolean;
}

export const academicRepository = {

  // ── Courses ──────────────────────────────────────────────

  async findAllCourses(
    campusId: string,
    filters: { semester?: string; academicYear?: string; programId?: string }
  ): Promise<QueryResult<CourseRow>> {
    const conditions: string[] = ['c.campus_id = $1'];
    const params: unknown[]    = [campusId];
    let   idx = 2;

    if (filters.semester) {
      conditions.push(`c.semester = $${idx++}`);
      params.push(filters.semester);
    }
    if (filters.academicYear) {
      conditions.push(`c.academic_year = $${idx++}`);
      params.push(filters.academicYear);
    }
    if (filters.programId) {
      conditions.push(`c.program_id = $${idx++}`);
      params.push(filters.programId);
    }

    return query(
      `SELECT c.*,
              CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
              COUNT(e.enrollment_id) AS enrolled_count
       FROM courses c
       LEFT JOIN instructors  i ON c.instructor_id = i.instructor_id
       LEFT JOIN enrollments  e ON c.course_id     = e.course_id
       WHERE ${conditions.join(' AND ')}
       GROUP BY c.course_id, i.first_name, i.last_name
       ORDER BY c.academic_year DESC, c.semester, c.course_name`,
      params,
      campusId
    );
  },

  async findCourseById(
    courseId: string,
    campusId: string
  ): Promise<QueryResult<CourseRow>> {
    return query(
      `SELECT c.*,
              CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
              COUNT(e.enrollment_id) AS enrolled_count
       FROM courses c
       LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
       LEFT JOIN enrollments e ON c.course_id     = e.course_id
       WHERE c.course_id = $1 AND c.campus_id = $2
       GROUP BY c.course_id, i.first_name, i.last_name`,
      [courseId, campusId],
      campusId
    );
  },

  // ── Grades ───────────────────────────────────────────────

  async findGradesByEnrollment(
    enrollmentId: string,
    campusId: string
  ): Promise<QueryResult<GradeRow>> {
    return query(
      `SELECT * FROM enrollments
       WHERE enrollment_id = $1 AND campus_id = $2`,
      [enrollmentId, campusId],
      campusId
    );
  },

  async findGradesByCourse(
    courseId:  string,
    campusId:  string,
    semester?: string,
    academicYear?: string
  ): Promise<QueryResult<GradeRow & { student_name: string }>> {
    return query(
      `SELECT e.*,
              CONCAT(s.first_name, ' ', s.last_name) AS student_name
       FROM enrollments e
       JOIN students s ON e.student_id = s.student_id
       JOIN courses  c ON e.course_id  = c.course_id
       WHERE e.course_id  = $1
         AND e.campus_id  = $2
         AND ($3::text IS NULL OR c.semester      = $3)
         AND ($4::text IS NULL OR c.academic_year = $4)
       ORDER BY s.last_name, s.first_name`,
      [courseId, campusId, semester || null, academicYear || null],
      campusId
    );
  },

  async saveGrade(
    enrollmentId: string,
    grade:        number,
    campusId:     string
  ): Promise<QueryResult<GradeRow>> {
    return query(
      `UPDATE enrollments
       SET grade = $1
       WHERE enrollment_id = $2
         AND campus_id     = $3
         AND published     = false
       RETURNING *`,
      [grade, enrollmentId, campusId],
      campusId
    );
  },

  async publishGrades(
    courseId:     string,
    campusId:     string
  ): Promise<QueryResult<GradeRow>> {
    return query(
      `UPDATE enrollments
       SET published = true,
           status    = CASE
             WHEN grade >= 10 THEN 'Completed'
             WHEN grade IS NOT NULL AND grade < 10 THEN 'Failed'
             ELSE status
           END
       WHERE course_id  = $1
         AND campus_id  = $2
         AND published  = false
       RETURNING *`,
      [courseId, campusId],
      campusId
    );
  },

  // ── Attendance ───────────────────────────────────────────

  async recordAttendance(data: {
    enrollmentId: string;
    studentId:    string;
    courseId:     string;
    campusId:     string;
    sessionDate:  string;
    present:      boolean;
  }): Promise<QueryResult<AttendanceRow>> {
    return query(
      `INSERT INTO attendance
         (enrollment_id, student_id, course_id, campus_id,
          session_date, present)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (enrollment_id, session_date)
       DO UPDATE SET present = EXCLUDED.present
       RETURNING *`,
      [
        data.enrollmentId,
        data.studentId,
        data.courseId,
        data.campusId,
        data.sessionDate,
        data.present
      ],
      data.campusId
    );
  },

  async updateAttendanceRate(
    enrollmentId: string,
    campusId:     string
  ): Promise<QueryResult<GradeRow>> {
    // Recompute attendance rate from raw attendance records
    return query(
      `UPDATE enrollments
       SET attendance_rate = (
         SELECT ROUND(
           100.0 * SUM(CASE WHEN present THEN 1 ELSE 0 END)
           / NULLIF(COUNT(*), 0),
           2
         )
         FROM attendance
         WHERE enrollment_id = $1
       )
       WHERE enrollment_id = $1
         AND campus_id     = $2
       RETURNING *`,
      [enrollmentId, campusId],
      campusId
    );
  },

  // ── History ──────────────────────────────────────────────

  async findHistory(
    studentId: string,
    campusId:  string
  ): Promise<QueryResult<HistoryRow>> {
    return query(
      `SELECT e.enrollment_id,
              c.course_id,
              c.course_name,
              c.credits,
              c.semester,
              c.academic_year,
              e.grade,
              e.attendance_rate,
              e.status,
              e.published
       FROM enrollments e
       JOIN courses c ON e.course_id = c.course_id
       WHERE e.student_id = $1
         AND e.campus_id  = $2
       ORDER BY c.academic_year DESC, c.semester DESC, c.course_name`,
      [studentId, campusId],
      campusId
    );
  }
};