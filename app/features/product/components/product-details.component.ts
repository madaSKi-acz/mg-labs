import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { LocalStorageService } from '../../../core/local-storage.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Loading State -->
      @if (isLoading()) {
        <div class="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-8 animate-pulse">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="aspect-square bg-slate-200 rounded-xl"></div>
            <div class="space-y-4">
              <div class="h-8 bg-slate-200 rounded w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded w-full"></div>
              <div class="h-4 bg-slate-200 rounded w-2/3"></div>
              <div class="h-6 bg-slate-200 rounded w-1/4"></div>
              <div class="h-10 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-8 text-center">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-medium text-red-900 mb-2">Error Loading Product</h3>
          <p class="text-red-700 mb-6">{{ error() }}</p>
          <button
            (click)="goBack()"
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 active:scale-95"
          >
            Go Back
          </button>
        </div>
      } @else if (product()) {
        <!-- Product Details -->
        <div class="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Product Image -->
            <div class="aspect-square bg-slate-100 relative overflow-hidden">
              <img
                [src]="product()!.imageUrl"
                [alt]="product()!.name"
                class="w-full h-full object-cover"
              />
              <!-- Stock Badge -->
              <div class="absolute top-4 left-4">
                <span
                  [class]="product()!.isInStock()
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-red-100 text-red-800 border-red-200'"
                  class="px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm"
                >
                  {{ product()!.isInStock() ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
              <!-- Price Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <span class="text-2xl font-bold text-slate-900">{{ product()!.getFormattedPrice() }}</span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-8 space-y-6">
              <div>
                <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ product()!.name }}</h1>
                <p class="text-slate-600">{{ product()!.category }}</p>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                <p class="text-slate-600 leading-relaxed">{{ product()!.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50/80 rounded-lg p-4">
                  <div class="text-sm text-slate-600 mb-1">Stock Quantity</div>
                  <div class="text-xl font-semibold text-slate-900">{{ product()!.stock }}</div>
                </div>
                <div class="bg-slate-50/80 rounded-lg p-4">
                  <div class="text-sm text-slate-600 mb-1">Category</div>
                  <div class="text-xl font-semibold text-slate-900">{{ product()!.category }}</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-4 pt-4">
                <button
                  (click)="addToCart()"
                  [disabled]="!product()!.isInStock()"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:cursor-not-allowed"
                >
                  @if (!product()!.isInStock()) {
                    Out of Stock
                  } @else {
                    Add to Cart
                  }
                </button>
                <button
                  (click)="editProduct()"
                  class="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 active:scale-95"
                  title="Edit Product"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  (click)="deleteProduct()"
                  class="p-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 active:scale-95"
                  title="Delete Product"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  private productService = inject(ProductService);
  private localStorageService = inject(LocalStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    this.isLoading.set(true);
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.error.set('Product ID not found');
      this.isLoading.set(false);
      return;
    }

    this.productService.getById(productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product details');
        this.isLoading.set(false);
        console.error('Product details error:', err);
      }
    });
  }

  addToCart(): void {
    if (this.product()) {
      this.localStorageService.addToCart(this.product()!);
      // Could add a toast notification here
    }
  }

  editProduct(): void {
    if (this.product()) {
      this.router.navigate([`/products/edit/${this.product()!.id}`]);
    }
  }

  deleteProduct(): void {
    if (this.product() && confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.product()!.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Delete product error:', err);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
