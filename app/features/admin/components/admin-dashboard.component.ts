import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService, DashboardStats } from '../services/admin.service';

/**
 * Admin Dashboard Component
 * Displays admin statistics and analytics
 * Implements proper lifecycle management
 */
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardStats: DashboardStats | null = null;
  isLoading = false;
  error: string | null = null;
  private readonly subscriptions: Subscription = new Subscription();

  constructor(private readonly adminService: AdminService) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  /**
   * Load dashboard statistics
   */
  private loadDashboardStats(): void {
    this.isLoading = true;
    const sub = this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics';
        this.isLoading = false;
        console.error(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Refresh dashboard data
   */
  refreshData(): void {
    this.loadDashboardStats();
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
