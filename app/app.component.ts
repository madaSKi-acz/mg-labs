import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/auth.service';
import { LayoutService } from './core/layout.service';

/**
 * Root Application Component
 * Handles global application layout and user authentication state
 * Implements lifecycle hooks for proper resource management
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MG Labs';
  isAuthenticated = false;
  showLayout = true; // Show navbar/sidebar
  menuOrientation: 'vertical' | 'horizontal' = 'vertical';
  private readonly subscription: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly layoutService: LayoutService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.initializeAuthentication();
    this.monitorRouteChanges();
    const layoutSub = this.layoutService.orientation$.subscribe(value => {
      this.menuOrientation = value;
    });
    this.subscription.add(layoutSub);
  }

  /**
   * Initialize authentication state
   */
  private initializeAuthentication(): void {
    const sub = this.authService.isAuthenticatedState().subscribe(state => {
      this.isAuthenticated = state;
    });
    this.subscription.add(sub);
  }

  /**
   * Monitor route changes to control layout visibility
   */
  private monitorRouteChanges(): void {
    const sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide layout on login/register routes
        this.showLayout = !['login', 'register', 'forgot-password'].includes(
          event.urlAfterRedirects?.split('/')[1]
        );
      });
    this.subscription.add(sub);
  }

  /**
   * Cleanup subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

