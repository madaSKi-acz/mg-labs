import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../features/product/services/product.service';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
      <!-- Image Section -->
      <div class="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          [src]="product.imageUrl"
          [alt]="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <!-- Stock Badge -->
        <div [ngClass]="[
          'absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full',
          getStockBadgeClass()
        ]">
          {{ getStockLabel() }}
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 line-clamp-2 mb-1">{{ product.name }}</h3>
        <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ product.description }}</p>

        <!-- Price Section -->
        <div class="mb-4">
          <span class="text-2xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
        </div>

        <!-- Actions Section -->
        <div class="flex gap-2">
          <button
            (click)="onAddToCart()"
            [disabled]="!product.isInStock()"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors duration-200"
          >
            Add to Cart
          </button>
          <button
            (click)="onEdit()"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Edit product"
          >
            <mat-icon class="text-gray-600">edit</mat-icon>
          </button>
          <button
            (click)="onDelete()"
            class="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
            title="Delete product"
          >
            <mat-icon class="text-red-600">delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  getStockBadgeClass(): string {
    if (this.product.stock > 20) {
      return 'bg-green-100 text-green-700';
    } else if (this.product.stock > 5) {
      return 'bg-yellow-100 text-yellow-700';
    } else {
      return 'bg-red-100 text-red-700';
    }
  }

  getStockLabel(): string {
    if (this.product.stock > 20) {
      return `${this.product.stock} in stock`;
    } else if (this.product.stock > 0) {
      return `${this.product.stock} left`;
    } else {
      return 'Out of stock';
    }
  }

  formatPrice(price: number): string {
    return `$${(price / 100).toFixed(2)}`;
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onEdit(): void {
    this.edit.emit(this.product.id);
  }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      this.delete.emit(this.product.id);
    }
  }
}
