import { studentRepository } from '../repositories/student.repository';

export async function enrollStudent(data: {
  studentId: string;
  courseId:  string;
  campusId:  string;
}) {
  // Check student exists and is active
  const studentResult = await studentRepository.findById(
    data.studentId,
    data.campusId
  );

  if (studentResult.rowCount === 0) {
    throw new Error(`Student ${data.studentId} not found`);
  }

  const student = studentResult.rows[0];
  if (student.status !== 'Active') {
    throw new Error(
      `Cannot enroll student with status: ${student.status}`
    );
  }

  const result = await studentRepository.enroll({
    ...data,
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

  if (result.rowCount === 0) {
    throw new Error(
      `Student ${data.studentId} is already enrolled in course ${data.courseId}`
    );
  }

  return result.rows[0];
}