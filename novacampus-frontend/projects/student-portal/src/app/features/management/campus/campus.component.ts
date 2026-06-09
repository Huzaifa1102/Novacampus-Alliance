import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-campus',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Campus Overview</h1>
          <p class="text-sm text-text-muted mt-1">Manage and monitor all active campus locations.</p>
        </div>
        <button class="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add New Campus
        </button>
      </div>

      <app-data-table 
        title="Campus Directory"
        [columns]="campusColumns" 
        [data]="campusData"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class CampusComponent {
  
  campusColumns = [
    { key: 'location', label: 'Campus Location', isPrimary: true },
    { key: 'director', label: 'Director' },
    { key: 'students', label: 'Total Students' },
    { key: 'status', label: 'Status' }
  ];

  // The status is wrapped in an array so the DataTableComponent renders it as a styled pill
  campusData = [
    { location: 'Paris - Main', director: 'Jean Dupont', students: '4,250', status: ['Active'] },
    { location: 'Lyon - Tech Hub', director: 'Marie Martin', students: '2,100', status: ['Active'] },
    { location: 'Strasbourg - East', director: 'Lucas Bernard', students: '850', status: ['Maintenance'] }
  ];
}