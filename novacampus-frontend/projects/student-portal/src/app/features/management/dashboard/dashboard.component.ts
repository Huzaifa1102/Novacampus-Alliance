import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Multi-Campus KPI Dashboard</h1>
          <p class="text-sm text-text-muted mt-1">Overview of all active campuses and key metrics.</p>
        </div>
        <button class="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download Report
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-start gap-4">
          <div class="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Students</div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-2xl font-bold text-text-main">12,450</span>
              <span class="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+4.2%</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-start gap-4">
          <div class="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-text-muted uppercase tracking-wider">Active Campuses</div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-2xl font-bold text-text-main">8</span>
              <span class="text-xs font-medium text-text-muted">Across France</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-start gap-4">
          <div class="p-3 bg-brand-accent/10 text-brand-accent rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-text-muted uppercase tracking-wider">Room Utilization</div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-2xl font-bold text-text-main">78%</span>
              <span class="text-xs font-medium text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded">Optimal</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-start gap-4 border-r-4 border-r-red-500">
          <div class="p-3 bg-red-100 text-red-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-text-muted uppercase tracking-wider">Pending Alerts</div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-2xl font-bold text-red-600">14</span>
              <span class="text-xs font-medium text-red-600">Requires Action</span>
            </div>
          </div>
        </div>

      </div>

      <div class="bg-white p-6 rounded-xl border border-border-light shadow-sm min-h-[300px] flex flex-col justify-center items-center bg-surface/30 border-dashed">
        <svg class="w-12 h-12 text-border-light mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
        <p class="text-text-main font-semibold">Student Enrollment Trends</p>
        <p class="text-sm text-text-muted mt-1">(Chart library integration goes here)</p>
      </div>

      <app-data-table 
        title="Campus Performance Overview"
        [columns]="campusColumns" 
        [data]="campusData"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class DashboardComponent {
  
  campusColumns = [
    { key: 'city', label: 'Location', isPrimary: true },
    { key: 'director', label: 'Campus Director' },
    { key: 'enrollment', label: 'Current Enrollment' },
    { key: 'utilization', label: 'Room Utilization' },
    { key: 'status', label: 'Status' }
  ];

  campusData = [
    { city: 'Paris (Headquarters)', director: 'Jean-Luc Picard', enrollment: '4,250', utilization: '82%', status: ['Operational'] },
    { city: 'Lyon', director: 'Marie Curie', enrollment: '2,800', utilization: '75%', status: ['Operational'] },
    { city: 'Bordeaux', director: 'Louis Pasteur', enrollment: '1,950', utilization: '88%', status: ['High Traffic'] },
    { city: 'Strasbourg', director: 'Johannes Gutenberg', enrollment: '1,450', utilization: '60%', status: ['Operational'] },
    { city: 'Lille', director: 'Charles de Gaulle', enrollment: '2,000', utilization: '92%', status: ['Capacity Warning'] }
  ];
}