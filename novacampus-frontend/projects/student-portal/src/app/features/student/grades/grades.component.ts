import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      
      <div>
        <h1 class="text-2xl font-bold text-text-main">Grades & Absences</h1>
        <p class="text-sm text-text-muted mt-1">View your academic performance and attendance record.</p>
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
  
  // 1. Tell the table what the columns should be
  tableColumns = [
    { key: 'courseCode', label: 'Code' },
    { key: 'courseName', label: 'Course Name', isPrimary: true },
    { key: 'credits', label: 'Credits' },
    { key: 'grade', label: 'Final Grade' },
    { key: 'status', label: 'Status' }
  ];

  // 2. Pass in the actual data
  studentGrades = [
    { courseCode: 'DEV101', courseName: 'Advanced Web Development', credits: 4, grade: '18/20', status: ['Passed', 'Honors'] },
    { courseCode: 'ARC204', courseName: 'Software Architecture', credits: 4, grade: '15/20', status: ['Passed'] },
    { courseCode: 'OPS301', courseName: 'DevOps & CI/CD', credits: 3, grade: '16/20', status: ['Passed'] },
    { courseCode: 'DAT400', courseName: 'Database Management', credits: 3, grade: '12/20', status: ['Passed'] },
    { courseCode: 'SEC505', courseName: 'Cybersecurity Fundamentals', credits: 2, grade: 'N/A', status: ['In Progress'] }
  ];
}