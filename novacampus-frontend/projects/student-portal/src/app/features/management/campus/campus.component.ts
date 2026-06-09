import { Component } from '@angular/core';

@Component({
  selector: 'app-campus',
  standalone: true,
  template: `
    <div class="space-y-6">
      
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-text-main">Campus Overview</h1>
          <p class="text-sm text-text-muted mt-1">Manage and monitor all active campus locations.</p>
        </div>
        <button class="bg-brand-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          + Add New Campus
        </button>
      </div>

      <div class="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface border-b border-border-light text-sm text-text-muted uppercase tracking-wider">
              <th class="p-4 font-semibold">Campus Location</th>
              <th class="p-4 font-semibold">Director</th>
              <th class="p-4 font-semibold">Total Students</th>
              <th class="p-4 font-semibold">Status</th>
              <th class="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light text-sm">
            
            <tr class="hover:bg-surface/50 transition-colors">
              <td class="p-4 font-medium text-text-main">Paris - Main</td>
              <td class="p-4 text-text-muted">Jean Dupont</td>
              <td class="p-4 text-text-main">4,250</td>
              <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="text-brand-primary hover:text-blue-800 font-medium">Edit</button>
              </td>
            </tr>

            <tr class="hover:bg-surface/50 transition-colors">
              <td class="p-4 font-medium text-text-main">Lyon - Tech Hub</td>
              <td class="p-4 text-text-muted">Marie Martin</td>
              <td class="p-4 text-text-main">2,100</td>
              <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="text-brand-primary hover:text-blue-800 font-medium">Edit</button>
              </td>
            </tr>

            <tr class="hover:bg-surface/50 transition-colors">
              <td class="p-4 font-medium text-text-main">Strasbourg - East</td>
              <td class="p-4 text-text-muted">Lucas Bernard</td>
              <td class="p-4 text-text-main">850</td>
              <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Maintenance
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="text-brand-primary hover:text-blue-800 font-medium">Edit</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  `
})
export class CampusComponent {}