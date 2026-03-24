import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private readonly http: HttpClient) { }

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map(({ data }) => new DashboardStats(data))
    );
  }

  /**
   * Get user analytics
   */
  getUserAnalytics(period: string = 'month'): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/users?period=${period}`);
  }

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics(period: string = 'month'): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/revenue?period=${period}`);
  }

  /**
   * Get system logs
   */
  getSystemLogs(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/logs?page=${page}`);
  }

  /**
   * Clear cache
   */
  clearCache(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cache/clear`, {});
  }
}
