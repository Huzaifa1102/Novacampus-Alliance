import { QueryResult } from 'pg';
import { query } from '../db';

// Explicit row types
export interface StudentRow {
  student_id:      string;
  first_name:      string;
  last_name:       string;
  email:           string;
  date_of_birth:   string | null;
  campus_id:       string;
  program_id:      string;
  program_name?:   string;
  campus_name?:    string;
  enrollment_date: string;
  status:          string;
  enrollments?:    EnrollmentRow[];
}

export interface EnrollmentRow {
  enrollment_id:   string;
  student_id:      string;
  course_id:       string;
  course_name?:    string;
  campus_id:       string;
  enrollment_date: string;
  grade:           number | null;
  attendance_rate: number;
  status:          string;
  published:       boolean;
  credits?:        number;
  semester?:       string;
  academic_year?:  string;
}

export const studentRepository = {

  async findAll(campusId: string): Promise<QueryResult<StudentRow>> {
    return query(
      `SELECT s.*, p.program_name
       FROM students s
       JOIN programs p ON s.program_id = p.program_id
       WHERE s.campus_id = $1
       ORDER BY s.last_name, s.first_name`,
      [campusId],
      campusId
    );
  },

  async findById(
    studentId: string,
    campusId:  string
  ): Promise<QueryResult<StudentRow>> {
    return query(
      `SELECT s.*,
              p.program_name,
              c.campus_name,
              json_agg(
                json_build_object(
                  'enrollmentId',   e.enrollment_id,
                  'courseId',       e.course_id,
                  'courseName',     co.course_name,
                  'grade',          e.grade,
                  'attendanceRate', e.attendance_rate,
                  'status',         e.status
                )
              ) FILTER (WHERE e.enrollment_id IS NOT NULL) AS enrollments
       FROM students s
       JOIN programs  p  ON s.program_id  = p.program_id
       JOIN campuses  c  ON s.campus_id   = c.campus_id
       LEFT JOIN enrollments e  ON e.student_id = s.student_id
       LEFT JOIN courses     co ON co.course_id  = e.course_id
       WHERE s.student_id = $1 AND s.campus_id = $2
       GROUP BY s.student_id, p.program_name, c.campus_name`,
      [studentId, campusId],
      campusId
    );
  },

  async create(data: {
    studentId:      string;
    firstName:      string;
    lastName:       string;
    email:          string;
    dateOfBirth?:   string;
    campusId:       string;
    programId:      string;
    enrollmentDate: string;
  }): Promise<QueryResult<StudentRow>> {
    return query(
      `INSERT INTO students
         (student_id, first_name, last_name, email,
          date_of_birth, campus_id, program_id, enrollment_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        data.studentId,
        data.firstName,
        data.lastName,
        data.email,
        data.dateOfBirth || null,
        data.campusId,
        data.programId,
        data.enrollmentDate
      ],
      data.campusId
    );
  },

  async updateStatus(
    studentId: string,
    status:    string,
    campusId:  string
  ): Promise<QueryResult<StudentRow>> {
    return query(
      `UPDATE students
       SET status = $1
       WHERE student_id = $2 AND campus_id = $3
       RETURNING *`,
      [status, studentId, campusId],
      campusId
    );
  },

  async enroll(data: {
    studentId:      string;
    courseId:       string;
    campusId:       string;
    enrollmentDate: string;
  }): Promise<QueryResult<EnrollmentRow>> {
    return query(
      `INSERT INTO enrollments
         (student_id, course_id, campus_id, enrollment_date)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (student_id, course_id) DO NOTHING
       RETURNING *`,
      [
        data.studentId,
        data.courseId,
        data.campusId,
        data.enrollmentDate
      ],
      data.campusId
    );
  },

  async findEnrollments(
    studentId: string,
    campusId:  string
  ): Promise<QueryResult<EnrollmentRow>> {
    return query(
      `SELECT e.*,
              c.course_name,
              c.credits,
              c.semester,
              c.academic_year
       FROM enrollments e
       JOIN courses c ON e.course_id = c.course_id
       WHERE e.student_id = $1 AND e.campus_id = $2
       ORDER BY c.academic_year DESC, c.semester DESC`,
      [studentId, campusId],
      campusId
    );
  }
};