import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly CART_KEY = 'mg_cart';
  private readonly USER_PREFERENCES_KEY = 'mg_user_preferences';

  // Cart operations
  getCart(): any[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart: any[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  // Menu orientation operations
  getMenuOrientation(): 'vertical' | 'horizontal' {
    const raw = localStorage.getItem('mg_menu_orientation');
    if (raw === 'horizontal' || raw === 'vertical') {
      return raw;
    }
    return 'vertical';
  }

  setMenuOrientation(mode: 'vertical' | 'horizontal'): void {
    localStorage.setItem('mg_menu_orientation', mode);
  }

  addToCart(product: any): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    this.saveCart(cart);
  }

  removeFromCart(productId: number): void {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  // User preferences operations
  getUserPreferences(): any {
    const prefs = localStorage.getItem(this.USER_PREFERENCES_KEY);
    return prefs ? JSON.parse(prefs) : {
      theme: 'light',
      notifications: true,
      language: 'en'
    };
  }

  saveUserPreferences(preferences: any): void {
    localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(preferences));
  }

  updateUserPreference(key: string, value: any): void {
    const prefs = this.getUserPreferences();
    prefs[key] = value;
    this.saveUserPreferences(prefs);
  }
}