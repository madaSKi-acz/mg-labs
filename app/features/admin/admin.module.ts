import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard.component';

/**
 * Admin Module
 * Feature module for admin operations
 * Lazy-loaded for better performance
 */
@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, AdminRoutingModule]
})
export class AdminModule { }
