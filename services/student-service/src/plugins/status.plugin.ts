import { studentRepository } from '../repositories/student.repository';

const VALID_STATUSES = ['Active', 'Inactive', 'Graduated', 'Suspended'];

export async function updateStudentStatus(
  studentId: string,
  status:    string,
  campusId:  string
) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      `Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  const result = await studentRepository.updateStatus(
    studentId,
    status,
    campusId
  );

  if (result.rowCount === 0) {
    throw new Error(`Student ${studentId} not found`);
  }

  return result.rows[0];
}