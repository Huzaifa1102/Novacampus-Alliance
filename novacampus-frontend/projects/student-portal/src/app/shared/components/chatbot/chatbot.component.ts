import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <div *ngIf="isOpen" class="mb-4 w-80 bg-white border border-border-light rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
        
        <div class="bg-brand-dark text-white p-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span class="font-bold text-sm tracking-wide">Nova AI Assistant</span>
          </div>
          <button (click)="toggleChat()" class="hover:text-gray-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="h-80 p-4 overflow-y-auto bg-surface text-sm flex flex-col gap-3">
          <div class="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none self-start max-w-[85%] shadow-sm">
            Hello! I am your NovaCampus AI. How can I help you with your timetable, grades, or campus navigation today?
          </div>
        </div>

        <div class="p-3 border-t border-border-light bg-white flex gap-2">
          <input type="text" placeholder="Type your question..." class="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-brand-dark transition-colors">
          <button class="bg-brand-dark text-white px-3 py-2 rounded-md hover:bg-opacity-90 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>

      <button *ngIf="!isOpen" (click)="toggleChat()" class="bg-brand-dark text-white p-4 rounded-full shadow-xl hover:bg-opacity-90 transition-all transform hover:scale-105 flex items-center justify-center group" aria-label="Open AI Chat">
        <svg class="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      </button>
      
    </div>
  `
})
export class ChatbotComponent {
  isOpen = false;
  
  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}