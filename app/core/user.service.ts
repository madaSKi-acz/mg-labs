import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap, BehaviorSubject } from 'rxjs';

/**
 * User Model
 * Represents user entity with OOP encapsulation
 */
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

export class User implements IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;

  constructor(userData: IUser) {
    this.id = userData.id;
    this.email = userData.email;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.role = userData.role;
    this.createdAt = new Date(userData.createdAt);
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  canManageUsers(): boolean {
    return this.isAdmin();
  }
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

/**
 * User Service
 * Handles user operations with Single Responsibility Principle
 * Manages user state and API communication
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = '/api/users';
  private readonly usersCache$ = new BehaviorSubject<User[]>([]);

  constructor(private readonly http: HttpClient) { }

  /**
   * Get all users with pagination and filtering
   */
  getAll(params: UserQueryParams = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      tap((response: any) => {
        const users = response.data.map((u: IUser) => new User(u));
        this.usersCache$.next(users);
      })
    );
  }

  /**
   * Get user by ID
   */
  getById(id: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(({ data }: any) => new User(data))
    );
  }

  /**
   * Create new user
   */
  create(userData: Partial<IUser>): Observable<User> {
    return this.http.post<any>(this.apiUrl, userData).pipe(
      map(({ data }: any) => new User(data)),
      tap((user: User) => this.updateCache(user))
    );
  }

  /**
   * Update user
   */
  update(id: string, payload: Partial<IUser>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(({ data }: any) => new User(data)),
      tap((user: User) => this.updateCache(user))
    );
  }

  /**
   * Delete user
   */
  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => this.removeFromCache(id))
    );
  }

  /**
   * Update user password
   */
  updatePassword(id: string, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/password`, {
      currentPassword,
      newPassword,
    }).pipe(map(() => undefined));
  }

  /**
   * Update cache when user is modified
   */
  private updateCache(user: User): void {
    const currentCache = this.usersCache$.value;
    const index = currentCache.findIndex((u: User) => u.id === user.id);
    if (index !== -1) {
      currentCache[index] = user;
      this.usersCache$.next([...currentCache]);
    }
  }

  /**
   * Remove user from cache
   */
  private removeFromCache(userId: string): void {
    const currentCache = this.usersCache$.value;
    const filtered = currentCache.filter((u: User) => u.id !== userId);
    this.usersCache$.next(filtered);
  }

  /**
   * Get cached users
   */
  getCachedUsers(): Observable<User[]> {
    return this.usersCache$.asObservable();
  }
}