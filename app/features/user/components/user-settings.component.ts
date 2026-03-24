import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../services/user.service';

/**
 * User Settings Component
 * Handles user settings and preferences
 */
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  preferences: any = null;
  isLoading = false;
  isSaving = false;
  successMessage: string | null = null;
  private readonly subscriptions = new Subscription();

  constructor(private readonly userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.loadPreferences();
  }

  /**
   * Load user preferences
   */
  private loadPreferences(): void {
    this.isLoading = true;
    const sub = this.userProfileService.getPreferences().subscribe({
      next: (preferences: any) => {
        this.preferences = preferences.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Save preferences
   */
  savePreferences(): void {
    if (!this.preferences) return;

    this.isSaving = true;
    const sub = this.userProfileService
      .updatePreferences(this.preferences)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Settings saved successfully';
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err: any) => {
          this.isSaving = false;
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
