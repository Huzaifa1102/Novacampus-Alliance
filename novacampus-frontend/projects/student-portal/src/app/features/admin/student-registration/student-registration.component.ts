import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 class="text-2xl font-bold text-text-main">Student Registration</h1>
        <p class="text-sm text-text-muted mt-1">Enroll a new student into the Novacampus system.</p>
      </div>

      <div *ngIf="isSubmitted" class="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center space-x-3 shadow-sm transition-all duration-300">
        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span class="font-medium">Student successfully registered! Redirecting to profile...</span>
      </div>

      <form *ngIf="!isSubmitted" (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        
        <div class="p-6 md:p-8 space-y-6">
          <h2 class="text-lg font-semibold text-text-main border-b border-border-light pb-2">Personal Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-text-main">First Name <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="formData.firstName" name="firstName" required
                class="w-full px-4 py-2.5 rounded-lg border border-border-light bg-surface focus:bg-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-200" 
                placeholder="Jean">
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-text-main">Last Name <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="formData.lastName" name="lastName" required
                class="w-full px-4 py-2.5 rounded-lg border border-border-light bg-surface focus:bg-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-200" 
                placeholder="Dupont">
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="block text-sm font-medium text-text-main">Email Address <span class="text-red-500">*</span></label>
              <input type="email" [(ngModel)]="formData.email" name="email" required
                class="w-full px-4 py-2.5 rounded-lg border border-border-light bg-surface focus:bg-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-200" 
                placeholder="jean.dupont@novacampus.fr">
            </div>
          </div>

          <h2 class="text-lg font-semibold text-text-main border-b border-border-light pb-2 mt-8">Academic Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-text-main">Assigned Campus</label>
              <select [(ngModel)]="formData.campus" name="campus"
                class="w-full px-4 py-2.5 rounded-lg border border-border-light bg-surface focus:bg-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-200 cursor-pointer">
                <option value="Paris">Paris - Main</option>
                <option value="Lyon">Lyon - Tech Hub</option>
                <option value="Strasbourg">Strasbourg - East</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-text-main">Program of Study</label>
              <select [(ngModel)]="formData.program" name="program"
                class="w-full px-4 py-2.5 rounded-lg border border-border-light bg-surface focus:bg-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-200 cursor-pointer">
                <option value="WebDev">Advanced Web Development</option>
                <option value="SoftwareArch">Software Architecture</option>
                <option value="DevOps">DevOps & CI/CD</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-surface px-6 py-4 border-t border-border-light flex justify-end space-x-3">
          <button type="button" class="px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text-main hover:bg-white border border-transparent hover:border-border-light rounded-lg transition-colors">
            Cancel
          </button>
          
          <button type="submit" 
            [disabled]="isProcessing"
            class="flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
            
            <svg *ngIf="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            
            {{ isProcessing ? 'Saving...' : 'Complete Registration' }}
          </button>
        </div>
      </form>

    </div>
  `
})
export class StudentRegistrationComponent {
  
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    campus: 'Paris',
    program: 'WebDev'
  };

  isProcessing = false;
  isSubmitted = false;

  onSubmit() {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.isSubmitted = true;
      console.log('Registration Data Sent to Database:', this.formData);
    }, 1500);
  }
}