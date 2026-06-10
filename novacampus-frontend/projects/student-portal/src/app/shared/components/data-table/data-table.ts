import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
      
      <div *ngIf="title" class="px-6 py-4 border-b border-border-light bg-surface/80">
        <h3 class="text-lg font-bold text-text-main">{{ title }}</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-full">
          
          <thead>
            <tr class="bg-surface border-b border-border-light text-xs text-text-muted uppercase tracking-wider">
              <th *ngFor="let col of columns" class="px-6 py-4 font-semibold whitespace-nowrap">
                {{ col.label }}
              </th>
              <th *ngIf="showActions" class="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-border-light text-sm">
            
            <tr *ngIf="data.length === 0">
              <td [colSpan]="columns.length + (showActions ? 1 : 0)" class="px-6 py-12 text-center text-text-muted italic">
                <div class="flex flex-col items-center justify-center">
                   <svg class="w-8 h-8 mb-3 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                   No records found.
                </div>
              </td>
            </tr>

            <tr *ngFor="let row of data" class="hover:bg-surface transition-colors group">
              
              <td *ngFor="let col of columns" class="px-6 py-4 text-text-main whitespace-nowrap">
                
                <ng-container *ngIf="isArray(row[col.key]); else normalText">
                  <span *ngFor="let item of row[col.key]" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface text-text-muted mr-1 border border-border-light">
                    {{ item }}
                  </span>
                </ng-container>
                
                <ng-template #normalText>
                  <span [ngClass]="{'font-semibold text-brand-dark': col.isPrimary}">
                    {{ row[col.key] }}
                  </span>
                </ng-template>

              </td>
              
              <td *ngIf="showActions" class="px-6 py-4 text-right whitespace-nowrap">
                <button class="text-brand-primary hover:text-brand-dark font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      </div>
      
      <div class="px-6 py-3 border-t border-border-light bg-surface/50 flex justify-between items-center text-sm text-text-muted">
        <span>Showing {{ data.length }} records</span>
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-white border border-border-light rounded hover:bg-surface disabled:opacity-50 transition-colors">Prev</button>
          <button class="px-3 py-1 bg-white border border-border-light rounded hover:bg-surface disabled:opacity-50 transition-colors">Next</button>
        </div>
      </div>

    </div>
  `
})
export class DataTableComponent {
  @Input() title: string = '';
  @Input() columns: { key: string, label: string, isPrimary?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() showActions: boolean = false;

  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}