import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // <-- Imported your custom guard
import { LoginComponent } from './features/auth/login/login.component';

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
import { DocumentsComponent } from './features/student/documents/documents.component';
import { RepositoriesComponent } from './features/student/repositories/repositories.component';

// --- Teacher ---
import { ScheduleComponent } from './features/teacher/schedule/schedule.component';
import { GradingComponent } from './features/teacher/grading/grading.component';
import { AttendanceComponent } from './features/teacher/attendance/attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: 'management/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'repositories', component: RepositoriesComponent },

  // Management Routes (Left unguarded for platform overview analytics)
  { path: 'management/dashboard', component: DashboardComponent },
  { path: 'management/campus', component: CampusComponent },
  { path: 'management/alerts', component: StrategicAlertsComponent },
  
  // Admin Routes (Secured with your 'admin' role evaluation)
  { path: 'admin/register', component: StudentRegistrationComponent, canActivate: [authGuard('admin')] },
  { path: 'admin/students/:id', component: StudentFileComponent, canActivate: [authGuard('admin')] },
  { path: 'admin/scheduling', component: RoomSchedulingComponent, canActivate: [authGuard('admin')] },
  { path: 'admin/payments', component: PaymentsComponent, canActivate: [authGuard('admin')] },

  // Student Routes (Secured with your 'student' role evaluation)
  { path: 'student/timetable', component: TimetableComponent, canActivate: [authGuard('student')] },
  { path: 'student/grades', component: GradesComponent, canActivate: [authGuard('student')] },
  { path: 'student/documents', component: DocumentsComponent, canActivate: [authGuard('student')] },
  { path: 'student/repositories', component: RepositoriesComponent, canActivate: [authGuard('student')] },

  // Teacher Routes (Secured with your 'teacher' role evaluation)
  { path: 'teacher/schedule', component: ScheduleComponent, canActivate: [authGuard('teacher')] },
  { path: 'teacher/grading', component: GradingComponent, canActivate: [authGuard('teacher')] },
  { path: 'teacher/attendance', component: AttendanceComponent, canActivate: [authGuard('teacher')] },
  
  // Fallback
  { path: '**', redirectTo: 'management/dashboard' }
];