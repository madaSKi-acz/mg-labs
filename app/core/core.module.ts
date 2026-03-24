import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthGuard } from './gaurds/auth.guard';

/**
 * Core Module
 * Provides singleton services used throughout the application
 * Imported only once in AppModule
 * Contains guards, interceptors, and core services
 */
@NgModule({
  imports: [CommonModule],
  providers: [AuthService, UserService, AuthGuard]
})
export class CoreModule { }
