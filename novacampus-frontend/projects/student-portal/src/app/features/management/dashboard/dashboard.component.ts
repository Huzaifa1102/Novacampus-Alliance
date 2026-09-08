import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in font-sans">
      
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Operational Overview</h2>
        <p class="text-sm text-slate-500">Real-time institutional metrics and performance indicators.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div class="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrollment</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ kpis.total_enrollments | number }}</h3>
            <span class="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7"></path></svg>
              +4.2% vs last year
            </span>
          </div>
          <div class="p-3 rounded-lg bg-blue-50 text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>

        <div class="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Room Utilization</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">84.6%</h3>
            <span class="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7"></path></svg>
              Optimized (+2.1%)
            </span>
          </div>
          <div class="p-3 rounded-lg bg-purple-50 text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h6"></path></svg>
          </div>
        </div>

        <div class="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collected Revenue</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">€{{ (kpis.collected_amount / 1000000) | number:'1.1-2' }}M</h3>
            <span class="text-xs text-amber-600 font-medium flex items-center gap-1 mt-2">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3"></path></svg>
              91% of target met
            </span>
          </div>
          <div class="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div class="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active System Alerts</p>
            <h3 class="text-2xl font-bold text-red-600 mt-1">2</h3>
            <span class="text-xs text-red-500 font-medium flex items-center gap-1 mt-2">
              Requires immediate action
            </span>
          </div>
          <div class="p-3 rounded-lg bg-red-50 text-red-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h4 class="font-bold text-slate-800">Faculty Distribution Metrics</h4>
            <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">By Department</span>
          </div>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-slate-700">Computer Science & AI</span>
                <span class="text-slate-500 font-semibold">45% capacity</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-brand-dark h-full rounded-full" style="width: 45%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-slate-700">Mechanical Engineering</span>
                <span class="text-slate-500 font-semibold">32% capacity</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-purple-600 h-full rounded-full" style="width: 32%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-slate-700">Business Management</span>
                <span class="text-slate-500 font-semibold">18% capacity</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 18%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div class="pb-4 border-b border-slate-100">
            <h4 class="font-bold text-slate-800">Strategic Feed</h4>
          </div>

          <div class="flex-1 py-4 space-y-4">
            <div class="flex gap-3 items-start p-3 rounded-lg bg-red-50/50 border border-red-100">
              <span class="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
              <div>
                <p class="text-xs font-bold text-red-900">Room Scheduling Conflict</p>
                <p class="text-[11px] text-red-700 mt-0.5">Amphitheater C overlaps at 14:00 tomorrow.</p>
              </div>
            </div>

            <div class="flex gap-3 items-start p-3 rounded-lg bg-amber-50/50 border border-amber-100">
              <span class="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <div>
                <p class="text-xs font-bold text-amber-900">Financial Clearance Pending</p>
                <p class="text-[11px] text-amber-700 mt-0.5">24 student profile logs awaiting ledger sync.</p>
              </div>
            </div>
          </div>

          <button class="w-full text-center text-xs font-bold text-brand-dark hover:underline pt-2 border-t border-slate-100">
            View All Strategic Notifications &rarr;
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  kpis: any = {
    total_enrollments: 12480,
    collected_amount: 4800000
  };

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/reports/kpis')
      .subscribe({
        next: (res) => {
          if (res.data && res.data.length > 0) {
             let total_enr = 0;
             let total_col = 0;
             for (let row of res.data) {
                total_enr += parseInt(row.total_enrollments || 0);
                total_col += parseFloat(row.collected_amount || 0);
             }
             this.kpis.total_enrollments = total_enr;
             this.kpis.collected_amount = total_col;
          }
        },
        error: (err) => console.error('Failed to load KPIs', err)
      });
  }
}