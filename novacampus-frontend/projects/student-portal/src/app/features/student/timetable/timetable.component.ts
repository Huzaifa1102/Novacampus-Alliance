import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClassSession {
  id: string;
  subject: string;
  professor: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  type: 'Lecture' | 'Lab' | 'Seminar';
}

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">My Timetable</h1>
          <p class="text-sm text-text-muted mt-1">Current Week: Oct 12 - Oct 16, 2026</p>
        </div>
        <div class="flex gap-2">
           <button class="px-4 py-2 bg-white border border-border-light rounded-lg hover:bg-surface text-text-main text-sm font-semibold transition-colors">
             Previous
           </button>
           <button class="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark text-sm font-semibold transition-colors">
             Next Week
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div *ngFor="let day of weekDays" class="space-y-4">
          <h2 class="font-semibold text-text-main border-b border-border-light pb-2 flex justify-between items-center">
            {{ day }}
            <span class="text-xs font-normal text-text-muted bg-white border border-border-light px-2 py-0.5 rounded-full">
              {{ getSessions(day).length }} classes
            </span>
          </h2>
          
          <div *ngFor="let session of getSessions(day)"
               class="bg-white border border-border-light rounded-xl p-4 shadow-sm hover:shadow-md transition-all border-l-4 relative group"
               [ngClass]="{
                 'border-l-brand-primary': session.type === 'Lecture', 
                 'border-l-brand-accent': session.type === 'Lab',
                 'border-l-brand-dark': session.type === 'Seminar'
               }">
            
            <div class="text-xs font-bold text-text-muted mb-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ session.startTime }} - {{ session.endTime }}
            </div>
            
            <h3 class="font-bold text-text-main leading-tight">{{ session.subject }}</h3>
            
            <div class="mt-3 space-y-1.5 text-sm text-text-muted">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
                {{ session.room }}
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> 
                {{ session.professor }}
              </div>
            </div>
            
            <div class="mt-3 inline-block px-2 py-1 bg-surface text-xs font-semibold rounded text-text-muted">
              {{ session.type }}
            </div>
          </div>

          <div *ngIf="getSessions(day).length === 0" class="text-sm text-text-muted italic p-4 bg-surface/50 rounded-xl border border-dashed border-border-light text-center">
            No classes scheduled
          </div>

        </div>
      </div>

    </div>
  `
})
export class TimetableComponent {
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // This is the structure your backend should return tomorrow
  mockSchedule: ClassSession[] = [
    { id: '1', subject: 'Advanced Web Dev', professor: 'Dr. Alan Turing', room: 'Building A - Room 101', startTime: '08:30', endTime: '10:00', day: 'Monday', type: 'Lecture' },
    { id: '2', subject: 'Database Systems', professor: 'Dr. Grace Hopper', room: 'Building C - Lab 4', startTime: '10:30', endTime: '12:30', day: 'Monday', type: 'Lab' },
    { id: '3', subject: 'UI/UX Principles', professor: 'Sarah Drasner', room: 'Building B - Room 205', startTime: '14:00', endTime: '15:30', day: 'Tuesday', type: 'Lecture' },
    { id: '4', subject: 'Cloud Architecture', professor: 'Tim Berners-Lee', room: 'Building A - Room 302', startTime: '09:00', endTime: '11:00', day: 'Wednesday', type: 'Seminar' },
    { id: '5', subject: 'Advanced Web Dev', professor: 'Dr. Alan Turing', room: 'Building C - Lab 2', startTime: '13:00', endTime: '15:00', day: 'Thursday', type: 'Lab' },
    { id: '6', subject: 'Database Systems', professor: 'Dr. Grace Hopper', room: 'Building B - Room 105', startTime: '10:00', endTime: '12:00', day: 'Friday', type: 'Lecture' },
  ];

  getSessions(day: string): ClassSession[] {
    // Sort by start time so morning classes appear at the top
    return this.mockSchedule
      .filter(session => session.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
}