import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from '../../../core/auth.service';
import { LayoutService } from '../../../core/layout.service';

/**
 * Navbar Component
 * Displays navigation and user information
 * Implements proper lifecycle management
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

  currentUser: User | null = null;
  isMenuOpen = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }

  /**
   * Toggle menu orientation (vertical/horizontal)
   */
  toggleOrientation(): void {
    this.layoutService.toggleOrientation();
  }

  /**
   * Navigate to route
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.isMenuOpen = false;
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}