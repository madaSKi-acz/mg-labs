import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './components/user-profile.component';
import { UserSettingsComponent } from './components/user-settings.component';

/**
 * User Module
 * Feature module for user-specific operations
 */
@NgModule({
  declarations: [UserProfileComponent, UserSettingsComponent],
  imports: [CommonModule, FormsModule, UserRoutingModule]
})
export class UserModule { }