import { academicRepository } from '../repositories/academic.repository';

export async function saveGrade(
  enrollmentId: string,
  grade:        number,
  campusId:     string
) {
  // Validate grade range
  if (grade < 0 || grade > 20) {
    throw new Error('Grade must be between 0 and 20');
  }

  const result = await academicRepository.saveGrade(
    enrollmentId,
    grade,
    campusId
  );

  if (result.rowCount === 0) {
    throw new Error(
      `Enrollment ${enrollmentId} not found or grades are already published`
    );
  }

  return result.rows[0];
}

export async function publishGrades(
  courseId: string,
  campusId: string
) {
  const result = await academicRepository.publishGrades(
    courseId,
    campusId
  );

  if (result.rowCount === 0) {
    throw new Error(
      `No unpublished grades found for course ${courseId}`
    );
  }

  return {
    published: result.rowCount,
    records:   result.rows
  };
}