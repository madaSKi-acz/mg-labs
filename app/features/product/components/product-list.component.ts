import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { LocalStorageService } from '../../../core/local-storage.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Products</h1>
          <p class="text-slate-600 mt-1">Manage your product inventory</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-slate-600">Cart: {{ cartItemCount() }}</span>
          <button
            (click)="navigateNew()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 active:scale-95"
          >
            Add Product
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-6 animate-pulse">
              <div class="aspect-[4/3] bg-slate-200 rounded-lg mb-4"></div>
              <div class="h-4 bg-slate-200 rounded mb-2"></div>
              <div class="h-3 bg-slate-200 rounded mb-4"></div>
              <div class="flex justify-between items-center">
                <div class="h-4 bg-slate-200 rounded w-16"></div>
                <div class="h-8 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products(); track product.id) {
            <div class="bg-white ring-1 ring-slate-200/50 shadow-sm rounded-xl p-5 hover:shadow-md transition-all duration-300 group">
              <!-- Product Image -->
              <div class="aspect-[4/3] bg-slate-100 rounded-lg mb-4 relative overflow-hidden">
                <img
                  [src]="product.imageUrl"
                  [alt]="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <!-- Price Badge -->
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-900 shadow-sm">
                  {{ product.getFormattedPrice() }}
                </div>
                <!-- Stock Status -->
                @if (!product.isInStock()) {
                  <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span class="text-white font-medium">Out of Stock</span>
                  </div>
                }
              </div>

              <!-- Product Info -->
              <div class="space-y-2">
                <h3 class="font-semibold text-lg text-slate-900">{{ product.name }}</h3>
                <p class="text-sm text-slate-600 line-clamp-2">{{ product.description }}</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 text-slate-700">{{ product.category }}</span>
                  <span class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full {{ product.isInStock() ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700' }}">{{ product.isInStock() ? 'In Stock' : 'Out of Stock' }}</span>
                  @if (product.isLowStock()) {
                    <span class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-700">Low Stock</span>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-4 pt-4 border-t border-slate-200/60 space-y-2">
                <button
                  (click)="addToCart(product)"
                  [disabled]="!product.isInStock()"
                  class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-all duration-300 active:scale-95 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <div class="flex justify-end gap-2">
                  <button
                    (click)="navigateEdit(product.id)"
                    title="Edit Product"
                    class="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 active:scale-95"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    (click)="deleteProduct(product.id)"
                    title="Delete Product"
                    class="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 active:scale-95"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        @if (products().length === 0) {
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2"></path>
            </svg>
            <h3 class="text-lg font-medium text-slate-900 mb-2">No products found</h3>
            <p class="text-slate-600 mb-6">Get started by adding your first product.</p>
            <button
              (click)="navigateNew()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 active:scale-95"
            >
              Add Product
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  cartItemCount = signal<number>(0);

  ngOnInit(): void {
    this.loadProducts();
    this.updateCartCount();
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getAll(1, 20).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.isLoading.set(false);
      }
    });
  }

  private updateCartCount(): void {
    const cart = this.localStorageService.getCart();
    this.cartItemCount.set(cart.reduce((total, item) => total + item.quantity, 0));
  }

  addToCart(product: Product): void {
    this.localStorageService.addToCart(product);
    this.updateCartCount();
  }

  navigateNew(): void {
    this.router.navigate(['/products/new']);
  }

  navigateEdit(productId: string): void {
    this.router.navigate([`/products/edit/${productId}`]);
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(productId).subscribe({
        next: () => {
          // Remove from local array
          this.products.update(products =>
            products.filter(p => p.id !== productId)
          );
        },
        error: (error) => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
}
