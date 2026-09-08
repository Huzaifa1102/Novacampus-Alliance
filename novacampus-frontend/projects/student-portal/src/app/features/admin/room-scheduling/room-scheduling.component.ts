import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-room-scheduling',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Room Scheduling & Logistics</h1>
          <p class="text-sm text-text-muted mt-1">Manage physical spaces, capacities, and maintenance schedules.</p>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <button class="bg-white border border-border-light hover:bg-surface text-text-main px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex-1 sm:flex-none">
            Campus Map
          </button>
          <button class="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex-1 sm:flex-none flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Book Room
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-brand-primary">
          <div class="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Total Capacity</p>
            <p class="text-2xl font-bold text-text-main">4,850 <span class="text-sm font-normal text-text-muted">Seats</span></p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
          <div class="p-3 bg-green-100 text-green-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Available Now</p>
            <p class="text-2xl font-bold text-text-main">18 <span class="text-sm font-normal text-text-muted">Rooms</span></p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-border-light shadow-sm flex items-center gap-4 border-l-4 border-l-yellow-500">
          <div class="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">In Maintenance</p>
            <p class="text-2xl font-bold text-text-main">3 <span class="text-sm font-normal text-text-muted">Rooms</span></p>
          </div>
        </div>

      </div>

      <div class="bg-white p-4 rounded-xl border border-border-light shadow-sm flex flex-wrap items-center gap-4">
         <select class="bg-surface border border-border-light text-text-main text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/50">
           <option>All Campuses</option>
           <option>Paris - Main</option>
           <option>Lyon - Tech Hub</option>
         </select>
         <select class="bg-surface border border-border-light text-text-main text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/50">
           <option>All Room Types</option>
           <option>Amphitheater</option>
           <option>Computer Lab</option>
           <option>Seminar Room</option>
         </select>
      </div>

      <app-data-table 
        title="Campus Room Directory"
        [columns]="roomColumns" 
        [data]="roomData"
        [showActions]="true">
      </app-data-table>

    </div>
  `
})
export class RoomSchedulingComponent implements OnInit {
  private http = inject(HttpClient);
  
  roomColumns = [
    { key: 'room_name', label: 'Room Name', isPrimary: true },
    { key: 'room_type', label: 'Type' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Current Status' }
  ];

  roomData: any[] = [];

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/schedules/rooms')
      .subscribe({
        next: (res) => {
          this.roomData = (res.data || []).map((r: any) => ({
            room_name: r.room_name,
            room_type: r.room_type,
            capacity: r.capacity,
            status: ['Available']
          }));
        },
        error: (err) => console.error('Failed to load rooms', err)
      });
  }
}