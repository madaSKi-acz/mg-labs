import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Partial<Product> = {
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: 0,
    stock: 0
  };
  isEditMode = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.isLoading = true;
      this.productService.getById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Unable to load product data.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  submit(): void {
    if (!this.product.name || !this.product.description) {
      this.error = 'Name and description are required.';
      return;
    }

    this.isLoading = true;
    const action$ = this.isEditMode && this.product.id
      ? this.productService.update(this.product.id, this.product)
      : this.productService.create(this.product);

    action$.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = 'Could not save product.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
