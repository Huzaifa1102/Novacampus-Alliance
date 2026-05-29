export type StudentStatus = 'Active' | 'Inactive' | 'Graduated' | 'Suspended';

export interface Student {
  studentId:      string;
  firstName:      string;
  lastName:       string;
  email:          string;
  dateOfBirth?:   string;
  campusId:       string;
  programId:      string;
  enrollmentDate: string;
  status:         StudentStatus;
}