export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface Schedule {
  scheduleId:   string;
  courseId:     string;
  courseName?:  string;
  roomId:       string;
  roomName?:    string;
  campusId:     string;
  instructorId: string;
  dayOfWeek:    DayOfWeek;
  startTime:    string;
  endTime:      string;
  semester:     'S1' | 'S2';
  academicYear: string;
}