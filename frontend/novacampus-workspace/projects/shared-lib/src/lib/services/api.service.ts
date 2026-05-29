import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ApiService {

  // All requests go through Kong Gateway
  private readonly BASE_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string>): Observable<ApiResponse<T>> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http.get<ApiResponse<T>>(`${this.BASE_URL}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.BASE_URL}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.BASE_URL}${path}`, body);
  }

  patch<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.BASE_URL}${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.BASE_URL}${path}`);
  }
}