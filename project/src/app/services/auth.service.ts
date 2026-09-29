import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'jwt_token';
  private userKey = 'current_user';

  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem(this.userKey);
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  signup(name: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, {
      name,
      email,
      password,
    });
  }

  signin(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signin`, {
      email,
      password,
    });
  }

  saveAuth(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
