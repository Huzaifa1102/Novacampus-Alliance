import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A Signal that tracks the active role reactively
  private roleSignal = signal<string | null>(localStorage.getItem('user_role'));

  // Expose the read-only value of the current role
  readonly userRole = computed(() => this.roleSignal());

  setRole(role: string | null) {
    if (role) {
      localStorage.setItem('user_role', role);
    } else {
      localStorage.clear();
    }
    this.roleSignal.set(role);
  }

  logout() {
    this.setRole(null);
  }
}