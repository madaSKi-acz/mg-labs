import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

/**
 * Authentication Token
 * Encapsulates authentication token data
 */
export class AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;

  constructor(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }

  /**
   * Check if token is expired
   */
  isExpired(): boolean {
    try {
      const tokenData = JSON.parse(atob(this.accessToken.split('.')[1]));
      return Date.now() >= tokenData.exp * 1000;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration time in milliseconds
   */
  getExpirationTime(): number {
    return this.expiresIn * 1000;
  }
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User Role
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * User Model
 */
export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }
}

/**
 * Authentication Service
 * Manages user authentication and authorization
 * Implements Singleton pattern through DI
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly apiUrl = '/api/auth';

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly mockDataService: MockDataService
  ) {
    this.initializeFromStorage();
  }

  /**
   * Initialize authentication from stored tokens
   */
  private initializeFromStorage(): void {
    const token = this.getAccessToken();
    if (token && !new AuthToken(token, '', 0).isExpired()) {
      this.isAuthenticatedSubject.next(true);
      this.fetchCurrentUser().subscribe();
    }
  }

  /**
   * Login user with credentials
   */
  login(credentials: LoginCredentials): Observable<User> {
    if (environment.useMock) {
      return this.mockDataService.login(credentials.email, credentials.password).pipe(
        tap(({ tokens, user }) => {
          this.storeTokens(tokens);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(({ user }) => user)
      );
    }

    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(({ data }: any) => {
          this.storeTokens(data.tokens);
          const user = new User(data.user);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(({ data }: any) => new User(data.user))
      );
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<User> {
    if (environment.useMock) {
      return this.mockDataService.register(userData).pipe(
        tap(({ tokens, user }) => {
          this.storeTokens(tokens);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(({ user }) => user)
      );
    }

    return this.http
      .post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(({ data }: any) => {
          this.storeTokens(data.tokens);
          const user = new User(data.user);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(({ data }: any) => new User(data.user))
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    if (environment.useMock) {
      this.clearAuthData();
      return of(undefined);
    }

    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearAuthData())
    );
  }

  /**
   * Clear authentication data and redirect
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<any>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(({ data }: any) => this.storeTokens(data)),
        map(({ data }: any) => data.accessToken)
      );
  }

  /**
   * Fetch current user from API
   */
  fetchCurrentUser(): Observable<User> {
    if (environment.useMock) {
      return this.mockDataService.getCurrentUser().pipe(
        tap(user => this.currentUserSubject.next(user)),
        map(user => user)
      );
    }

    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap(({ data }: any) => this.currentUserSubject.next(new User(data))),
      map(({ data }: any) => new User(data))
    );
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * Check if user has role
   */
  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.getValue();
    return user ? user.hasRole(role) : false;
  }

  /**
   * Check if user has any of the provided roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.getValue();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  /**
   * Get authentication state observable
   */
  isAuthenticatedState(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  /**
   * Store tokens in local storage
   */
  private storeTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Forgot password request
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}