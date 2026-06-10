import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface AuthUser {
  sub: string;
  preferred_username: string;
  exp: number;
  realm_access?: { roles: string[] };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY   = 'nca_access_token';
  private readonly REFRESH_KEY = 'nca_refresh_token';
  private currentUser$         = new BehaviorSubject<AuthUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired()) {
      this.currentUser$.next(this.decodeToken(token));
    }
  }

  getCurrentUser(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  getRole(): string | null {
    const user = this.currentUser$.getValue();
    return user?.realm_access?.roles?.[0]?.toLowerCase() ?? null;
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.currentUser$.next(this.decodeToken(token));
  }

  setRefreshToken(token: string): void {
    sessionStorage.setItem(this.REFRESH_KEY, token);
  }

  decodeToken(token: string): AuthUser {
    return jwtDecode<AuthUser>(token);
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      'http://localhost:8080/realms/novacampus/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type:    'refresh_token',
        client_id:     'student-portal',
        refresh_token: sessionStorage.getItem(this.REFRESH_KEY) || ''
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).pipe(
      tap(res => this.setAccessToken(res.access_token))
    );
  }
}