// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
    token: string;
    tipo: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8080/api/auth';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_data';

    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/registro`, userData);
    }

    login(credentials: { username: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
            .pipe(
                tap((response: LoginResponse) => {
                    if (response.token) {
                        this.setToken(response.token);
                        this.setUserData(response);
                    }
                })
            );
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setUserData(data: LoginResponse): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(data));
    }

    getUserData(): LoginResponse | null {
        const data = localStorage.getItem(this.USER_KEY);
        console.log(data);
        if (data) {
            try {
                return JSON.parse(data) as LoginResponse;
            } catch {
                return null;
            }
        }
        return null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const userData = this.getUserData();
        console.log(userData?.roles);
        return userData?.roles?.includes('ROLE_ADMIN') || false;
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    getAuthorizationHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
}