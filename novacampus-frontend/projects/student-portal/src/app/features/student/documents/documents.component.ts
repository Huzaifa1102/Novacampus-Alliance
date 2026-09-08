import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">My Documents</h1>
          <p class="text-sm text-text-muted mt-1">Access your official transcripts, certificates, and administrative records.</p>
        </div>
        <button (click)="openUploadModal()" class="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Upload Document
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-3">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-text-muted uppercase">Transcripts</p>
            <p class="text-lg font-bold text-text-main">3 Official</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-3">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-text-muted uppercase">Certificates</p>
            <p class="text-lg font-bold text-text-main">2 Verified</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-3">
          <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1H10z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-text-muted uppercase">ID & Visa</p>
            <p class="text-lg font-bold text-text-main">Up to Date</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-3">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-text-muted uppercase">Cloud Storage</p>
            <p class="text-lg font-bold text-text-main">1.2 GB / 5 GB</p>
          </div>
        </div>
      </div>

      <app-data-table 
        title="Available Documents"
        [columns]="docColumns" 
        [data]="myDocuments"
        [showActions]="true">
      </app-data-table>

      <!-- Upload Modal -->
      <div *ngIf="showUploadModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
          <div class="flex justify-between items-center pb-3 border-b border-border-light">
            <h3 class="text-lg font-bold text-text-main">Upload New Document</h3>
            <button (click)="closeUploadModal()" class="text-text-muted hover:text-brand-dark">✕</button>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-text-muted uppercase block mb-1">Document Title</label>
              <input type="text" [(ngModel)]="newDocTitle" placeholder="e.g., Internship Contract 2026" class="w-full border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary">
            </div>
            <div>
              <label class="text-xs font-bold text-text-muted uppercase block mb-1">Category</label>
              <select [(ngModel)]="newDocCategory" class="w-full border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary">
                <option value="Academic">Academic Transcript</option>
                <option value="Certificate">Certificate / Diploma</option>
                <option value="Administrative">Administrative File</option>
              </select>
            </div>
            <div class="border-2 border-dashed border-border-light p-6 rounded-xl text-center cursor-pointer hover:bg-surface">
              <svg class="w-8 h-8 text-text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p class="text-xs font-medium text-text-muted">Click or drag PDF / DOCX file here</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-3 border-t border-border-light">
            <button (click)="closeUploadModal()" class="px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface rounded-lg">Cancel</button>
            <button (click)="submitUpload()" class="px-4 py-2 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-dark rounded-lg">Upload</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DocumentsComponent implements OnInit {
  private http = inject(HttpClient);
  
  showUploadModal = false;
  newDocTitle = '';
  newDocCategory = 'Academic';

  docColumns = [
    { key: 'name', label: 'Document Name', isPrimary: true },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date Issued' },
    { key: 'size', label: 'File Size' },
    { key: 'status', label: 'Status' }
  ];

  myDocuments: any[] = [
    { name: 'Official Transcript - Fall 2025.pdf', category: 'Academic', date: '2026-01-15', size: '1.4 MB', status: ['Verified'] },
    { name: 'Certificate of Enrollment - 2026.pdf', category: 'Certificate', date: '2026-02-01', size: '420 KB', status: ['Active'] },
    { name: 'Student ID & Visa Copy.pdf', category: 'Administrative', date: '2025-09-01', size: '2.1 MB', status: ['Verified'] },
    { name: 'Tuition Receipt 2025-2026.pdf', category: 'Financial', date: '2025-09-10', size: '890 KB', status: ['Completed'] }
  ];

  ngOnInit() {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.http.get<any[]>('http://localhost:8000/api/student/documents') 
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.myDocuments = data;
          }
        },
        error: (err) => console.log("Using local documents view", err)
      });
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  submitUpload() {
    if (!this.newDocTitle.trim()) return;
    this.myDocuments.unshift({
      name: `${this.newDocTitle.trim()}.pdf`,
      category: this.newDocCategory,
      date: new Date().toISOString().split('T')[0],
      size: '1.1 MB',
      status: ['Pending Verification']
    });
    this.newDocTitle = '';
    this.closeUploadModal();
  }
}