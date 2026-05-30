import { academicRepository } from '../repositories/academic.repository';

export async function recordAttendance(data: {
  enrollmentId: string;
  studentId:    string;
  courseId:     string;
  campusId:     string;
  sessionDate:  string;
  present:      boolean;
}) {
  // Record the attendance entry
  const attendance = await academicRepository.recordAttendance(data);

  // Immediately recompute the running attendance rate
  const updated = await academicRepository.updateAttendanceRate(
    data.enrollmentId,
    data.campusId
  );

  return {
    attendance:     attendance.rows[0],
    attendanceRate: updated.rows[0]?.attendance_rate ?? null
  };
}