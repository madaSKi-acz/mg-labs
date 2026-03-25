import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/auth.service';
import { ProductService } from '../product/services/product.service';

/**
 * Dashboard Component
 * Displays welcome message and navigation
 * Redirects to login if not authenticated
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;
  totalProducts = 0;
  totalUsers = 0;
  totalRevenue = 0;
  activeOrders = 0;

  constructor(private readonly authService: AuthService, private readonly productService: ProductService, private readonly router: Router) { }

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();

    this.productService.getAll(1, 100).subscribe((response) => {
      this.totalProducts = response.data.length;
      this.totalUsers = 1200;
      this.totalRevenue = 815000;
      this.activeOrders = 37;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.router.navigate(['/auth/login']);
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
