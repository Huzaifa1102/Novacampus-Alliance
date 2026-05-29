import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nca-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card">
      <span class="kpi-label">{{ label }}</span>
      <span class="kpi-value">{{ value }}</span>
      <span *ngIf="trend !== undefined"
            [class]="'kpi-trend kpi-trend--' + (trend >= 0 ? 'up' : 'down')">
        {{ trend >= 0 ? '▲' : '▼' }} {{ trend | number:'1.1-1' }}%
      </span>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .kpi-label  { font-size: 0.8rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
    .kpi-value  { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; }
    .kpi-trend--up   { font-size: 0.8rem; color: #28a745; }
    .kpi-trend--down { font-size: 0.8rem; color: #dc3545; }
  `]
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() trend?: number;
}