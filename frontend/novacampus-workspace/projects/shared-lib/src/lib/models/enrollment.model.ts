export type EnrollmentStatus = 'Active' | 'Completed' | 'Dropped' | 'Failed';

export interface Enrollment {
  enrollmentId:   string;
  studentId:      string;
  courseId:       string;
  campusId:       string;
  enrollmentDate: string;
  grade:          number | null;
  attendanceRate: number;
  status:         EnrollmentStatus;
  published:      boolean;
}