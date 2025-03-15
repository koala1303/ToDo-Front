import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../interfaces/login';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8080';
  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: Auth): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, { observe: 'response' });
  }

  decodeToken(token: string): any {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    const userName = this.getUserName();
    this.userNameSubject.next(userName);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.nombre || null;
    }
    return null;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('token');
    }
    this.userNameSubject.next(null);
  }
}