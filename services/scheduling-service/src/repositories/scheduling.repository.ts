import { QueryResult } from 'pg';
import { query } from '../db';

export interface ScheduleRow {
  schedule_id:   string;
  course_id:     string;
  course_name?:  string;
  room_id:       string;
  room_name?:    string;
  campus_id:     string;
  instructor_id: string;
  instructor_name?: string;
  day_of_week:   string;
  start_time:    string;
  end_time:      string;
  semester:      string;
  academic_year: string;
}

export interface RoomRow {
  room_id:       string;
  room_name:     string;
  campus_id:     string;
  capacity:      number;
  room_type:     string;
}

export interface ConflictResult {
  hasConflict:          boolean;
  conflictingSchedule?: ScheduleRow;
  message?:             string;
}

export const schedulingRepository = {

  // ── Schedules ─────────────────────────────────────────────

  async findAll(
    campusId:     string,
    filters: {
      semester?:     string;
      academicYear?: string;
      instructorId?: string;
      roomId?:       string;
    }
  ): Promise<QueryResult<ScheduleRow>> {
    const conditions: string[] = ['s.campus_id = $1'];
    const params: unknown[]    = [campusId];
    let   idx = 2;

    if (filters.semester) {
      conditions.push(`s.semester = $${idx++}`);
      params.push(filters.semester);
    }
    if (filters.academicYear) {
      conditions.push(`s.academic_year = $${idx++}`);
      params.push(filters.academicYear);
    }
    if (filters.instructorId) {
      conditions.push(`s.instructor_id = $${idx++}`);
      params.push(filters.instructorId);
    }
    if (filters.roomId) {
      conditions.push(`s.room_id = $${idx++}`);
      params.push(filters.roomId);
    }

    return query(
      `SELECT s.*,
              c.course_name,
              r.room_name,
              CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
       FROM schedules s
       JOIN courses     c ON s.course_id     = c.course_id
       JOIN rooms       r ON s.room_id       = r.room_id
       JOIN instructors i ON s.instructor_id = i.instructor_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY
         CASE s.day_of_week
           WHEN 'Monday'    THEN 1
           WHEN 'Tuesday'   THEN 2
           WHEN 'Wednesday' THEN 3
           WHEN 'Thursday'  THEN 4
           WHEN 'Friday'    THEN 5
         END,
         s.start_time`,
      params,
      campusId
    );
  },

  async findByStudent(
    studentId: string,
    campusId:  string,
    semester?: string,
    academicYear?: string
  ): Promise<QueryResult<ScheduleRow>> {
    return query(
      `SELECT s.*,
              c.course_name,
              r.room_name,
              CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
       FROM schedules s
       JOIN courses     c  ON s.course_id     = c.course_id
       JOIN rooms       r  ON s.room_id       = r.room_id
       JOIN instructors i  ON s.instructor_id = i.instructor_id
       JOIN enrollments e  ON e.course_id     = s.course_id
       WHERE e.student_id   = $1
         AND s.campus_id    = $2
         AND e.campus_id    = $2
         AND ($3::text IS NULL OR s.semester      = $3)
         AND ($4::text IS NULL OR s.academic_year = $4)
       ORDER BY
         CASE s.day_of_week
           WHEN 'Monday'    THEN 1
           WHEN 'Tuesday'   THEN 2
           WHEN 'Wednesday' THEN 3
           WHEN 'Thursday'  THEN 4
           WHEN 'Friday'    THEN 5
         END,
         s.start_time`,
      [studentId, campusId, semester || null, academicYear || null],
      campusId
    );
  },

  async findById(
    scheduleId: string,
    campusId:   string
  ): Promise<QueryResult<ScheduleRow>> {
    return query(
      `SELECT s.*,
              c.course_name,
              r.room_name,
              CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
       FROM schedules s
       JOIN courses     c ON s.course_id     = c.course_id
       JOIN rooms       r ON s.room_id       = r.room_id
       JOIN instructors i ON s.instructor_id = i.instructor_id
       WHERE s.schedule_id = $1 AND s.campus_id = $2`,
      [scheduleId, campusId],
      campusId
    );
  },

  async create(data: {
    courseId:     string;
    roomId:       string;
    campusId:     string;
    instructorId: string;
    dayOfWeek:    string;
    startTime:    string;
    endTime:      string;
    semester:     string;
    academicYear: string;
  }): Promise<QueryResult<ScheduleRow>> {
    return query(
      `INSERT INTO schedules
         (course_id, room_id, campus_id, instructor_id,
          day_of_week, start_time, end_time, semester, academic_year)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        data.courseId,
        data.roomId,
        data.campusId,
        data.instructorId,
        data.dayOfWeek,
        data.startTime,
        data.endTime,
        data.semester,
        data.academicYear
      ],
      data.campusId
    );
  },

  async update(
    scheduleId: string,
    data: Partial<{
      roomId:    string;
      dayOfWeek: string;
      startTime: string;
      endTime:   string;
    }>,
    campusId: string
  ): Promise<QueryResult<ScheduleRow>> {
    const fields: string[]  = [];
    const params: unknown[] = [];
    let   idx = 1;

    if (data.roomId)    { fields.push(`room_id    = $${idx++}`); params.push(data.roomId);    }
    if (data.dayOfWeek) { fields.push(`day_of_week = $${idx++}`); params.push(data.dayOfWeek); }
    if (data.startTime) { fields.push(`start_time = $${idx++}`); params.push(data.startTime); }
    if (data.endTime)   { fields.push(`end_time   = $${idx++}`); params.push(data.endTime);   }

    if (fields.length === 0) throw new Error('No fields to update');

    params.push(scheduleId, campusId);

    return query(
      `UPDATE schedules
       SET ${fields.join(', ')}
       WHERE schedule_id = $${idx++} AND campus_id = $${idx}
       RETURNING *`,
      params,
      campusId
    );
  },

  async delete(
    scheduleId: string,
    campusId:   string
  ): Promise<QueryResult<ScheduleRow>> {
    return query(
      `DELETE FROM schedules
       WHERE schedule_id = $1 AND campus_id = $2
       RETURNING *`,
      [scheduleId, campusId],
      campusId
    );
  },

  // ── Conflict Detection ────────────────────────────────────

  async checkConflict(params: {
    roomId:       string;
    dayOfWeek:    string;
    startTime:    string;
    endTime:      string;
    semester:     string;
    academicYear: string;
    excludeId?:   string;   // Pass current scheduleId when updating
  }): Promise<ConflictResult> {
    const result = await query(
      `SELECT s.*,
              r.room_name,
              c.course_name
       FROM schedules s
       JOIN rooms   r ON s.room_id  = r.room_id
       JOIN courses c ON s.course_id = c.course_id
       WHERE s.room_id      = $1
         AND s.day_of_week  = $2
         AND s.semester     = $3
         AND s.academic_year = $4
         AND s.schedule_id  != COALESCE($5::uuid,
               '00000000-0000-0000-0000-000000000000'::uuid)
         AND (s.start_time, s.end_time)
               OVERLAPS ($6::time, $7::time)`,
      [
        params.roomId,
        params.dayOfWeek,
        params.semester,
        params.academicYear,
        params.excludeId || null,
        params.startTime,
        params.endTime
      ]
    );

    if (result.rows.length > 0) {
      const conflict = result.rows[0] as ScheduleRow;
      return {
        hasConflict:          true,
        conflictingSchedule:  conflict,
        message: `Room ${conflict.room_name} is already booked for ` +
                 `${conflict.course_name} on ${conflict.day_of_week} ` +
                 `${conflict.start_time}–${conflict.end_time}`
      };
    }

    return { hasConflict: false };
  },

  // ── Rooms ─────────────────────────────────────────────────

  async findAllRooms(campusId: string): Promise<QueryResult<RoomRow>> {
    return query(
      `SELECT * FROM rooms
       WHERE campus_id = $1
       ORDER BY room_name`,
      [campusId],
      campusId
    );
  },

  // Get all students enrolled in courses that use a given schedule
  async findAffectedStudents(
    scheduleId: string,
    campusId:   string
  ): Promise<QueryResult<{ student_id: string; email: string }>> {
    return query(
      `SELECT DISTINCT s.student_id, s.email
       FROM students    s
       JOIN enrollments e  ON e.student_id = s.student_id
       JOIN schedules   sc ON sc.course_id = e.course_id
       WHERE sc.schedule_id = $1
         AND sc.campus_id   = $2
         AND e.status       = 'Active'`,
      [scheduleId, campusId],
      campusId
    );
  }
};