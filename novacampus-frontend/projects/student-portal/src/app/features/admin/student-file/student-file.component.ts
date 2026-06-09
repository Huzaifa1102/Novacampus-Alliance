import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-student-file',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
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
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                Enrolled
              </span>
            </h1>
            <p class="text-text-muted font-medium mt-1">ID: NOV-2026-8492 • Advanced Web Development</p>
            <p class="text-sm text-text-muted mt-1">Paris Campus • jean.dupont@novacampus.fr</p>
          </div>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <button class="flex-1 md:flex-none px-4 py-2 bg-white border border-border-light text-text-main hover:bg-surface rounded-lg text-sm font-semibold transition-colors shadow-sm">
            Edit Profile
          </button>
          <button class="flex-1 md:flex-none px-4 py-2 bg-brand-primary text-white hover:bg-brand-dark rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Contact
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden mt-6">
        
        <div class="border-b border-border-light px-6">
          <nav class="-mb-px flex space-x-8 overflow-x-auto">
            
            <button (click)="activeTab = 'overview'" 
              [ngClass]="activeTab === 'overview' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-border-light'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors outline-none">
              Overview
            </button>
            
            <button (click)="activeTab = 'grades'" 
              [ngClass]="activeTab === 'grades' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-border-light'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors outline-none">
              Academic & Grades
            </button>

            <button (click)="activeTab = 'payments'" 
              [ngClass]="activeTab === 'payments' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-main hover:border-border-light'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors outline-none">
              Financial History
            </button>

          </nav>
        </div>

        <div class="p-6 md:p-8 bg-surface/30 min-h-[400px]">
          
          <div *ngIf="activeTab === 'overview'" class="animate-fade-in space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-5 rounded-lg border border-border-light shadow-sm">
                <div class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Current Average</div>
                <div class="text-3xl font-bold text-brand-primary">15.2<span class="text-lg text-text-muted">/20</span></div>
              </div>
              <div class="bg-white p-5 rounded-lg border border-border-light shadow-sm">
                <div class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Absences</div>
                <div class="text-3xl font-bold text-text-main">2 <span class="text-sm font-normal text-green-600 ml-2">Good standing</span></div>
              </div>
              <div class="bg-white p-5 rounded-lg border border-border-light shadow-sm border-l-4 border-l-brand-accent">
                <div class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Next Payment Due</div>
                <div class="text-xl font-bold text-text-main mt-1">Oct 15, 2026</div>
                <div class="text-sm text-brand-accent font-semibold mt-1">€2,500.00</div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg border border-border-light shadow-sm mt-6">
               <h3 class="font-bold text-text-main mb-2">Administrator Notes</h3>
               <p class="text-sm text-text-muted">Student transferred from Lyon campus in early 2025. Ensure all core credits from year 1 are properly mapped to the Paris curriculum before graduation audit.</p>
            </div>
          </div>

          <div *ngIf="activeTab === 'grades'" class="animate-fade-in">
             <app-data-table 
               title="Official Transcript: Fall 2026"
               [columns]="gradeColumns" 
               [data]="gradeData">
             </app-data-table>
          </div>

          <div *ngIf="activeTab === 'payments'" class="animate-fade-in">
             <app-data-table 
               title="Ledger & Invoices"
               [columns]="paymentColumns" 
               [data]="paymentData"
               [showActions]="true">
             </app-data-table>
          </div>

        </div>
      </div>

    </div>
  `
})
export class StudentFileComponent {
  activeTab = 'overview';

  // Data for the Grades Tab
  gradeColumns = [
    { key: 'course', label: 'Course', isPrimary: true },
    { key: 'credits', label: 'Credits' },
    { key: 'score', label: 'Score' },
    { key: 'status', label: 'Status' }
  ];
  gradeData = [
    { course: 'DEV101 - Advanced Web Dev', credits: 4, score: '18/20', status: ['Passed'] },
    { course: 'ARC204 - Software Architecture', credits: 4, score: '15/20', status: ['Passed'] },
    { course: 'DAT400 - Database Management', credits: 3, score: '12/20', status: ['Passed'] }
  ];

  // Data for the Payments Tab
  paymentColumns = [
    { key: 'invoiceId', label: 'Invoice ID' },
    { key: 'description', label: 'Description', isPrimary: true },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date Issued' },
    { key: 'status', label: 'Status' }
  ];
  paymentData = [
    { invoiceId: 'INV-2026-001', description: 'Fall Semester Tuition (Installment 1)', amount: '€2,500.00', date: 'Sep 01, 2026', status: ['Paid'] },
    { invoiceId: 'INV-2026-002', description: 'Fall Semester Tuition (Installment 2)', amount: '€2,500.00', date: 'Oct 01, 2026', status: ['Pending'] },
    { invoiceId: 'FEE-2026-044', description: 'Lab Equipment Fee', amount: '€150.00', date: 'Sep 15, 2026', status: ['Paid'] }
  ];
}