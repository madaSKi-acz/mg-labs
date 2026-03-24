import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../core/auth.service';

/**
 * User Service (Feature-specific)
 * Handles user profile operations
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly apiUrl = '/api/user';

  constructor(private readonly http: HttpClient) { }

  /**
   * Get user profile
   */
  getProfile(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      map(({ data }: any) => new User(data))
    );
  }

  /**
   * Update user profile
   */
  updateProfile(profileData: any): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData).pipe(
      map(({ data }: any) => new User(data))
    );
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/profile-picture`, formData);
  }

  /**
   * Get user preferences
   */
  getPreferences(): Observable<any> {
    return this.http.get(`${this.apiUrl}/preferences`);
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/preferences`, preferences);
  }
}
