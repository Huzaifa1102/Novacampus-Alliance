import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in font-sans">
      
      <div class="pb-5 border-b border-slate-200">
        <h2 class="text-2xl font-bold text-slate-800">Student Registration</h2>
        <p class="mt-1 text-sm text-slate-500">Enter the new student's details to provision their NovaCampus account.</p>
      </div>

      <div *ngIf="isSubmitted" class="p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-3">
        <svg class="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <h3 class="text-sm font-medium text-emerald-800">Successfully Registered</h3>
          <p class="mt-1 text-sm text-emerald-700">The student profile has been created and welcome emails have been dispatched.</p>
          <button (click)="resetForm()" class="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-500">Register another student &rarr;</button>
        </div>
      </div>

      <form *ngIf="!isSubmitted" [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        
        <div class="p-6 sm:p-8 space-y-8">
          
          <div>
            <h3 class="text-lg font-medium leading-6 text-slate-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              
              <div>
                <label for="firstName" class="block text-sm font-medium text-slate-700">First Name</label>
                <input type="text" id="firstName" formControlName="firstName" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:text-sm transition-colors" placeholder="Jane">
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-slate-700">Last Name</label>
                <input type="text" id="lastName" formControlName="lastName" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:text-sm transition-colors" placeholder="Doe">
              </div>

              <div class="sm:col-span-2">
                <label for="email" class="block text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" id="email" formControlName="email" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:text-sm transition-colors" placeholder="jane.doe@example.com">
              </div>
            </div>
          </div>

          <hr class="border-slate-200">

          <div>
            <h3 class="text-lg font-medium leading-6 text-slate-900 mb-4">Academic Details</h3>
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              
              <div>
                <label for="major" class="block text-sm font-medium text-slate-700">Declared Major</label>
                <select id="major" formControlName="major" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:text-sm transition-colors bg-white">
                  <option value="" disabled selected>Select a program...</option>
                  <option value="cs">Computer Science</option>
                  <option value="engineering">Mechanical Engineering</option>
                  <option value="business">Business Administration</option>
                  <option value="arts">Liberal Arts</option>
                </select>
              </div>

              <div>
                <label for="enrollmentYear" class="block text-sm font-medium text-slate-700">Enrollment Year</label>
                <input type="number" id="enrollmentYear" formControlName="enrollmentYear" class="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:text-sm transition-colors">
              </div>

            </div>
          </div>
        </div>

        <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button type="button" (click)="registrationForm.reset()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-colors">
            Clear Form
          </button>
          <button type="submit" [disabled]="!registrationForm.valid" class="px-4 py-2 text-sm font-medium text-white bg-brand-dark border border-transparent rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
            Register Student
          </button>
        </div>
      </form>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StudentRegistrationComponent {
  registrationForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    // Initialize the form with validation rules
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      major: ['', Validators.required],
      enrollmentYear: [new Date().getFullYear(), [Validators.required, Validators.min(2020)]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Submitted Data:', this.registrationForm.value);
      // Here is where your friend will hook up the API POST request tomorrow!
      this.isSubmitted = true;
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.registrationForm.reset({ enrollmentYear: new Date().getFullYear() });
  }
}