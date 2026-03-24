import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * Product Model
 * Represents a product entity
 */
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
}

export class Product implements IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;

  constructor(data: IProduct) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.category = data.category;
    this.imageUrl = data.imageUrl;
    this.createdAt = new Date(data.createdAt);
  }

  /**
   * Get formatted price
   */
  getFormattedPrice(): string {
    return `$${(this.price / 100).toFixed(2)}`;
  }

  /**
   * Check if product is in stock
   */
  isInStock(): boolean {
    return this.stock > 0;
  }

  /**
   * Check if product is low stock
   */
  isLowStock(): boolean {
    return this.stock > 0 && this.stock < 10;
  }
}

/**
 * Product Service
 * Handles product operations
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = '/api/products';
  private readonly productsCache$ = new BehaviorSubject<Product[]>([]);

  constructor(private readonly http: HttpClient) { }

  /**
   * Get all products
   */
  getAll(page: number = 1, limit: number = 10, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(response => {
        const products = response.data.map((p: IProduct) => new Product(p));
        this.productsCache$.next(products);
      })
    );
  }

  /**
   * Get product by ID
   */
  getById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(({ data }) => new Product(data))
    );
  }

  /**
   * Create new product
   */
  create(productData: Partial<IProduct>): Observable<Product> {
    return this.http.post<any>(this.apiUrl, productData).pipe(
      map(({ data }) => new Product(data))
    );
  }

  /**
   * Update product
   */
  update(id: string, productData: Partial<IProduct>): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData).pipe(
      map(({ data }) => new Product(data))
    );
  }

  /**
   * Delete product
   */
  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }

  /**
   * Search products
   */
  search(query: string): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(({ data }) => data.map((p: IProduct) => new Product(p)))
    );
  }

  /**
   * Get cached products
   */
  getCachedProducts(): Observable<Product[]> {
    return this.productsCache$.asObservable();
  }
}
