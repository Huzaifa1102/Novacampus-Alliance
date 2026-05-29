import { Component, Input } from '@angular/core';

@Component({
  selector: 'nca-skeleton',
  standalone: true,
  template: `
    <div [class]="'skeleton skeleton--' + type">
      <ng-container *ngIf="type === 'table'">
        <div class="skeleton-row" *ngFor="let i of rows">
          <div class="skeleton-cell" *ngFor="let j of cols"></div>
        </div>
      </ng-container>
      <ng-container *ngIf="type === 'card'">
        <div class="skeleton-heading"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </ng-container>
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }
    .skeleton-row     { display: flex; gap: 1rem; margin-bottom: 0.75rem; }
    .skeleton-cell, .skeleton-heading, .skeleton-text {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 4px;
    }
    .skeleton-cell    { height: 1.5rem; flex: 1; }
    .skeleton-heading { height: 1.5rem; width: 40%; margin-bottom: 1rem; }
    .skeleton-text    { height: 1rem; width: 100%; margin-bottom: 0.5rem; }
    .skeleton-text.short { width: 60%; }
  `]
})
export class LoadingSkeletonComponent {
  @Input() type: 'table' | 'card' | 'form' = 'card';
  @Input() rowCount = 5;
  @Input() colCount = 4;
  get rows() { return Array(this.rowCount); }
  get cols() { return Array(this.colCount); }
}