import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from './auth.service';
import { Product, IProduct } from '../features/product/services/product.service';
import { DashboardStats, IDashboardStats } from '../features/admin/services/admin.service';

interface MockUser extends Omit<User, 'getFullName' | 'hasRole'> {
  password: string;
}

const MOCK_USERS: MockUser[] = [
  { id: 'u1', email: 'admin@mg.com', firstName: 'Admin', lastName: 'User', role: 'admin', password: 'admin123' },
  { id: 'u2', email: 'jane@mg.com', firstName: 'Jane', lastName: 'Doe', role: 'user', password: 'user123' },
  { id: 'u3', email: 'john@mg.com', firstName: 'John', lastName: 'Smith', role: 'user', password: 'user123' }
];

const MOCK_PRODUCTS: IProduct[] = [
  {
    id: 'p1',
    name: 'Smart Productivity Notebook',
    description: 'AI-driven notebook for modern planning and collaboration.',
    price: 2999,
    stock: 75,
    category: 'Productivity',
    imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=500&q=80',
    createdAt: new Date()
  },
  {
    id: 'p2',
    name: 'Wireless Ergonomic Keyboard',
    description: 'Comfort-first wireless keyboard with programmable hotkeys.',
    price: 7999,
    stock: 22,
    category: 'Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de6f9de?auto=format&fit=crop&w=500&q=80',
    createdAt: new Date()
  },
  {
    id: 'p3',
    name: 'Enterprise Analytics Suite',
    description: 'Data platform for visual reports and KPI tracking.',
    price: 14999,
    stock: 5,
    category: 'Software',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-61f936097b7f?auto=format&fit=crop&w=500&q=80',
    createdAt: new Date()
  }
];

const MOCK_DASHBOARD_STATS: IDashboardStats = {
  totalUsers: 250,
  totalProducts: 78,
  totalOrders: 920,
  totalRevenue: 1845000
};

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  constructor() { }

  login(email: string, password: string): Observable<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) {
      return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
    }

    const user = new User(found);
    const tokens = { accessToken: btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })), refreshToken: 'mock-refresh-token' };
    return of({ user, tokens }).pipe(delay(500));
  }

  register(data: Partial<MockUser>): Observable<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const newUser: MockUser = {
      id: `u${MOCK_USERS.length + 1}`,
      email: data.email || 'newuser@mg.com',
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'User',
      role: 'user',
      password: data.password || 'password1'
    };
    MOCK_USERS.push(newUser);
    const user = new User(newUser);
    const tokens = { accessToken: btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })), refreshToken: 'mock-refresh-token' };
    return of({ user, tokens }).pipe(delay(500));
  }

  getCurrentUser(): Observable<User> {
    const mock = MOCK_USERS[1];
    return of(new User(mock)).pipe(delay(300));
  }

  getProducts(page: number, limit: number, category?: string): Observable<Product[]> {
    const filtered = category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit).map(item => new Product(item));
    return of(paged).pipe(delay(300));
  }

  getProductById(id: string): Observable<Product> {
    const found = MOCK_PRODUCTS.find(item => item.id === id);
    if (!found) {
      return throwError(() => new Error('Product not found')).pipe(delay(200));
    }
    return of(new Product(found)).pipe(delay(200));
  }

  createProduct(productData: Partial<IProduct>): Observable<Product> {
    const newProductData: IProduct = {
      id: `p${MOCK_PRODUCTS.length + 1}`,
      name: productData.name || 'New Product',
      description: productData.description || 'Description pending',
      price: productData.price || 1000,
      stock: productData.stock || 1,
      category: productData.category || 'General',
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1581093588401-61f936097b7f?auto=format&fit=crop&w=500&q=80',
      createdAt: productData.createdAt || new Date()
    };
    MOCK_PRODUCTS.push(newProductData);
    return of(new Product(newProductData)).pipe(delay(300));
  }

  updateProduct(id: string, productData: Partial<IProduct>): Observable<Product> {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index < 0) {
      return throwError(() => new Error('Product not found')).pipe(delay(200));
    }
    MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
    return of(new Product(MOCK_PRODUCTS[index])).pipe(delay(300));
  }

  deleteProduct(id: string): Observable<void> {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index < 0) {
      return throwError(() => new Error('Product not found')).pipe(delay(200));
    }
    MOCK_PRODUCTS.splice(index, 1);
    return of(undefined).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    const matched = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    return of(matched.map(p => new Product(p))).pipe(delay(250));
  }

  getDashboardStats(): Observable<DashboardStats> {
    return of(new DashboardStats(MOCK_DASHBOARD_STATS)).pipe(delay(300));
  }

  getUserProfile(userId?: string): Observable<User> {
    const user = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[1];
    return of(new User(user)).pipe(delay(250));
  }

  updateUserProfile(profileData: Partial<MockUser>): Observable<User> {
    const user = MOCK_USERS[1];
    Object.assign(user, profileData);
    return of(new User(user)).pipe(delay(250));
  }
}
