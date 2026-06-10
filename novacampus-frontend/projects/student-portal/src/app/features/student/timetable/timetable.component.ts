import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
              <div class="text-center font-bold text-slate-700 pb-2 border-b-2 border-brand-dark">Monday</div>
              <div class="text-center font-bold text-slate-700 pb-2 border-b-2 border-slate-100">Tuesday</div>
              <div class="text-center font-bold text-slate-700 pb-2 border-b-2 border-brand-dark">Wednesday</div>
              <div class="text-center font-bold text-slate-700 pb-2 border-b-2 border-slate-100">Thursday</div>
              <div class="text-center font-bold text-slate-700 pb-2 border-b-2 border-slate-100">Friday</div>

              <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-3">08:00</div>
              <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-blue-900">Advanced Algorithms</p>
                <p class="text-[10px] text-blue-700 mt-1">Room A-102 • Dr. Smith</p>
              </div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
              <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-emerald-900">Database Systems</p>
                <p class="text-[10px] text-emerald-700 mt-1">Room B-404 • Prof. Davis</p>
              </div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
              <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-blue-900">Advanced Algorithms</p>
                <p class="text-[10px] text-blue-700 mt-1">Room A-102 • Dr. Smith</p>
              </div>

              <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-3">10:00</div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
              <div class="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-purple-900">Web Engineering</p>
                <p class="text-[10px] text-purple-700 mt-1">Lab 3 • Ms. Taylor</p>
              </div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
              <div class="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-purple-900">Web Engineering</p>
                <p class="text-[10px] text-purple-700 mt-1">Lab 3 • Ms. Taylor</p>
              </div>
              <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-amber-900">Cybersecurity</p>
                <p class="text-[10px] text-amber-700 mt-1">Room C-201 • Dr. Lee</p>
              </div>

              <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-2">12:00</div>
              <div class="col-span-5 bg-slate-100 rounded-md flex items-center justify-center py-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Lunch Break</span>
              </div>

              <div class="text-xs font-semibold text-slate-400 text-right pr-4 py-3">14:00</div>
              <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-amber-900">Cybersecurity</p>
                <p class="text-[10px] text-amber-700 mt-1">Room C-201 • Dr. Lee</p>
              </div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>
              <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-md">
                <p class="text-xs font-bold text-emerald-900">Database Systems</p>
                <p class="text-[10px] text-emerald-700 mt-1">Room B-404 • Prof. Davis</p>
              </div>
              <div class="bg-slate-50 border border-slate-100 p-3 rounded-md"></div>

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
export class TimetableComponent {}