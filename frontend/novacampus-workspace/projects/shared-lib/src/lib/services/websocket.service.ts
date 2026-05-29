import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {

  private socket: Socket | null = null;

  connect(url: string, token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    this.socket.on('connect', () =>
      console.log('WebSocket connected:', this.socket?.id)
    );
    this.socket.on('disconnect', (reason) =>
      console.log('WebSocket disconnected:', reason)
    );
  }

  // Listen for a specific event type
  onEvent<T>(eventName: string): Observable<T> {
    return new Observable(observer => {
      this.socket?.on(eventName, (data: T) => observer.next(data));
    });
  }

  // Emit an event to the server
  emit(eventName: string, data: unknown): void {
    this.socket?.emit(eventName, data);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}