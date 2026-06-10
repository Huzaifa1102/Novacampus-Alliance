import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], 
  template: `
    <div class="flex h-screen bg-surface font-sans text-text-main overflow-hidden relative">
      
      <div *ngIf="isMobileMenuOpen" 
           (click)="closeMobileMenu()"
           class="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300">
      </div>

      <aside [ngClass]="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
             class="fixed inset-y-0 left-0 z-30 w-64 bg-brand-dark text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        
        <div class="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <span class="font-bold text-xl tracking-wide">Novacampus</span>
          <button (click)="closeMobileMenu()" class="md:hidden text-gray-300 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          
          <ng-container *ngIf="currentRole === 'management' || currentRole === 'admin'">
            <div class="text-xs font-bold text-brand-accent uppercase tracking-wider mb-3 mt-2 px-2">Management</div>
            <a routerLink="/management/dashboard" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">KPI Dashboard</a>
            <a routerLink="/management/campus" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Campus Overview</a>
            <a routerLink="/management/alerts" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Strategic Alerts</a>
          </ng-container>

          <ng-container *ngIf="currentRole === 'admin'">
            <div class="text-xs font-bold text-brand-accent uppercase tracking-wider mb-3 mt-8 px-2">Administration</div>
            <a routerLink="/admin/register" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Student Registration</a>
            <a routerLink="/admin/scheduling" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Room Scheduling</a>
            <a routerLink="/admin/payments" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Payments Dashboard</a>
          </ng-container>

          <ng-container *ngIf="currentRole === 'student'">
            <div class="text-xs font-bold text-brand-accent uppercase tracking-wider mb-3 mt-2 px-2">My Portal</div>
            <a routerLink="/student/timetable" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">My Timetable</a>
            <a routerLink="/student/grades" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Grades & Absences</a>
            <a routerLink="/student/documents" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">My Documents</a>
          </ng-container>

          <ng-container *ngIf="currentRole === 'teacher'">
            <div class="text-xs font-bold text-brand-accent uppercase tracking-wider mb-3 mt-2 px-2">Faculty Portal</div>
            <a routerLink="/teacher/schedule" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Teaching Schedule</a>
            <a routerLink="/teacher/grading" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Grade Entry</a>
            <a routerLink="/teacher/attendance" routerLinkActive="bg-brand-primary" (click)="closeMobileMenu()" class="block px-4 py-2.5 rounded-lg hover:bg-brand-primary/50 transition-all duration-200">Log Attendance</a>
          </ng-container>

        </nav>

        <div class="p-4 border-t border-white/10">
          <button class="w-full flex items-center justify-center px-4 py-2 text-sm text-brand-dark bg-brand-accent hover:bg-yellow-500 rounded-lg transition-all duration-200 font-bold shadow-md">
            Logout
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col overflow-hidden w-full">
        
        <header class="h-16 bg-white border-b border-border-light flex items-center justify-between px-4 md:px-8 shadow-sm z-10 shrink-0">
          <button (click)="toggleMobileMenu()" class="p-2 mr-2 -ml-2 text-text-muted hover:text-brand-primary rounded-md md:hidden transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div class="text-xl font-bold text-brand-dark md:hidden">Novacampus</div>
          
          <div class="hidden md:flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 ml-4">
            <span class="text-xs font-bold text-gray-500 mr-2 px-2 uppercase tracking-wide">View As:</span>
            <button (click)="setRole('admin')" [ngClass]="currentRole === 'admin' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-600 hover:bg-gray-200'" class="px-3 py-1 text-sm font-semibold rounded-md transition-all">Admin</button>
            <button (click)="setRole('management')" [ngClass]="currentRole === 'management' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-600 hover:bg-gray-200'" class="px-3 py-1 text-sm font-semibold rounded-md transition-all">Mgmt</button>
            <button (click)="setRole('teacher')" [ngClass]="currentRole === 'teacher' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-600 hover:bg-gray-200'" class="px-3 py-1 text-sm font-semibold rounded-md transition-all">Teacher</button>
            <button (click)="setRole('student')" [ngClass]="currentRole === 'student' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-600 hover:bg-gray-200'" class="px-3 py-1 text-sm font-semibold rounded-md transition-all">Student</button>
          </div>
          
          <div class="flex-1"></div>
          
          <div class="flex items-center space-x-3 md:space-x-4">
            <span class="hidden md:block text-sm font-semibold text-text-muted capitalize">{{ currentRole }} User</span>
            <div class="h-9 w-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-inner ring-2 ring-white uppercase">
              {{ currentRole.charAt(0) }}
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative bg-surface">
          <router-outlet></router-outlet>
        </main>
        
      </div>
    </div>
  `
})
export class AppComponent {
  isMobileMenuOpen = false;
  
  // This state controls everything!
  currentRole: 'management' | 'admin' | 'student' | 'teacher' = 'admin';

  setRole(role: 'management' | 'admin' | 'student' | 'teacher') {
    this.currentRole = role;
  }

  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu() { this.isMobileMenuOpen = false; }
}