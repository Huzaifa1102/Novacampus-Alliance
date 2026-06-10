import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto animate-fade-in font-sans">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Grades & Absences</h1>
          <p class="text-sm text-slate-500 mt-1">View your academic performance and attendance record.</p>
        </div>
        <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download PDF
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Current Average</p>
            <p class="text-2xl font-bold text-slate-800">{{ currentAverage }} <span class="text-sm text-slate-400 font-normal">/ 20</span></p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Credits Earned</p>
            <p class="text-2xl font-bold text-slate-800">{{ creditsEarned }} <span class="text-sm text-slate-400 font-normal">/ {{ totalCredits }}</span></p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Absences</p>
            <p class="text-2xl font-bold text-slate-800">{{ totalAbsences }} <span class="text-sm text-slate-400 font-normal">hours</span></p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">Semester 1 Transcript</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-bold">
                <th class="px-6 py-4">Code</th>
                <th class="px-6 py-4">Course Name</th>
                <th class="px-6 py-4 text-center">Credits</th>
                <th class="px-6 py-4 text-center">Final Grade</th>
                <th class="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              
              <tr *ngFor="let row of studentGrades" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-semibold text-slate-500">{{row.courseCode}}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-800">{{row.courseName}}</td>
                <td class="px-6 py-4 text-sm text-slate-600 text-center font-medium">{{row.credits}}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-800 text-center">{{row.grade}}</td>
                <td class="px-6 py-4">
                  <span *ngFor="let s of row.status" 
                        class="inline-block px-2 py-1 mr-1 text-[10px] font-bold uppercase tracking-wider rounded-md"
                        [ngClass]="{
                          'bg-emerald-100 text-emerald-700': s === 'Passed' || s === 'Honors',
                          'bg-red-100 text-red-700': s === 'Failed',
                          'bg-amber-100 text-amber-700': s === 'In Progress'
                        }">
                    {{s}}
                  </span>
                </td>
              </tr>
              
              <tr *ngIf="studentGrades.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <p class="text-slate-500 text-sm">No grades found for this semester.</p>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class GradesComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
  // Dynamic Data
  studentGrades: any[] = [];
  currentAverage: string = '0.0';
  creditsEarned: number = 0;
  totalCredits: number = 0;
  totalAbsences: number = 0;

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/academic/history/STU001')
      .subscribe({
        next: (res) => this.processAcademicData(res.data || []),
        error: (err) => console.error('Failed to load academic history', err)
      });
  }

  processAcademicData(historyData: any[]) {
    const formattedGrades = [];
    let gradeSum = 0;
    let gradeCount = 0;
    let earned = 0;
    let total = 0;
    let absences = 0;

    for (const record of historyData) {
      const code = record.course_id || record.course_code || 'N/A';
      const name = record.course_name || 'Unknown Course';
      const credits = Number(record.credits) || 0;
      const finalGrade = record.final_grade ?? record.grade ?? null;
      
      absences += Number(record.absences) || 0;
      total += credits;

      let statusArray = [];
      let gradeDisplay = 'N/A';

      // Evaluate null vs populated grades
      if (finalGrade !== null && finalGrade !== undefined) {
        gradeDisplay = `${Number(finalGrade).toFixed(1)}/20`;
        gradeSum += Number(finalGrade);
        gradeCount++;

        if (finalGrade >= 10) {
          statusArray.push('Passed');
          earned += credits;
          if (finalGrade >= 14) statusArray.push('Honors');
        } else {
          statusArray.push('Failed');
        }
      } else {
        statusArray.push('In Progress');
      }

      formattedGrades.push({
        courseCode: code,
        courseName: name,
        credits: credits,
        grade: gradeDisplay,
        status: statusArray
      });
    }

    this.studentGrades = formattedGrades;
    this.creditsEarned = earned;
    this.totalCredits = total;
    this.totalAbsences = absences;
    
    if (gradeCount > 0) {
      this.currentAverage = (gradeSum / gradeCount).toFixed(1);
    }

    this.cdr.detectChanges(); 
  }
}