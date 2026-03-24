import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../services/product.service';

/**
 * Product List Component
 * Displays list of all products with pagination
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  selectedCategory: string | null = null;
  private readonly subscriptions = new Subscription();

  constructor(private readonly productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Load products
   */
  private loadProducts(): void {
    this.isLoading = true;
    const sub = this.productService
      .getAll(this.currentPage, this.pageSize, this.selectedCategory || undefined)
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        }
      });
    this.subscriptions.add(sub);
  }

  /**
   * Change page
   */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadProducts();
  }

  /**
   * Filter by category
   */
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
