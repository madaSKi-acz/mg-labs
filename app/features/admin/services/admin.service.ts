import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MockDataService } from '../../../core/mock-data.service';

/**
 * Admin Dashboard Data
 */
export interface IDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export class DashboardStats implements IDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;

  constructor(data: IDashboardStats) {
    this.totalUsers = data.totalUsers;
    this.totalProducts = data.totalProducts;
    this.totalOrders = data.totalOrders;
    this.totalRevenue = data.totalRevenue;
  }

  /**
   * Get formatted revenue
   */
  getFormattedRevenue(): string {
    return `$${(this.totalRevenue / 100).toFixed(2)}`;
  }
}

/**
 * Admin Service
 * Handles admin-specific operations
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = '/api/admin';

  constructor(private readonly http: HttpClient, private readonly mockDataService: MockDataService) { }

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    if (environment.useMock) {
      return this.mockDataService.getDashboardStats();
    }
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map(({ data }) => new DashboardStats(data))
    );
  }

  /**
   * Get user analytics
   */
  getUserAnalytics(period: string = 'month'): Observable<any> {
    if (environment.useMock) {
      return this.mockDataService.getDashboardStats().pipe(
        map(stats => ({ period, activeUsers: stats.totalUsers, newUsers: 18 }))
      );
    }
    return this.http.get(`${this.apiUrl}/analytics/users?period=${period}`);
  }

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics(period: string = 'month'): Observable<any> {
    if (environment.useMock) {
      return this.mockDataService.getDashboardStats().pipe(
        map(stats => ({ period, revenue: stats.totalRevenue, growth: 0.12 }))
      );
    }
    return this.http.get(`${this.apiUrl}/analytics/revenue?period=${period}`);
  }

  /**
   * Get system logs
   */
  getSystemLogs(page: number = 1): Observable<any> {
    if (environment.useMock) {
      return of({ logs: [{ id: 1, message: 'Mock log entry', date: new Date().toISOString() }] });
    }
    return this.http.get(`${this.apiUrl}/logs?page=${page}`);
  }

  /**
   * Clear cache
   */
  clearCache(): Observable<any> {
    if (environment.useMock) {
      return of({ success: true });
    }
    return this.http.post(`${this.apiUrl}/cache/clear`, {});
  }
}
