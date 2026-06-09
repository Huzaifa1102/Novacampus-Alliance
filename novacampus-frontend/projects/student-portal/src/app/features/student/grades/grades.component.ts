import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Grades & Absences</h1>
          <p class="text-sm text-text-muted mt-1">View your academic performance and attendance record.</p>
        </div>
        <button class="px-4 py-2 bg-white border border-border-light rounded-lg hover:bg-surface text-text-main text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download PDF
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-text-muted">Current Average</p>
            <p class="text-2xl font-bold text-text-main">15.2 <span class="text-sm text-text-muted font-normal">/ 20</span></p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-text-muted">Credits Earned</p>
            <p class="text-2xl font-bold text-text-main">14 <span class="text-sm text-text-muted font-normal">/ 16</span></p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-text-muted">Total Absences</p>
            <p class="text-2xl font-bold text-text-main">2 <span class="text-sm text-text-muted font-normal">hours</span></p>
          </div>
        </div>

      </div>

      <app-data-table 
        title="Semester 1 Transcript"
        [columns]="tableColumns" 
        [data]="studentGrades"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class GradesComponent {
  
  tableColumns = [
    { key: 'courseCode', label: 'Code' },
    { key: 'courseName', label: 'Course Name', isPrimary: true },
    { key: 'credits', label: 'Credits' },
    { key: 'grade', label: 'Final Grade' },
    { key: 'status', label: 'Status' }
  ];

  studentGrades = [
    { courseCode: 'DEV101', courseName: 'Advanced Web Development', credits: 4, grade: '18/20', status: ['Passed', 'Honors'] },
    { courseCode: 'ARC204', courseName: 'Software Architecture', credits: 4, grade: '15/20', status: ['Passed'] },
    { courseCode: 'OPS301', courseName: 'DevOps & CI/CD', credits: 3, grade: '16/20', status: ['Passed'] },
    { courseCode: 'DAT400', courseName: 'Database Management', credits: 3, grade: '12/20', status: ['Passed'] },
    { courseCode: 'SEC505', courseName: 'Cybersecurity Fundamentals', credits: 2, grade: 'N/A', status: ['In Progress'] }
  ];
}