import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.checkAuth();
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/auth/login', { email, password })
            .pipe(tap(response => {
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response.user);
            }));
    }

    register(email: string, password: string, name: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/auth/register', { email, password, name })
            .pipe(tap(response => {
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response.user);
            }));
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    private checkAuth(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.http.get<User>('/api/auth/me').subscribe({
                next: user => this.currentUserSubject.next(user),
                error: () => this.logout()
            });
        }
    }
}
