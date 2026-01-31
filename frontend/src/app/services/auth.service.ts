import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthTokenResponse, AuthRegisterResponse } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(request: any): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(res => this.saveTokens(res.accessToken, res.refreshToken))
    );
  }

  register(request: any): Observable<AuthRegisterResponse> {
    return this.http.post<AuthRegisterResponse>(`${this.baseUrl}/register`, request);
  }

  refreshToken(): Observable<AuthTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthTokenResponse>(`${this.baseUrl}/refresh`, null, {
      params: { refreshToken: refreshToken || '' }
    }).pipe(
      tap(res => this.saveTokens(res.accessToken, res.refreshToken))
    );
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('AuthService: Decoded Payload:', payload); // Debug log
      return payload.role || payload.roles?.[0] || payload.authorities?.[0]?.authority || null;
    } catch (e) {
      console.error('AuthService: Failed to decode token', e);
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    const role = this.getRole();
    // specific check for USER role, OR if role is missing but we are logged in, assume User (Backend fix workaround)
    return role === 'ROLE_USER' || (this.isLoggedIn() && !role);
  }
}
