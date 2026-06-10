import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Student {
  id: string;
  name: string;
  status: 'Present' | 'Late' | 'Absent' | 'Unmarked';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Log Attendance</h1>
          <p class="text-sm text-text-muted mt-1">{{ currentDate }} | DEV101 - Advanced Web Dev</p>
        </div>
        
        <div class="flex gap-3 w-full md:w-auto">
          <button class="px-4 py-2 bg-white border border-border-light rounded-lg hover:bg-surface text-text-main text-sm font-semibold transition-colors flex-1 md:flex-none">
            Switch Class
          </button>
          <button (click)="markAllPresent()" class="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark text-sm font-semibold transition-colors flex-1 md:flex-none shadow-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Mark All Present
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm text-center">
          <p class="text-2xl font-bold text-text-main">{{ students.length }}</p>
          <p class="text-xs font-medium text-text-muted uppercase tracking-wider mt-1">Total</p>
        </div>
        <div class="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm text-center">
          <p class="text-2xl font-bold text-green-700">{{ stats.present }}</p>
          <p class="text-xs font-medium text-green-600 uppercase tracking-wider mt-1">Present</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm text-center">
          <p class="text-2xl font-bold text-yellow-700">{{ stats.late }}</p>
          <p class="text-xs font-medium text-yellow-600 uppercase tracking-wider mt-1">Late</p>
        </div>
        <div class="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm text-center">
          <p class="text-2xl font-bold text-red-700">{{ stats.absent }}</p>
          <p class="text-xs font-medium text-red-600 uppercase tracking-wider mt-1">Absent</p>
        </div>
      </div>

      <div class="bg-white border border-border-light rounded-xl shadow-sm overflow-hidden">
        
        <div class="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border-light bg-surface/80 text-xs font-semibold text-text-muted uppercase tracking-wider">
           <div class="col-span-5">Student</div>
           <div class="col-span-7">Attendance Status</div>
        </div>

        <div *ngFor="let student of students" class="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border-b border-border-light last:border-0 items-center hover:bg-surface/30 transition-colors">
          
          <div class="col-span-5 w-full flex items-center gap-3">
             <div class="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">
               {{ student.name.charAt(0) }}
             </div>
             <div>
               <p class="font-bold text-text-main leading-tight">{{ student.name }}</p>
               <p class="text-xs text-text-muted mt-0.5">{{ student.id }}</p>
             </div>
          </div>

          <div class="col-span-7 w-full flex justify-start md:justify-end gap-2 mt-3 md:mt-0">
             <button (click)="setStatus(student, 'Present')"
               [ngClass]="student.status === 'Present' ? 'bg-green-100 text-green-800 border-green-300 shadow-inner' : 'bg-white text-text-muted border-border-light hover:bg-surface'"
               class="flex-1 md:flex-none px-5 py-2 text-sm font-semibold border rounded-lg transition-all">
               Present
             </button>
             
             <button (click)="setStatus(student, 'Late')"
               [ngClass]="student.status === 'Late' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-inner' : 'bg-white text-text-muted border-border-light hover:bg-surface'"
               class="flex-1 md:flex-none px-5 py-2 text-sm font-semibold border rounded-lg transition-all">
               Late
             </button>
             
             <button (click)="setStatus(student, 'Absent')"
               [ngClass]="student.status === 'Absent' ? 'bg-red-100 text-red-800 border-red-300 shadow-inner' : 'bg-white text-text-muted border-border-light hover:bg-surface'"
               class="flex-1 md:flex-none px-5 py-2 text-sm font-semibold border rounded-lg transition-all">
               Absent
             </button>
          </div>

        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button class="px-6 py-2.5 bg-brand-dark text-white rounded-lg hover:bg-brand-primary font-bold shadow-md transition-colors">
          Submit Attendance
        </button>
      </div>

    </div>
  `
})
export class AttendanceComponent {
  
  currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Initial State: Everyone is Unmarked
  students: Student[] = [
    { id: 'STU-9021', name: 'Alice Dubois', status: 'Unmarked' },
    { id: 'STU-9022', name: 'Lucas Martin', status: 'Unmarked' },
    { id: 'STU-9023', name: 'Emma Bernard', status: 'Unmarked' },
    { id: 'STU-9024', name: 'Hugo Petit', status: 'Unmarked' },
    { id: 'STU-9025', name: 'Chloe Richard', status: 'Unmarked' }
  ];

  // Dynamic getters for the UI cards
  get stats() {
    return {
      present: this.students.filter(s => s.status === 'Present').length,
      late: this.students.filter(s => s.status === 'Late').length,
      absent: this.students.filter(s => s.status === 'Absent').length
    };
  }

  // Action methods
  markAllPresent() {
    this.students.forEach(s => s.status = 'Present');
  }

  setStatus(student: Student, status: 'Present' | 'Late' | 'Absent') {
    student.status = status;
  }
}