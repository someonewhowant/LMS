import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

// Environment could be imported here, using hardcoded for simplicity
const API_URL = 'http://localhost:3000/api/auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // State
  private currentUserSignal = signal<User | null>(null);
  
  // Public signals
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal() || this.tokenService.hasToken());
  userRole = computed(() => this.currentUserSignal()?.role || this.tokenService.getRole());

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    if (this.tokenService.hasToken()) {
      // In a real app, you would fetch user profile here
      // this.getProfile().subscribe();
      
      // Mocking user profile from token payload
      const payload = this.tokenService.getPayload();
      if (payload) {
        this.currentUserSignal.set({
          id: payload.sub || '1',
          email: payload.email || 'user@example.com',
          firstName: 'Developer',
          lastName: 'Student',
          role: payload.role || 'student'
        });
      }
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{access_token: string}>(`${API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.access_token) {
          this.tokenService.saveToken(response.access_token);
          this.checkAuthStatus();
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, userData);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
}
