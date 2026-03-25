import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';

/**
 * Dashboard Module
 * Encapsulates the dashboard component
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, SharedModule],
  exports: [DashboardComponent]
})
export class DashboardModule { }
