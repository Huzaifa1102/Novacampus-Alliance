import {
  Component, inject, ViewChild, ElementRef,
  AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

interface ChatMsg {
  text: string;
  sender: 'user' | 'bot';
  error?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,   // immutable-friendly
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">

      <div *ngIf="isOpen" class="mb-4 w-80 sm:w-96 bg-white border border-slate-200
                                  rounded-xl shadow-2xl flex flex-col overflow-hidden">

        <div class="bg-slate-800 text-white p-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span class="font-bold text-sm tracking-wide">Nova AI Assistant</span>
          </div>
          <button (click)="toggleChat()" class="hover:text-slate-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div #chatContainer class="h-96 p-4 overflow-y-auto bg-slate-50 text-sm flex flex-col gap-3">
          <div *ngFor="let msg of messages; trackBy: trackMsg"
               class="p-3 rounded-lg max-w-[85%] shadow-sm"
               [ngClass]="{
                 'bg-blue-600 text-white rounded-br-none self-end':       msg.sender === 'user',
                 'bg-white border border-slate-200 text-slate-700 rounded-tl-none self-start': msg.sender === 'bot' && !msg.error,
                 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none self-start':    msg.sender === 'bot' && msg.error
               }">
            {{ msg.text }}
          </div>

          <div *ngIf="isLoading"
               class="bg-white border border-slate-200 text-slate-500 p-3 rounded-lg
                      rounded-tl-none self-start max-w-[85%] shadow-sm flex gap-1">
            <span class="animate-bounce">.</span>
            <span class="animate-bounce" style="animation-delay:0.2s">.</span>
            <span class="animate-bounce" style="animation-delay:0.4s">.</span>
          </div>
        </div>

        <div class="p-3 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            [(ngModel)]="newMessage"
            (keyup.enter)="sendMessage()"
            [disabled]="isLoading"
            placeholder="Type your question..."
            class="flex-1 p-2 border border-slate-300 rounded-md text-sm
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   disabled:bg-slate-50 disabled:text-slate-400"/>
          <button
            (click)="sendMessage()"
            [disabled]="!newMessage.trim() || isLoading"
            class="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </div>
      </div>

      <button *ngIf="!isOpen" (click)="toggleChat()"
              class="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700
                     transition-all transform hover:scale-105"
              aria-label="Open AI Chat">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14
                   a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </button>

    </div>
  `,
})
export class ChatbotComponent implements AfterViewChecked {
  private http = inject(HttpClient);
  private cdr  = inject(ChangeDetectorRef);

  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLElement>;

  isOpen     = false;
  newMessage = '';
  isLoading  = false;
  sessionId: string | null = null;

  // Spread-replace instead of push — guarantees OnPush detects the change
  messages: ChatMsg[] = [
    { text: 'Hello! I am Nova, your NovaCampus AI. Ask me about your timetable, grades, or payments.', sender: 'bot' },
  ];

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  trackMsg(_: number, msg: ChatMsg): string {
    return msg.text + msg.sender;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = this.chatContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { /* noop */ }
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text || this.isLoading) return;

    // Immutable push — OnPush picks this up instantly
    this.messages = [...this.messages, { text, sender: 'user' }];
    this.newMessage = '';
    this.isLoading  = true;
    this.cdr.markForCheck();

    const payload: Record<string, string> = { message: text };
    if (this.sessionId) payload['session_id'] = this.sessionId;

    this.http
      .post<{ response: string; session_id: string }>('http://localhost:8000/api/chat/message', payload)
      .pipe(
        timeout(12_000),   // client-side guard — stops dots hanging forever
        catchError((err: HttpErrorResponse | Error) => {
          const msg = this.errorMessage(err);
          return of({ response: msg, session_id: this.sessionId ?? '' });
        }),
      )
      .subscribe(res => {
        const isError = res.response.startsWith('⚠');
        this.messages = [...this.messages, { text: res.response, sender: 'bot', error: isError }];
        if (res.session_id) this.sessionId = res.session_id;
        this.isLoading = false;
        this.cdr.markForCheck();
      });
  }

  private errorMessage(err: unknown): string {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return '⚠ The assistant is taking too long to respond. Please try again.';
    }
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0)   return '⚠ Cannot reach the server. Check your connection.';
      if (err.status === 401) return '⚠ Your session has expired. Please log in again.';
      if (err.status === 503) return '⚠ The assistant service is temporarily unavailable.';
      return `⚠ Server error (${err.status}). Please try again.`;
    }
    return '⚠ Something went wrong. Please try again.';
  }
}