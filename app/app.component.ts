import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, User } from './core/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [SidebarComponent, RouterModule]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MG Labs';

  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(false);
  showLayout = signal<boolean>(true);
  isSidebarCollapsed = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  private subscription = new Subscription();

  ngOnInit(): void {
    this.initializeAuthentication();
    this.monitorRouteChanges();
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
        const url = event.urlAfterRedirects;
        this.showLayout.set(!url.includes('/auth/'));
      });
    this.subscription.add(sub);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(value => !value);
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

