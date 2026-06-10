import { Component, inject } from '@angular/core'; // <-- Added inject here
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="sm:mx-auto w-full max-w-md text-center">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">NovaCampus Alliance</h2>
        <p class="mt-2 text-sm text-slate-600">Select a sandbox profile to simulate workspace authentication</p>
      </div>

      <div class="mt-8 sm:mx-auto w-full max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl border border-slate-200 rounded-2xl sm:px-10 space-y-4">
          
          <button (click)="mockLogin('admin', '/admin/scheduling')" 
            class="w-full flex items-center justify-between px-5 py-4 border border-amber-200 rounded-xl bg-amber-50 hover:bg-amber-100/70 transition-all group"
            aria-label="Login as Administrator">
            <div class="flex items-center gap-3 text-left">
              <span class="p-2 rounded-lg bg-amber-500 text-white font-bold text-sm">AD</span>
              <div>
                <p class="text-sm font-bold text-amber-900">Administrator Profile</p>
                <p class="text-xs text-amber-700">Access scheduling, financial ledger, registrations</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <button (click)="mockLogin('teacher', '/teacher/schedule')" 
            class="w-full flex items-center justify-between px-5 py-4 border border-emerald-200 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 transition-all group"
            aria-label="Login as Faculty Member">
            <div class="flex items-center gap-3 text-left">
              <span class="p-2 rounded-lg bg-emerald-600 text-white font-bold text-sm">FA</span>
              <div>
                <p class="text-sm font-bold text-emerald-900">Faculty/Teacher Profile</p>
                <p class="text-xs text-emerald-700">Manage classroom attendance, grades, schedules</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <button (click)="mockLogin('student', '/student/timetable')" 
            class="w-full flex items-center justify-between px-5 py-4 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100/70 transition-all group"
            aria-label="Login as Student">
            <div class="flex items-center gap-3 text-left">
              <span class="p-2 rounded-lg bg-blue-600 text-white font-bold text-sm">ST</span>
              <div>
                <p class="text-sm font-bold text-blue-900">Student Profile</p>
                <p class="text-xs text-blue-700">View personal timetable, grades, documents</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <div class="pt-4 border-t border-slate-100">
            <button (click)="logout()" class="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 transition-colors">
              Clear active access session (Logout)
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  // Use modern token injection instead of constructor params
  private router = inject(Router);
  private authService = inject(AuthService);

  mockLogin(role: string, targetUrl: string) {
    this.authService.setRole(role);
    localStorage.setItem('access_token', `mock_jwt_token_for_${role}`);
    this.router.navigate([targetUrl]);
  }

  logout() {
    this.authService.logout();
    alert('Session flushed. All roles cleared.');
  }
}