import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Strategic Alerts Configuration</h1>
          <p class="text-sm text-text-muted mt-1">Manage automated alert thresholds.</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm space-y-5 max-w-md">
        
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-text-main text-sm">Room Overbooking</div>
            <div class="text-xs text-text-muted">Trigger if > 100% capacity</div>
          </div>
          <div (click)="toggles.overbooking = !toggles.overbooking" 
               [ngClass]="toggles.overbooking ? 'bg-brand-primary' : 'bg-gray-300'"
               class="w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out">
            <div [ngClass]="toggles.overbooking ? 'translate-x-4' : 'translate-x-0'"
                 class="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm transition-transform duration-300 ease-in-out"></div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-text-main text-sm">Low Attendance</div>
            <div class="text-xs text-text-muted">Trigger if < 85% average</div>
          </div>
          <div (click)="toggles.attendance = !toggles.attendance" 
               [ngClass]="toggles.attendance ? 'bg-brand-primary' : 'bg-gray-300'"
               class="w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out">
            <div [ngClass]="toggles.attendance ? 'translate-x-4' : 'translate-x-0'"
                 class="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm transition-transform duration-300 ease-in-out"></div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class StrategicAlertsComponent {
  // THIS IS THE STATE THAT MAKES THE BUTTONS WORK
  toggles = {
    overbooking: true,
    attendance: false
  };
}