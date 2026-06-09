import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="space-y-6">
      
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Multi-Campus KPI Dashboard</h1>
          <p class="text-sm text-text-muted mt-1">Overview of all active campuses and key metrics.</p>
        </div>
        <button class="bg-brand-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm">
          <div class="text-sm font-semibold text-text-muted uppercase tracking-wider">Total Students</div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-text-main">12,450</span>
            <span class="text-sm font-medium text-green-500">+4.2%</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm">
          <div class="text-sm font-semibold text-text-muted uppercase tracking-wider">Active Campuses</div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-text-main">8</span>
            <span class="text-sm font-medium text-text-muted">Across France</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm">
          <div class="text-sm font-semibold text-text-muted uppercase tracking-wider">Room Utilization</div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-text-main">78%</span>
            <span class="text-sm font-medium text-brand-accent">Optimal</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm">
          <div class="text-sm font-semibold text-text-muted uppercase tracking-wider">Pending Alerts</div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-red-600">14</span>
            <span class="text-sm font-medium text-text-muted">Requires action</span>
          </div>
        </div>

      </div>

      <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm min-h-[400px] flex items-center justify-center">
        <div class="text-center">
          <div class="text-text-muted mb-2">Student Enrollment Trends Chart</div>
          <div class="text-sm text-border-light italic">(Chart component will be inserted here)</div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {}