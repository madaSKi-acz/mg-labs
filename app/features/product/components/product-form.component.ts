import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
            {{ isEditing() ? 'Edit Product' : 'Add New Product' }}
          </h1>
          <p class="text-slate-600 mt-1">
            {{ isEditing() ? 'Update product information' : 'Create a new product in your inventory' }}
          </p>
        </div>
        <button
          (click)="goBack()"
          class="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-all duration-300"
          title="Go Back"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-8 animate-pulse">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                <div class="h-10 bg-slate-200 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                <div class="h-10 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-slate-200 rounded w-1/4"></div>
              <div class="h-24 bg-slate-200 rounded"></div>
            </div>
            <div class="h-12 bg-slate-200 rounded"></div>
          </div>
        </div>
      } @else {
        <!-- Form -->
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-8 shadow-sm">
          <div class="space-y-6">
            <!-- Name and Category Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700 mb-2">
                  Product Name *
                </label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter product name"
                />
                @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Product name is required</p>
                }
              </div>

              <div>
                <label for="category" class="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  formControlName="category"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
                @if (productForm.get('category')?.invalid && productForm.get('category')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Category is required</p>
                }
              </div>
            </div>

            <!-- Price and Stock Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="price" class="block text-sm font-medium text-slate-700 mb-2">
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  formControlName="price"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="0.00"
                />
                @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Valid price is required</p>
                }
              </div>

              <div>
                <label for="stock" class="block text-sm font-medium text-slate-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  formControlName="stock"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="0"
                />
                @if (productForm.get('stock')?.invalid && productForm.get('stock')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Stock quantity is required</p>
                }
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Enter product description"
              ></textarea>
              @if (productForm.get('description')?.invalid && productForm.get('description')?.touched) {
                <p class="mt-1 text-sm text-red-600">Description is required</p>
              }
            </div>

            <!-- Image URL -->
            <div>
              <label for="imageUrl" class="block text-sm font-medium text-slate-700 mb-2">
                Image URL *
              </label>
              <input
                id="imageUrl"
                type="url"
                formControlName="imageUrl"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="https://example.com/image.jpg"
              />
              @if (productForm.get('imageUrl')?.invalid && productForm.get('imageUrl')?.touched) {
                <p class="mt-1 text-sm text-red-600">Valid image URL is required</p>
              }
            </div>

            <!-- Image Preview -->
            @if (productForm.get('imageUrl')?.value) {
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Image Preview</label>
                <div class="w-32 h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    [src]="productForm.get('imageUrl')?.value"
                    alt="Product preview"
                    class="w-full h-full object-cover"
                    (error)="onImageError()"
                  />
                </div>
              </div>
            }

            <!-- Error Message -->
            @if (error()) {
              <div class="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-lg p-4">
                <p class="text-red-700 text-sm">{{ error() }}</p>
              </div>
            }

            <!-- Actions -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/60">
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-300 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="productForm.invalid || isSubmitting()"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:cursor-not-allowed"
              >
                @if (isSubmitting()) {
                  <span class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isEditing() ? 'Updating...' : 'Creating...' }}
                  </span>
                } @else {
                  {{ isEditing() ? 'Update Product' : 'Create Product' }}
                }
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm!: FormGroup;
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeForm();
    this.checkIfEditing();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  private checkIfEditing(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          imageUrl: product.imageUrl
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product details');
        this.isLoading.set(false);
        console.error('Failed to load product:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting.set(true);
      this.error.set(null);

      const productData = this.productForm.value;

      const request = this.isEditing()
        ? this.productService.update(this.route.snapshot.paramMap.get('id')!, productData)
        : this.productService.create(productData);

      request.subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error.set('Failed to save product. Please try again.');
          this.isSubmitting.set(false);
          console.error('Failed to save product:', err);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  onImageError(): void {
    // Could show a placeholder image or error message
    console.warn('Failed to load image preview');
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
