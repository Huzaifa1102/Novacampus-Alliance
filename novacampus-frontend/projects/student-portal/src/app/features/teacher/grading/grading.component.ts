import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      
      <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Grade Entry</h1>
          <p class="text-sm text-text-muted mt-1">Manage evaluations and student feedback.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <select class="bg-surface border border-border-light text-text-main text-sm rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary outline-none">
            <option>DEV101 - Advanced Web Dev</option>
            <option>ARC204 - Software Architecture</option>
          </select>
          
          <select class="bg-surface border border-border-light text-text-main text-sm rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary outline-none">
            <option>Midterm Project</option>
            <option>Final Exam</option>
            <option>Weekly Assignment 4</option>
          </select>

          <button class="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark text-sm font-semibold transition-colors shadow-sm">
            Save All
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-brand-primary">
          <div>
            <p class="text-sm font-medium text-text-muted">Class Average</p>
            <p class="text-2xl font-bold text-text-main">14.8 <span class="text-sm text-text-muted font-normal">/ 20</span></p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
          <div>
            <p class="text-sm font-medium text-text-muted">Submitted</p>
            <p class="text-2xl font-bold text-text-main">24 <span class="text-sm text-text-muted font-normal">/ 28 Students</span></p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-brand-accent">
          <div>
            <p class="text-sm font-medium text-text-muted">Pending Review</p>
            <p class="text-2xl font-bold text-text-main">4 <span class="text-sm text-text-muted font-normal">Needs Grading</span></p>
          </div>
        </div>
      </div>

      <app-data-table 
        title="Student Roster: DEV101"
        [columns]="rosterColumns" 
        [data]="studentRoster"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class GradingComponent {
  
  rosterColumns = [
    { key: 'studentId', label: 'ID' },
    { key: 'name', label: 'Student Name', isPrimary: true },
    { key: 'submissionDate', label: 'Submitted On' },
    { key: 'currentGrade', label: 'Current Score' },
    { key: 'status', label: 'Status' }
  ];

  studentRoster = [
    { studentId: 'STU-9021', name: 'Alice Dubois', submissionDate: 'Oct 14, 2026', currentGrade: '18/20', status: ['Graded'] },
    { studentId: 'STU-9022', name: 'Lucas Martin', submissionDate: 'Oct 14, 2026', currentGrade: '15/20', status: ['Graded'] },
    { studentId: 'STU-9023', name: 'Emma Bernard', submissionDate: 'Oct 15, 2026', currentGrade: '-', status: ['Pending Review'] },
    { studentId: 'STU-9024', name: 'Hugo Petit', submissionDate: 'Not Submitted', currentGrade: '0/20', status: ['Missing'] },
    { studentId: 'STU-9025', name: 'Chloe Richard', submissionDate: 'Oct 15, 2026', currentGrade: '-', status: ['Pending Review'] }
  ];
}