import {
  schedulingRepository,
  ConflictResult
} from '../repositories/scheduling.repository';

export async function checkAndCreate(data: {
  courseId:     string;
  roomId:       string;
  campusId:     string;
  instructorId: string;
  dayOfWeek:    string;
  startTime:    string;
  endTime:      string;
  semester:     string;
  academicYear: string;
}) {
  // Step 1 — Check for room conflict before saving anything
  const conflict: ConflictResult = await schedulingRepository.checkConflict({
    roomId:       data.roomId,
    dayOfWeek:    data.dayOfWeek,
    startTime:    data.startTime,
    endTime:      data.endTime,
    semester:     data.semester,
    academicYear: data.academicYear
  });

  if (conflict.hasConflict) {
    throw new ConflictError(conflict.message!);
  }

  // Step 2 — No conflict found, safe to save
  const result = await schedulingRepository.create(data);
  return result.rows[0];
}

export async function checkAndUpdate(
  scheduleId: string,
  data: Partial<{
    roomId:    string;
    dayOfWeek: string;
    startTime: string;
    endTime:   string;
  }>,
  campusId: string
) {
  // Fetch the current schedule to fill in unchanged fields
  const current = await schedulingRepository.findById(scheduleId, campusId);
  if (current.rowCount === 0) {
    throw new Error(`Schedule ${scheduleId} not found`);
  }

  const existing = current.rows[0];

  // Merge incoming changes with existing values
  const merged = {
    roomId:    data.roomId    || existing.room_id,
    dayOfWeek: data.dayOfWeek || existing.day_of_week,
    startTime: data.startTime || existing.start_time,
    endTime:   data.endTime   || existing.end_time
  };

  // Check conflict excluding the current schedule from results
  const conflict: ConflictResult = await schedulingRepository.checkConflict({
    roomId:       merged.roomId,
    dayOfWeek:    merged.dayOfWeek,
    startTime:    merged.startTime,
    endTime:      merged.endTime,
    semester:     existing.semester,
    academicYear: existing.academic_year,
    excludeId:    scheduleId
  });

  if (conflict.hasConflict) {
    throw new ConflictError(conflict.message!);
  }

  // Safe to update
  const result = await schedulingRepository.update(
    scheduleId,
    data,
    campusId
  );
  return result.rows[0];
}

// Custom error class so the controller can return 409 specifically
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}