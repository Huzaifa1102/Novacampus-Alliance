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
export class DocumentsComponent implements OnInit { // IMPLEMENT OnInit
  private http = inject(HttpClient); // INJECT HTTP
  
  // Replace your mock array with an empty array
  documentsList: any[] = []; // Update your HTML *ngFor to use this variable name

  ngOnInit() {
    console.log("Fetching live documents...");
    // Assuming your document service is on 3005 with this endpoint
    this.http.get<any[]>('http://localhost:3005/api/documents/my') 
      .subscribe({
        next: (data) => {
          console.log("Documents loaded:", data);
          this.documentsList = data; // Binds live data to your UI
        },
        error: (err) => console.error("Document API Error:", err)
      });
  }
}