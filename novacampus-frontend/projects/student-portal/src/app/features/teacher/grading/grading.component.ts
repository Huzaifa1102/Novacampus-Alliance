import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Grade Entry Portal</h2>
          <p class="text-sm text-slate-500">Manage assessments and publish final marks.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-slate-700">Active Course:</label>
          <select class="rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:text-sm bg-white">
            <option>CS-401: Advanced Algorithms</option>
            <option>CS-402: Database Systems</option>
          </select>
        </div>
      </div>

      <div *ngIf="isSaved" class="p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <p class="text-sm font-medium text-emerald-800">Grades successfully synchronized with the campus database.</p>
        </div>
        <button (click)="isSaved = false" class="text-emerald-600 hover:text-emerald-800">✕</button>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Midterm (30%)</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Project (30%)</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Final (40%)</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Grade</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              
              <tr *ngFor="let student of roster" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-brand-dark/10 text-brand-dark flex items-center justify-center font-bold text-xs">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-slate-900">{{ student.name }}</div>
                      <div class="text-xs text-slate-500">{{ student.id }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <input type="number" [(ngModel)]="student.midterm" min="0" max="100" class="w-20 text-center rounded-md border border-slate-300 py-1.5 text-sm focus:border-brand-dark focus:ring-1 focus:ring-brand-dark">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <input type="number" [(ngModel)]="student.project" min="0" max="100" class="w-20 text-center rounded-md border border-slate-300 py-1.5 text-sm focus:border-brand-dark focus:ring-1 focus:ring-brand-dark">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <input type="number" [(ngModel)]="student.final" min="0" max="100" class="w-20 text-center rounded-md border border-slate-300 py-1.5 text-sm focus:border-brand-dark focus:ring-1 focus:ring-brand-dark">
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="text-sm font-bold" [ngClass]="{'text-emerald-600': calculateTotal(student) >= 60, 'text-red-600': calculateTotal(student) < 60 && calculateTotal(student) > 0, 'text-slate-400': calculateTotal(student) === 0}">
                    {{ calculateTotal(student) || '--' }}%
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span *ngIf="isComplete(student)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Complete
                  </span>
                  <span *ngIf="!isComplete(student)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        
        <div class="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <p class="text-sm text-slate-500">Showing <span class="font-medium">{{ roster.length }}</span> enrolled students</p>
          <button (click)="saveGrades()" class="px-4 py-2 text-sm font-medium text-white bg-brand-dark rounded-md shadow-sm hover:bg-opacity-90 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            Save & Publish
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    /* Hide number input arrows for a cleaner look */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  `]
})
export class GradingComponent {
  isSaved = false;

  // Mock initial data state
  roster = [
    { id: 'STU-1042', name: 'Alice Johnson', midterm: 85, project: 92, final: 88 },
    { id: 'STU-1043', name: 'Bob Smith', midterm: 78, project: 85, final: null },
    { id: 'STU-1044', name: 'Charlie Davis', midterm: null, project: null, final: null },
    { id: 'STU-1045', name: 'Diana Evans', midterm: 95, project: 90, final: 96 }
  ];

  // Dynamically calculate the weighted total
  calculateTotal(student: any): number {
    const mid = (student.midterm || 0) * 0.30;
    const proj = (student.project || 0) * 0.30;
    const fin = (student.final || 0) * 0.40;
    
    // Only return a total if at least one grade is entered
    if (!student.midterm && !student.project && !student.final) return 0;
    return Math.round(mid + proj + fin);
  }

  // Check if all three grades are entered
  isComplete(student: any): boolean {
    return student.midterm != null && student.project != null && student.final != null;
  }

  saveGrades() {
    console.log('Publishing Grades Payload:', this.roster);
    this.isSaved = true;
    setTimeout(() => this.isSaved = false, 5000); // Hide alert after 5 seconds
  }
}