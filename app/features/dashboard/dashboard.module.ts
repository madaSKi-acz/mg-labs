import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

/**
 * Dashboard Module
 * Encapsulates the dashboard component
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule],
  exports: [DashboardComponent]
})
export class DashboardModule { }
