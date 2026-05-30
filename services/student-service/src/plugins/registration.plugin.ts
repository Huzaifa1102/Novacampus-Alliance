import { studentRepository } from '../repositories/student.repository';

export async function registerStudent(data: {
  firstName:      string;
  lastName:       string;
  email:          string;
  dateOfBirth?:   string;
  campusId:       string;
  programId:      string;
  enrollmentDate: string;
}) {
  // Generate student ID: STU + timestamp suffix
  const count = await studentRepository.findAll(data.campusId);
  const nextNum = (count.rowCount ?? 0) + 1;
  const studentId = `STU${String(nextNum).padStart(3, '0')}`;

  const result = await studentRepository.create({
    ...data,
    studentId
  });

  return result.rows[0];
}