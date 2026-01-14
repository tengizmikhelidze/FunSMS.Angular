import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import {
  User,
  AuthResponse,
  RefreshTokenResponse,
  ProfileResponse,
  LoginCredentials,
  RegisterData
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const credentials: LoginCredentials = { email, password };
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    const data: RegisterData = { email, password, name };
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          this.clearTokens();
        }),
        catchError(() => {
          // Even if API call fails, clear local tokens
          this.clearTokens();
          throw new Error('Logout failed');
        })
      );
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('accessToken', response.data.accessToken);
          }
        }),
        map(response => response.data.accessToken)
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<ProfileResponse>(`${this.API_URL}/profile`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.data.user);
          }
        }),
        map(response => response.data.user)
      );
  }

  private checkAuth(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.getProfile().subscribe({
        next: () => {},
        error: () => this.clearTokens()
      });
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
