import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'nca_access_token';
  private currentUser$ = new BehaviorSubject<AuthUser | null>(null);

  constructor(private http: HttpClient) {
    // Restore user from existing token on page load
    const token = this.getAccessToken();
    if (token) {
      this.currentUser$.next(this.decodeToken(token));
    }
  }

  // Returns the decoded user from the current token
  getCurrentUser(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.currentUser$.next(this.decodeToken(token));
  }

  decodeToken(token: string): AuthUser {
    return jwtDecode<AuthUser>(token);
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    const decoded = this.decodeToken(token);
    return decoded.exp * 1000 < Date.now();
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.currentUser$.next(null);
  }

  // Called by the JWT interceptor when a 401 is received
  refreshToken(): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      'http://localhost:8080/realms/novacampus/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type:    'refresh_token',
        client_id:     'student-portal',
        refresh_token: sessionStorage.getItem('nca_refresh_token') || ''
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).pipe(
      tap(res => this.setAccessToken(res.access_token))
    );
  }
}