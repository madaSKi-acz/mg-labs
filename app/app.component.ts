import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, User } from './core/auth.service';
import { LayoutService } from './core/layout.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [SidebarComponent, RouterOutlet]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MG Labs';

  private authService = inject(AuthService);
  private router = inject(Router);
  private layoutService = inject(LayoutService);

  isAuthenticated = signal<boolean>(false);
  showLayout = signal<boolean>(true);
  menuOrientation = signal<'vertical' | 'horizontal'>('vertical');
  currentUser = signal<User | null>(null);

  private subscription = new Subscription();

  ngOnInit(): void {
    this.initializeAuthentication();
    this.monitorRouteChanges();

    const layoutSub = this.layoutService.orientation$.subscribe(value => {
      this.menuOrientation.set(value);
    });
    this.subscription.add(layoutSub);
  }

  private initializeAuthentication(): void {
    const sub = this.authService.isAuthenticatedState().subscribe(state => {
      this.isAuthenticated.set(state);
      if (state) {
        this.currentUser.set(this.authService.getCurrentUser());
      } else {
        this.currentUser.set(null);
      }
    });
    this.subscription.add(sub);
  }

  private monitorRouteChanges(): void {
    const sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide layout on auth routes
        const url = event.urlAfterRedirects;
        this.showLayout.set(!url.includes('/auth/'));
      });
    this.subscription.add(sub);
  }

  toggleOrientation(): void {
    const newOrientation = this.menuOrientation() === 'vertical' ? 'horizontal' : 'vertical';
    this.menuOrientation.set(newOrientation);
    this.layoutService.setOrientation(newOrientation);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

