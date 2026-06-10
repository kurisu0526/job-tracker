import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}api/auth/login`, dto).pipe(
      tap((res) => this.storeSession(res)),
      catchError((err) => {
        const message =
          err.error?.message ||
          err.message ||
          'Login failed';
        return throwError(() => new Error(message));
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('${this.baseUrl}api/auth/signup', dto).pipe(
    tap((res) => this.storeSession(res)),
    catchError((err) => {
      const message =
        err.error?.message ||
        err.message ||
        'Registration failed';
      return throwError(() => new Error(message));
    })
  );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }
}

