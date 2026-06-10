import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">My Documents</h1>
          <p class="text-sm text-text-muted mt-1">Access your official transcripts, certificates, and administrative records.</p>
        </div>
        <button class="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Upload Document
        </button>
      </div>

      <app-data-table 
        title="Available Documents"
        [columns]="docColumns" 
        [data]="myDocuments"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class DocumentsComponent {
  
  docColumns = [
    { key: 'name', label: 'Document Name', isPrimary: true },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date Added' },
    { key: 'status', label: 'Status' }
  ];

  // Note: I wrapped the status strings in arrays so they render as nicely styled pills 
  // based on the logic we built into DataTableComponent.
  myDocuments = [
    { name: 'Semester 1 Transcript', type: 'Official', date: 'Oct 12, 2026', status: ['Available'] },
    { name: 'Student ID Card (Digital)', type: 'ID', date: 'Sep 01, 2025', status: ['Active'] },
    { name: 'Internship Agreement', type: 'Contract', date: 'Apr 10, 2026', status: ['Signed'] },
    { name: 'Proof of Enrollment', type: 'Letter', date: 'May 20, 2026', status: ['Pending Verification'] }
  ];
}