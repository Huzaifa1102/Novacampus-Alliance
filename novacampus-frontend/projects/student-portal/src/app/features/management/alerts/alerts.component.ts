import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Strategic Alerts & Monitoring</h1>
          <p class="text-sm text-text-muted mt-1">Configure automated triggers and monitor active campus warnings.</p>
        </div>
        <button class="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          Save Configuration
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-1 space-y-4">
          <h2 class="text-lg font-bold text-text-main border-b border-border-light pb-2">Threshold Settings</h2>
          
          <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm space-y-6">
            
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-text-main text-sm">Room Overbooking</div>
                <div class="text-xs text-text-muted mt-0.5">Trigger if > 100% capacity</div>
              </div>
              <div (click)="toggles.overbooking = !toggles.overbooking" 
                   [ngClass]="toggles.overbooking ? 'bg-brand-primary' : 'bg-border-light'"
                   class="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out shadow-inner">
                <div [ngClass]="toggles.overbooking ? 'translate-x-5' : 'translate-x-0'"
                     class="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow transition-transform duration-300 ease-in-out"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-text-main text-sm">Low Attendance</div>
                <div class="text-xs text-text-muted mt-0.5">Trigger if < 85% class average</div>
              </div>
              <div (click)="toggles.attendance = !toggles.attendance" 
                   [ngClass]="toggles.attendance ? 'bg-brand-primary' : 'bg-border-light'"
                   class="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out shadow-inner">
                <div [ngClass]="toggles.attendance ? 'translate-x-5' : 'translate-x-0'"
                     class="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow transition-transform duration-300 ease-in-out"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-text-main text-sm">Payment Defaults</div>
                <div class="text-xs text-text-muted mt-0.5">Trigger on 15 days overdue</div>
              </div>
              <div (click)="toggles.payments = !toggles.payments" 
                   [ngClass]="toggles.payments ? 'bg-brand-primary' : 'bg-border-light'"
                   class="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out shadow-inner">
                <div [ngClass]="toggles.payments ? 'translate-x-5' : 'translate-x-0'"
                     class="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow transition-transform duration-300 ease-in-out"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-text-main text-sm">Equipment Failure</div>
                <div class="text-xs text-text-muted mt-0.5">Notify IT instantly</div>
              </div>
              <div (click)="toggles.equipment = !toggles.equipment" 
                   [ngClass]="toggles.equipment ? 'bg-brand-primary' : 'bg-border-light'"
                   class="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out shadow-inner">
                <div [ngClass]="toggles.equipment ? 'translate-x-5' : 'translate-x-0'"
                     class="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow transition-transform duration-300 ease-in-out"></div>
              </div>
            </div>

          </div>
        </div>

        <div class="lg:col-span-2 space-y-4">
          <div class="flex justify-between items-end border-b border-border-light pb-2">
            <h2 class="text-lg font-bold text-text-main">Active Alerts Log</h2>
            <span class="text-xs font-semibold text-text-muted">Last updated: Just now</span>
          </div>

          <div class="space-y-3">
            
            <div class="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div class="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-bold text-red-800">Room Capacity Exceeded</h3>
                <p class="text-sm text-red-600 mt-1">Lille Campus: Amphitheater B currently has 145 students scheduled for a maximum capacity of 120.</p>
                <div class="mt-3 flex gap-2">
                  <button class="text-xs font-semibold bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded hover:bg-red-100 transition-colors">Reassign Room</button>
                  <button class="text-xs font-semibold text-text-muted hover:text-text-main px-3 py-1.5 transition-colors">Dismiss</button>
                </div>
              </div>
              <span class="text-xs text-red-500 font-medium whitespace-nowrap">10m ago</span>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div class="p-2 bg-yellow-100 text-yellow-600 rounded-full shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-bold text-yellow-800">Attendance Drop Detected</h3>
                <p class="text-sm text-yellow-700 mt-1">Paris Campus: 'DEV101' attendance dropped to 78% over the last 3 sessions.</p>
                <div class="mt-3 flex gap-2">
                  <button class="text-xs font-semibold bg-white border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded hover:bg-yellow-100 transition-colors">Message Instructor</button>
                </div>
              </div>
              <span class="text-xs text-yellow-600 font-medium whitespace-nowrap">2h ago</span>
            </div>

            <div class="bg-white border border-border-light rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div class="p-2 bg-brand-primary/10 text-brand-primary rounded-full shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-bold text-text-main">System Maintenance</h3>
                <p class="text-sm text-text-muted mt-1">Global: Scheduled server maintenance starting at 02:00 AM CEST.</p>
              </div>
              <span class="text-xs text-text-muted font-medium whitespace-nowrap">5h ago</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class StrategicAlertsComponent {
  toggles = {
    overbooking: true,
    attendance: true,
    payments: false,
    equipment: true
  };
}