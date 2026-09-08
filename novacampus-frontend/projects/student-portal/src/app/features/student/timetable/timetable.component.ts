import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">My Timetable</h2>
          <p class="text-sm text-slate-500">Fall Semester 2026 • Computer Science Engineering</p>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2 text-sm font-medium text-brand-dark bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            Previous Week
          </button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-brand-dark rounded-md hover:bg-opacity-90 transition-colors shadow-sm">
            Current Week
          </button>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto custom-scrollbar">
          <div class="min-w-[800px] p-4">
            <div class="grid grid-cols-[80px_repeat(5,_1fr)] gap-3">
              
              <div class="text-xs font-semibold text-slate-400 uppercase text-right pr-4 pt-2">Time</div>
              <div *ngFor="let day of days" class="text-center font-bold text-slate-700 pb-2 border-b-2 border-slate-100">
                {{day}}
              </div>

              <ng-container *ngFor="let time of morningTimes">
                <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-3">{{time}}</div>
                <ng-container *ngFor="let day of days">
                  <div *ngIf="gridMap[day + '-' + time]" class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md shadow-sm">
                    <p class="text-xs font-bold text-blue-900">{{gridMap[day + '-' + time].course_name}}</p>
                    <p class="text-[10px] text-blue-700 mt-1">Room {{gridMap[day + '-' + time].room_id || 'TBA'}} • Prof {{gridMap[day + '-' + time].instructor_id || 'TBA'}}</p>
                  </div>
                  <div *ngIf="!gridMap[day + '-' + time]" class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
                </ng-container>
              </ng-container>

              <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-2">12:00</div>
              <div class="col-span-5 bg-slate-100 rounded-md flex items-center justify-center py-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Lunch Break</span>
              </div>

              <ng-container *ngFor="let time of afternoonTimes">
                <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-3">{{time}}</div>
                <ng-container *ngFor="let day of days">
                  <div *ngIf="gridMap[day + '-' + time]" class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-md shadow-sm">
                    <p class="text-xs font-bold text-emerald-900">{{gridMap[day + '-' + time].course_name}}</p>
                    <p class="text-[10px] text-emerald-700 mt-1">Room {{gridMap[day + '-' + time].room_id || 'TBA'}} • Prof {{gridMap[day + '-' + time].instructor_id || 'TBA'}}</p>
                  </div>
                  <div *ngIf="!gridMap[day + '-' + time]" class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
                </ng-container>
              </ng-container>

            </div>
          </div>
        </div>
      </div>
      
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class TimetableComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  morningTimes = ['08:00', '09:00', '10:00', '11:00'];
  afternoonTimes = ['13:00', '14:00', '15:00', '16:00', '17:00'];
  
  gridMap: Record<string, any> = {};

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/schedules/my')
      .subscribe({
        next: (res) => this.buildGridMap(res.data || []),
        error: (err) => console.error('Failed to load timetable', err)
      });
  }

  buildGridMap(scheduleData: any[]) {
    const newMap: Record<string, any> = {};
    
    for (const lesson of scheduleData) {
      if (!lesson.day_of_week || !lesson.start_time) continue;
      
      const day = lesson.day_of_week.trim(); 
      const time = lesson.start_time.trim().substring(0, 5); 
      
      const key = `${day}-${time}`; 
      newMap[key] = lesson;
    }
    
    this.gridMap = newMap;
    this.cdr.detectChanges(); // Forces Angular to redraw the screen immediately
  }
}