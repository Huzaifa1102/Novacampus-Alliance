import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-file',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      
      <button class="text-sm font-semibold text-text-muted hover:text-brand-primary flex items-center transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        Back to Student Directory
      </button>

      <div class="bg-white rounded-xl border border-border-light shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div class="flex items-center gap-6">
          <div class="h-20 w-20 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-2xl font-bold border-2 border-brand-primary/20">
            JD
          </div>
          
          <div>
            <h1 class="text-2xl font-bold text-text-main flex items-center gap-3">
              Jean Dupont
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                Enrolled
              </span>
            </h1>
            <p class="text-text-muted font-medium mt-1">ID: NOV-2026-8492 • Advanced Web Development</p>
            <p class="text-sm text-text-muted mt-1">Paris Campus • jean.dupont@novacampus.fr</p>
          </div>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <button class="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 text-text-main hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            Edit Profile
          </button>
          <button class="flex-1 md:flex-none px-4 py-2 bg-brand-primary text-white hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            Contact
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden mt-6">
        
        <div class="border-b border-border-light px-6">
          <nav class="-mb-px flex space-x-8 overflow-x-auto">
            
            <button (click)="activeTab = 'overview'" 
              [ngClass]="activeTab === 'overview' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors">
              Overview
            </button>
            
            <button (click)="activeTab = 'grades'" 
              [ngClass]="activeTab === 'grades' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors">
              Academic & Grades
            </button>
            
            <button (click)="activeTab = 'attendance'" 
              [ngClass]="activeTab === 'attendance' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors">
              Attendance
            </button>

            <button (click)="activeTab = 'payments'" 
              [ngClass]="activeTab === 'payments' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors">
              Financial & Payments
            </button>

          </nav>
        </div>

        <div class="p-6 md:p-8 bg-surface/30 min-h-[400px]">
          
          <div *ngIf="activeTab === 'overview'" class="animate-fade-in space-y-6">
            <h2 class="text-lg font-bold text-text-main">Student Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-5 rounded-lg border border-border-light shadow-sm">
                <div class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Current GPA</div>
                <div class="text-3xl font-bold text-brand-primary">3.8<span class="text-lg text-text-muted">/4.0</span></div>
              </div>
              <div class="bg-white p-5 rounded-lg border border-border-light shadow-sm">
                <div class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Absences</div>
                <div class="text-3xl font-bold text-text-main">2 <span class="text-sm font-normal text-green-600 ml-2">Good standing</span></div>
              </div>
              <div class="bg-white p-5 rounded-lg border border-border-light shadow-sm">
                <div class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Next Payment Due</div>
                <div class="text-xl font-bold text-text-main mt-1">Oct 15, 2026</div>
                <div class="text-sm text-brand-accent font-semibold mt-1">€2,500.00</div>
              </div>
            </div>
          </div>

          <div *ngIf="activeTab === 'grades'" class="animate-fade-in">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-text-main">Recent Grades</h2>
              <button class="text-sm text-brand-primary font-semibold hover:underline">Download Transcript</button>
            </div>
            <div class="bg-white border border-border-light rounded-lg p-8 text-center text-text-muted italic">
              Grade data table will be inserted here.
            </div>
          </div>

          <div *ngIf="activeTab === 'attendance'" class="animate-fade-in">
            <h2 class="text-lg font-bold text-text-main mb-4">Attendance Record</h2>
            <div class="bg-white border border-border-light rounded-lg p-8 text-center text-text-muted italic">
              Attendance calendar will be inserted here.
            </div>
          </div>

          <div *ngIf="activeTab === 'payments'" class="animate-fade-in">
            <h2 class="text-lg font-bold text-text-main mb-4">Payment History</h2>
            <div class="bg-white border border-border-light rounded-lg p-8 text-center text-text-muted italic">
              Financial ledger will be inserted here.
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class StudentFileComponent {
  // This state controls the tabs!
  activeTab = 'overview';
}