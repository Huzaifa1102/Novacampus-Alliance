import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
      
      <div *ngIf="title" class="px-6 py-4 border-b border-border-light bg-surface/50">
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
              <td [colSpan]="columns.length + (showActions ? 1 : 0)" class="px-6 py-8 text-center text-text-muted italic">
                No records found.
              </td>
            </tr>

            <tr *ngFor="let row of data" class="hover:bg-surface/50 transition-colors group">
              
              <td *ngFor="let col of columns" class="px-6 py-4 text-text-main whitespace-nowrap">
                
                <ng-container *ngIf="isArray(row[col.key]); else normalText">
                  <span *ngFor="let item of row[col.key]" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1 border border-gray-200">
                    {{ item }}
                  </span>
                </ng-container>
                
                <ng-template #normalText>
                  <span [ngClass]="{'font-bold text-brand-dark': col.isPrimary}">
                    {{ row[col.key] }}
                  </span>
                </ng-template>

              </td>
              
              <td *ngIf="showActions" class="px-6 py-4 text-right whitespace-nowrap">
                <button class="text-brand-primary hover:text-blue-800 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      </div>
      
      <div class="px-6 py-3 border-t border-border-light bg-gray-50 flex justify-between items-center text-sm text-text-muted">
        <span>Showing {{ data.length }} records</span>
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">Prev</button>
          <button class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
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

  // Helper function to detect arrays in data
  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}