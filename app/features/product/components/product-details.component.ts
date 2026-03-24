import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../services/product.service';

/**
 * Product Details Component
 * Displays detailed information about a product
 */
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = false;
  error: string | null = null;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  /**
   * Load product details
   */
  private loadProduct(): void {
    this.isLoading = true;
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) return;

    const sub = this.productService.getById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product';
        this.isLoading = false;
        console.error(err);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
