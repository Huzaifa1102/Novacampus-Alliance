export interface Course {
  courseId:     string;
  courseName:   string;
  campusId:     string;
  programId:    string;
  instructorId: string;
  credits:      number;
  semester:     'S1' | 'S2';
  academicYear: string;
}