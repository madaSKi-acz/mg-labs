import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../services/product.service';
import { LocalStorageService } from '../../../core/local-storage.service';

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
  cartItemCount = 0;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly productService: ProductService,
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.updateCartCount();
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
   * Add product to cart
   */
  addToCart(product: Product): void {
    this.localStorageService.addToCart(product);
    this.updateCartCount();
  }

  /**
   * Update cart item count
   */
  private updateCartCount(): void {
    const cart = this.localStorageService.getCart();
    this.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Change page
   */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadProducts();
  }

  /**
   * Navigate to new product form
   */
  navigateNew(): void {
    this.router.navigate(['/products/new']);
  }

  /**
   * Navigate to edit product form
   */
  navigateEdit(productId: string): void {
    this.router.navigate([`/products/edit/${productId}`]);
  }

  /**
   * Delete product and refresh list
   */
  removeProduct(productId: string): void {
    this.isLoading = true;
    const sub = this.productService.delete(productId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Product delete failed:', err);
      }
    });
    this.subscriptions.add(sub);
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
