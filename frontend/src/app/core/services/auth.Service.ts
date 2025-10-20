import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;
  

  constructor(private http: HttpClient) {}

  register(
    username: string,
    password: string,
    fullname: string
  ): Observable<AuthResponse> {
    return this.http
      .post(`${this.apiUrl}/register`, { username, password, fullname })
      .pipe(map((res) => res as AuthResponse));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post(`${this.apiUrl}/login`, { username, password })
      .pipe(map((res) => res as AuthResponse));
  }

  saveToken(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
