import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Financial Ledger</h1>
          <p class="text-sm text-text-muted mt-1">Track tuition payments, issue invoices, and monitor revenue.</p>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <button class="bg-white border border-border-light hover:bg-surface text-text-main px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex-1 sm:flex-none flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
          </button>
          <button class="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex-1 sm:flex-none flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            New Invoice
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
          <div class="p-3 bg-green-100 text-green-600 rounded-lg">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Collected (This Month)</p>
            <p class="text-2xl font-bold text-text-main">€142,500</p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-yellow-500">
          <div class="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Processing</p>
            <p class="text-2xl font-bold text-text-main">€18,250</p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
          <div class="p-3 bg-red-100 text-red-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Overdue Accounts</p>
            <p class="text-2xl font-bold text-text-main">€7,500 <span class="text-sm font-normal text-red-600 ml-1">Requires Action</span></p>
          </div>
        </div>

      </div>

      <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm flex flex-wrap items-center gap-4">
         <select class="bg-surface border border-border-light text-text-main text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/50">
           <option>All Statuses</option>
           <option>Paid</option>
           <option>Pending</option>
           <option>Overdue</option>
         </select>
         <div class="relative flex-1 min-w-[200px]">
           <input type="text" placeholder="Search by Student ID or Name..." 
             class="w-full bg-surface border border-border-light text-text-main text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary/50">
           <svg class="w-4 h-4 text-text-muted absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
         </div>
      </div>

      <app-data-table 
        title="Recent Transactions"
        [columns]="ledgerColumns" 
        [data]="ledgerData"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class PaymentsComponent implements OnInit {
  private http = inject(HttpClient);
  
  ledgerColumns = [
    { key: 'invoice_id', label: 'Invoice #', isPrimary: true },
    { key: 'student', label: 'Student Name' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
    { key: 'method', label: 'Payment Method' },
    { key: 'status', label: 'Status' }
  ];

  ledgerData: any[] = [
    { invoice_id: 'INV-2026-001', student: 'Alice Johnson', amount: '€3,500.00', date: '2026-02-10', method: 'SEPA Direct Debit', status: ['Paid'] },
    { invoice_id: 'INV-2026-002', student: 'Bob Smith', amount: '€3,500.00', date: '2026-02-12', method: 'Credit Card', status: ['Paid'] },
    { invoice_id: 'INV-2026-003', student: 'Charlie Davis', amount: '€1,750.00', date: '2026-02-28', method: 'Bank Transfer', status: ['Pending'] },
    { invoice_id: 'INV-2026-004', student: 'Diana Evans', amount: '€3,500.00', date: '2026-01-15', method: 'Overdue Notice Sent', status: ['Overdue'] }
  ];

  ngOnInit() {
    this.fetchPayments();
  }

  fetchPayments() {
    this.http.get<any[]>('http://localhost:8000/api/finance/payments')
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.ledgerData = data;
          }
        },
        error: (err) => console.log('Using local ledger view', err)
      });
  }
}