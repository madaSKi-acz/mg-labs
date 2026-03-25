import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../core/auth.service';
import { UserProfileService } from '../services/user.service';
import { LocalStorageService } from '../../../core/local-storage.service';

/**
 * User Profile Component
 * Displays and allows editing of user profile
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isEditing = false;
  isLoading = false;
  error: string | null = null;
  preferences: any = {};
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.loadPreferences();
  }

  /**
   * Load user profile
   */
  private loadProfile(): void {
    this.isLoading = true;
    const sub = this.userProfileService.getProfile().subscribe({
      next: (user: any) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load profile';
        this.isLoading = false;
        console.error(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Load user preferences
   */
  private loadPreferences(): void {
    this.preferences = this.localStorageService.getUserPreferences();
  }

  /**
   * Save preferences
   */
  savePreferences(): void {
    this.localStorageService.saveUserPreferences(this.preferences);
  }

  /**
   * Toggle edit mode
   */
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  /**
   * Save profile changes
   */
  saveChanges(): void {
    if (!this.user) return;

    const sub = this.userProfileService
      .updateProfile(this.user)
      .subscribe({
        next: (updatedUser: any) => {
          this.user = updatedUser;
          this.isEditing = false;
          this.savePreferences(); // Save preferences when profile is saved
        },
        error: (err: any) => {
          this.error = 'Failed to update profile';
          console.error(err);
        }
      });
    this.subscriptions.add(sub);
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
