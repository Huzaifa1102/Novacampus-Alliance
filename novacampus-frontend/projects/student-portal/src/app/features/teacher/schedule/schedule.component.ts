import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeachingSession {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  type: 'Lecture' | 'Lab' | 'Seminar';
  studentCount: number;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Teaching Schedule</h1>
          <p class="text-sm text-slate-500 mt-1">Current Week: Oct 12 - Oct 16, 2026</p>
        </div>
        <div class="flex gap-2">
           <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-900 text-sm font-semibold transition-colors shadow-sm">
             Previous
           </button>
           <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm">
             Next Week
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div *ngFor="let day of weekDays" class="space-y-4">
          <h2 class="font-semibold text-slate-900 border-b border-slate-200 pb-2 flex justify-between items-center">
            {{ day }}
            <span class="text-xs font-normal text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              {{ getSessions(day).length }} classes
            </span>
          </h2>
          
          <div *ngFor="let session of getSessions(day)"
               class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border-l-4 relative group"
               [ngClass]="{
                 'border-l-blue-500': session.type === 'Lecture', 
                 'border-l-green-500': session.type === 'Lab',
                 'border-l-purple-500': session.type === 'Seminar'
               }">
            
            <div class="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ session.startTime }} - {{ session.endTime }}
            </div>
            
            <h3 class="font-bold text-slate-900 leading-tight">{{ session.courseCode }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ session.courseName }}</p>
            
            <div class="mt-3 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-3">
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
                {{ session.room }}
              </div>
              <div class="flex items-center gap-1.5 font-medium text-slate-900" title="Students Enrolled">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 
                {{ session.studentCount }}
              </div>
            </div>
            
          </div>

          <div *ngIf="getSessions(day).length === 0" class="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
            No classes scheduled
          </div>

        </div>
      </div>

    </div>
  `
})
export class ScheduleComponent {
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  mockSchedule: TeachingSession[] = [
    { id: '1', courseCode: 'DEV101', courseName: 'Advanced Web Development', room: 'Amphitheater A', startTime: '08:30', endTime: '10:00', day: 'Monday', type: 'Lecture', studentCount: 145 },
    { id: '2', courseCode: 'DEV101', courseName: 'Advanced Web Development', room: 'Lab C4', startTime: '10:30', endTime: '12:30', day: 'Monday', type: 'Lab', studentCount: 28 },
    { id: '3', courseCode: 'ARC204', courseName: 'Software Architecture', room: 'Room 205', startTime: '14:00', endTime: '15:30', day: 'Tuesday', type: 'Lecture', studentCount: 65 },
    { id: '4', courseCode: 'DEV101', courseName: 'Advanced Web Development', room: 'Lab C2', startTime: '13:00', endTime: '15:00', day: 'Thursday', type: 'Lab', studentCount: 28 },
    { id: '5', courseCode: 'ARC204', courseName: 'Software Architecture', room: 'Room 105', startTime: '10:00', endTime: '12:00', day: 'Friday', type: 'Lecture', studentCount: 65 },
  ];

  getSessions(day: string): TeachingSession[] {
    return this.mockSchedule
      .filter(session => session.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
}