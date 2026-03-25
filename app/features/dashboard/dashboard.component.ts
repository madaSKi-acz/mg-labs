import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/auth.service';
import { ProductService } from '../product/services/product.service';

/**
 * Dashboard Component
 * Displays welcome message and key metrics
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;
  
  // Stats
  totalProducts = 0;
  totalUsers = 0;
  totalRevenue = 0;
  activeOrders = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Load products count
    this.productService.getAll(1, 1000).subscribe({
      next: (response) => {
        this.totalProducts = response.data.length;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });

    // Simulate loading other stats (in production, call real API)
    setTimeout(() => {
      this.totalUsers = 1240;
      this.totalRevenue = 45600;
      this.activeOrders = 28;
      this.isLoading = false;
    }, 500);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
