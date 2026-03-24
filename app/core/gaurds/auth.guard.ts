import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../auth.service';

/**
 * Authentication Guard
 * Protects routes by checking authentication status
 * Implements CanActivate and CanActivateChild interfaces
 * Uses OOP principles for extensibility
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  /**
   * Check if route can be activated
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuth(route, state);
  }

  /**
   * Check if child routes can be activated
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuth(childRoute, state);
  }

  /**
   * Check authentication and authorization
   */
  private checkAuth(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        // Check if specific roles are required
        const requiredRoles: string[] = route.data['roles'];
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = this.authService.hasAnyRole(requiredRoles as any[]);
          if (!hasRole) {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }

        return true;
      })
    );
  }
}