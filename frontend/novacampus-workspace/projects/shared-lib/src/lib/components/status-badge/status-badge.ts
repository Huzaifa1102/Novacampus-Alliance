import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeStatus = 'Paid' | 'Pending' | 'Delay' | 'Exempted' |
                   'Active' | 'Inactive' | 'Graduated' | 'Suspended' |
                   'Completed' | 'Dropped' | 'Failed';

@Component({
  selector: 'nca-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge badge--' + status.toLowerCase()">
      {{ status }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge--paid, .badge--active, .badge--completed   { background: #d4edda; color: #155724; }
    .badge--pending                                    { background: #fff3cd; color: #856404; }
    .badge--delay, .badge--failed, .badge--suspended  { background: #f8d7da; color: #721c24; }
    .badge--inactive, .badge--dropped                 { background: #e2e3e5; color: #383d41; }
    .badge--graduated, .badge--exempted               { background: #cce5ff; color: #004085; }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: BadgeStatus;
}