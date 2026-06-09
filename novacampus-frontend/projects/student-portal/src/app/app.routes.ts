import { Routes } from '@angular/router';

// --- Management ---
import { DashboardComponent } from './features/management/dashboard/dashboard.component';
import { CampusComponent } from './features/management/campus/campus.component';
import { StrategicAlertsComponent } from './features/management/alerts/alerts.component';

// --- Admin ---
import { StudentRegistrationComponent } from './features/admin/student-registration/student-registration.component';
import { StudentFileComponent } from './features/admin/student-file/student-file.component';
import { RoomSchedulingComponent } from './features/admin/room-scheduling/room-scheduling.component'; 
import { PaymentsComponent } from './features/admin/payments/payments.component';

// --- Student ---
import { TimetableComponent } from './features/student/timetable/timetable.component';
import { GradesComponent } from './features/student/grades/grades.component';
import { DocumentsComponent } from './features/student/documents/documents.component'; // <-- FIXED

// --- Teacher ---
import { ScheduleComponent } from './features/teacher/schedule/schedule.component';
import { GradingComponent } from './features/teacher/grading/grading.component';
import { AttendanceComponent } from './features/teacher/attendance/attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: 'management/dashboard', pathMatch: 'full' },
  
  // Management Routes
  { path: 'management/dashboard', component: DashboardComponent },
  { path: 'management/campus', component: CampusComponent },
  { path: 'management/alerts', component: StrategicAlertsComponent },
  
  // Admin Routes
  { path: 'admin/register', component: StudentRegistrationComponent },
  { path: 'admin/students/:id', component: StudentFileComponent },
  { path: 'admin/scheduling', component: RoomSchedulingComponent },
  { path: 'admin/payments', component: PaymentsComponent },

  // Student Routes
  { path: 'student/timetable', component: TimetableComponent },
  { path: 'student/grades', component: GradesComponent },
  { path: 'student/documents', component: DocumentsComponent }, // <-- FIXED

  // Teacher Routes
  { path: 'teacher/schedule', component: ScheduleComponent },
  { path: 'teacher/grading', component: GradingComponent },
  { path: 'teacher/attendance', component: AttendanceComponent },
  
  // Fallback
  { path: '**', redirectTo: 'management/dashboard' }
];