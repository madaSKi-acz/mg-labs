import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type MenuOrientation = 'vertical' | 'horizontal';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly ORIENTATION_KEY = 'mg_menu_orientation';
  private readonly orientationSubject = new BehaviorSubject<MenuOrientation>(this.getStoredOrientation());

  orientation$ = this.orientationSubject.asObservable();

  private getStoredOrientation(): MenuOrientation {
    const stored = localStorage.getItem(this.ORIENTATION_KEY) as MenuOrientation | null;
    if (stored === 'horizontal' || stored === 'vertical') {
      return stored;
    }
    return 'vertical';
  }

  setOrientation(value: MenuOrientation): void {
    localStorage.setItem(this.ORIENTATION_KEY, value);
    this.orientationSubject.next(value);
  }

  toggleOrientation(): void {
    this.setOrientation(this.orientationSubject.getValue() === 'vertical' ? 'horizontal' : 'vertical');
  }
}
