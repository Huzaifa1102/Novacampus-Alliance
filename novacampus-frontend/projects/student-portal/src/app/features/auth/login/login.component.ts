import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="sm:mx-auto w-full max-w-md text-center">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">NovaCampus Alliance</h2>
        <p class="mt-2 text-sm text-slate-600">Sign in with your Keycloak credentials</p>
      </div>

      <div class="mt-8 sm:mx-auto w-full max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl border border-slate-200 rounded-2xl sm:px-10 space-y-4">

          @if (errorMessage()) {
            <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {{ errorMessage() }}
            </div>
          }

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input [(ngModel)]="username" type="text" placeholder="e.g. student1"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input [(ngModel)]="password" type="password" placeholder="••••••••"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <button (click)="login()" [disabled]="loading()"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-sm">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="pt-2 border-t border-slate-100 text-xs text-slate-400 text-center">
            Realm: <strong>novacampus</strong> · Client: <strong>student-portal</strong>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private http   = inject(HttpClient);
  private auth   = inject(AuthService);
  private router = inject(Router);

  username     = '';
  password     = '';
  loading      = signal(false);
  errorMessage = signal<string | null>(null);

  login() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.http.post<any>(
      'http://localhost:8080/realms/novacampus/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'password',
        client_id:  'student-portal',
        username:   this.username,
        password:   this.password,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).subscribe({
      next: (res) => {
        this.auth.setAccessToken(res.access_token);
        this.auth.setRefreshToken(res.refresh_token);
        
        const role = this.auth.getRole();
        const destinations: Record<string, string> = {
          admin: '/admin/scheduling',
          teacher: '/teacher/schedule',
          student: '/student/timetable',
        };
      
        const targetRoute = destinations[role ?? ''] ?? '/login';
        
        // Handle the navigation promise
        this.router.navigate([targetRoute]).then((success) => {
          if (!success) {
            this.errorMessage.set(`Routing failed: ${targetRoute} does not exist in this portal.`);
            this.loading.set(false); // <--- This fixes the infinite spinner
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 401
            ? 'Invalid username or password.'
            : 'Could not reach authentication server. Is Keycloak running?'
        );
      }
    });
  }
}