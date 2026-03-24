import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

/**
 * Auth Module
 * Encapsulates authentication related components (login, register, etc.)
 */
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginComponent]
})
export class AuthModule { }
