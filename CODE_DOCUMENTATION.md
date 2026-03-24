# MG Labs - Complete File Documentation

## Overview
This document provides a comprehensive breakdown of every file in the MG Labs project with OOP implementation details.

---

## 📁 Root Files

### `index.html`
**Purpose**: Application entry point  
**OOP Concepts**:
- Single responsibility: HTML structure only
- Separation of concerns: UI markup separated from logic

```html
<!doctype html>
<html lang="en">
  <head>
    <app-root></app-root>
  </head>
</html>
```

### `main.ts`
**Purpose**: Angular bootstrap file  
**OOP Concepts**:
- Entry point for entire application
- Decoupled from business logic

```typescript
platformBrowserDynamic()
  .bootstrapModule(AppModule)
```

---

## 📁 Environments

### `environment.ts`
**Purpose**: Development configuration  
**OOP Concepts**:
- Configuration object (immutable)
- Single source of truth for environment settings

### `environment.prod.ts`
**Purpose**: Production configuration  
**OOP Concepts**:
- Different implementations for different environments
- Polymorphism through configuration

---

## 📁 App Module (Core Application)

### `app.module.ts`
**Purpose**: Root module bootstrapper  
**OOP Concepts**:
- **Module Pattern**: Groups related functionality
- **Dependency Injection**: Registers providers
- **Separation of Concerns**: Each module has single purpose

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, SharedModule, FeatureModules],
  providers: [HTTP_INTERCEPTORS]
})
export class AppModule { }
```

**Key Principles**:
- ✅ Lazy loading of feature modules
- ✅ Core module imported only once
- ✅ HTTP interceptors registered globally

### `app-routing.module.ts`
**Purpose**: Root route configuration  
**OOP Concepts**:
- **Abstraction**: Routing logic abstracted from components
- **Guard Pattern**: Route protection via guards

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module')
      .then(m => m.AdminModule),
    canActivate: [AuthGuard]
  }
];
```

**Key Principles**:
- ✅ Lazy loading for performance
- ✅ Route guards for security
- ✅ Default redirects

### `app.component.ts`
**Purpose**: Root app component  
**OOP Concepts**:
- **Lifecycle Hooks**: Proper initialization and cleanup
- **Encapsulation**: Component state management
- **Dependency Injection**: Services injected

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  
  ngOnInit(): void {
    this.initializeAuthentication();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

**Key Principles**:
- ✅ Implements lifecycle hooks
- ✅ Proper subscription management
- ✅ Unsubscribes on destroy

### `api-response.model.ts`
**Purpose**: API response data models  
**OOP Concepts**:
- **Encapsulation**: Data wrapping in class
- **Factory Pattern**: Static methods for creation
- **Inheritance**: PaginatedResponse extends ApiResponse
- **Generics**: Type-safe responses

```typescript
export class ApiResponse<T> {
  constructor(
    status: number,
    message: string,
    data: T
  ) { }
  
  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(200, 'Success', data);
  }
  
  static error<T>(message: string): ApiResponse<T> {
    return new ApiResponse(500, message, null);
  }
  
  isSuccess(): boolean {
    return this.status >= 200 && this.status < 300;
  }
}
```

**Key Principles**:
- ✅ Type-safe generic class
- ✅ Factory methods for object creation
- ✅ Behavior methods (isSuccess, isError)
- ✅ Immutable payload

---

## 📁 Core Module

### `core.module.ts`
**Purpose**: Provides singleton services  
**OOP Concepts**:
- **Singleton Pattern**: Services provided at root
- **Module Pattern**: Groups core functionality
- **Dependency Injection**: Service provision

```typescript
@NgModule({
  providers: [AuthService, UserService, AuthGuard]
})
export class CoreModule { }
```

**Key Principles**:
- ✅ Imported only in AppModule
- ✅ All services are singletons
- ✅ No declarations (only services)

### `auth.service.ts`
**Purpose**: Authentication & Authorization  
**OOP Concepts**:
- **Encapsulation**: Private token storage
- **Single Responsibility**: Only handles auth
- **Singleton**: Provided at root level
- **Observable Pattern**: State as Observable
- **Dependency Injection**: HttpClient injected

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post(...).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }
  
  private handleAuthResponse(response: any): void {
    localStorage.setItem(this.TOKEN_KEY, response.data.accessToken);
    this.isAuthenticatedSubject.next(true);
  }
  
  isAuthenticatedState(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
```

**Key Classes**:
1. **AuthToken**: Encapsulates token data
   - `isExpired()`: Check token validity
   - `getExpirationTime()`: Get expiration milliseconds

2. **User**: User entity
   - `getFullName()`: Derive full name
   - `hasRole()`: Role checking

**Key Methods**:
- `login()`: Authenticate user
- `logout()`: Clear auth data
- `refreshToken()`: Refresh JWT token
- `hasRole()`: Check user authorization
- `getAccessToken()`: Get current token

### `user.service.ts`
**Purpose**: User data management  
**OOP Concepts**:
- **Single Responsibility**: Only user operations
- **Abstraction**: IUser interface
- **Encapsulation**: Cache management
- **CRUD Operations**: Full data management
- **Observable Pattern**: Reactive updates

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private usersCache$ = new BehaviorSubject<User[]>([]);
  
  getAll(params: UserQueryParams): Observable<any> {
    return this.http.get(this.apiUrl, { params }).pipe(
      tap(response => {
        const users = response.data.map(u => new User(u));
        this.usersCache$.next(users);
      })
    );
  }
}
```

**Key Principles**:
- ✅ HttpParams for query building
- ✅ Data transformation (to User objects)
- ✅ Cache management with BehaviorSubject
- ✅ Pagination support

### `gaurds/auth.guard.ts`
**Purpose**: Route protection  
**OOP Concepts**:
- **Implements Interface**: CanActivate, CanActivateChild
- **Guard Pattern**: Protects routes
- **Dependency Injection**: Services injected
- **Role-Based Access**: Authorization logic

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    const requiredRoles: UserRole[] = route.data['roles'];
    if (requiredRoles && !this.authService.hasAnyRole(requiredRoles)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
}
```

**Key Principles**:
- ✅ Prevents unauthorized access
- ✅ Role-based authorization
- ✅ Redirect on denial
- ✅ Query param preservation

### `interceptors/auth.interceptor.ts`
**Purpose**: Global HTTP request/response handling  
**OOP Concepts**:
- **Implements Interface**: HttpInterceptor
- **Interceptor Pattern**: Intercepts all HTTP requests
- **Token Refresh Logic**: Handles 401 errors
- **Error Handling**: Global error management

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    
    if (token) {
      request = this.addToken(request, token);
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }
  
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Refresh token and retry
    return this.authService.refreshToken().pipe(
      switchMap(token => next.handle(this.addToken(request, token)))
    );
  }
}
```

**Key Principles**:
- ✅ Adds auth token to all requests
- ✅ Refreshes expired tokens
- ✅ Prevents concurrent refresh requests
- ✅ Returns queued requests after refresh

---

## 📁 Features Module

### Admin Feature

#### `admin.module.ts`
**Purpose**: Admin feature module  
**OOP Concepts**:
- **Module Pattern**: Groups admin features
- **Lazy Loading**: Loaded on demand
- **Encapsulation**: Admin features isolated

```typescript
@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, AdAdminRoutingModule]
})
export class AdminModule { }
```

#### `services/admin.service.ts`
**Purpose**: Admin operations  
**OOP Concepts**:
- **Single Responsibility**: Admin operations only
- **Data Classes**: DashboardStats class
- **Methods**: Specialized admin functions

```typescript
@Injectable({ providedIn: 'root' })
export class AdminService {
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get(`${this.apiUrl}/dashboard`)
      .pipe(map(({ data }) => new DashboardStats(data)));
  }
}

export class DashboardStats {
  getFormattedRevenue(): string {
    return `$${(this.totalRevenue / 100).toFixed(2)}`;
  }
}
```

#### `components/admin-dashboard.component.ts`
**Purpose**: Admin dashboard view  
**OOP Concepts**:
- **Component Class**: Encapsulates UI logic
- **Lifecycle Hooks**: Init and Destroy
- **Error Handling**: User-friendly error messages
- **Data Display**: Formatted stats display

```typescript
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardStats: DashboardStats | null = null;
  isLoading = false;
  error: string | null = null;
  
  ngOnInit(): void {
    this.loadDashboardStats();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
```

### Product Feature

#### `services/product.service.ts`
**Purpose**: Product data management  
**OOP Concepts**:
- **Model Class**: Product with behavior
- **Abstraction**: IProduct interface
- **Search Functionality**: Type-safe search
- **Stock Management**: Business logic methods

```typescript
export class Product implements IProduct {
  getFormattedPrice(): string {
    return `$${(this.price / 100).toFixed(2)}`;
  }
  
  isInStock(): boolean {
    return this.stock > 0;
  }
  
  isLowStock(): boolean {
    return this.stock > 0 && this.stock < 10;
  }
}
```

#### `components/product-list.component.ts`
**Purpose**: Product listing
**OOP Concepts**:
- **Data Flow**: Props and events
- **Filtering**: Category-based filtering
- **Pagination**: Page navigation
- **Loading States**: User feedback

#### `components/product-details.component.ts`
**Purpose**: Product detail view  
**OOP Concepts**:
- **Route Params**: Extract from URL
- **Data Loading**: Lazy load product details
- **UI Binding**: Template data binding

### User Feature

#### `services/user.service.ts`
**Purpose**: User profile management  
**OOP Concepts**:
- **Profile Operations**: Get/Update profile
- **Preferences**: User settings management
- **File Upload**: Profile picture upload

```typescript
@Injectable({ providedIn: 'root' })
export class UserProfileService {
  getProfile(): Observable<User> { }
  updateProfile(profileData: any): Observable<User> { }
  uploadProfilePicture(file: File): Observable<any> { }
  getPreferences(): Observable<any> { }
}
```

#### `components/user-profile.component.ts`
**Purpose**: User profile view  
**OOP Concepts**:
- **Edit Mode**: Toggle between view/edit
- **Form Handling**: Two-way binding
- **State Management**: Edit state

#### `components/user-settings.component.ts`
**Purpose**: User settings management  
**OOP Concepts**:
- **Preference Storage**: Save user preferences
- **Toggle States**: Checkbox bindings
- **Async Operations**: Save with feedback

### State Management

#### `actions/auth.actions.ts`
**Purpose**: Auth state actions  
**OOP Concepts**:
- **Action Classes**: Typed action objects
- **Redux Pattern**: Action-based state changes

```typescript
export class LoginSuccess extends Action {
  constructor(payload: any) {
    super('[Auth] Login Success', payload);
  }
}

export const authReducer =
 (state: AuthState = initialAuthState, action: Action): AuthState => {
  switch (action.type) {
    case '[Auth] Login Success':
      return { ...state, isAuthenticated: true };
    default:
      return state;
  }
};
```

#### `actions/user.actions.ts`
**Purpose**: User state actions  
**OOP Concepts**:
- **Action Types**: Typed constants
- **Reducer Functions**: Pure state transitions
- **Initial State**: Default state definition

---

## 📁 Shared Module

### Components

#### `navbar/navbar.component.ts`
**Purpose**: Top navigation bar  
**OOP Concepts**:
- **Current User Display**: Observable subscription
- **Menu Toggle**: Mobile responsiveness
- **Navigation**: Route navigation
- **Logout**: Auth cleanup

```typescript
@Component({ selector: 'app-navbar' })
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  
  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => { this.currentUser = user; });
  }
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }
}
```

**Key Principles**:
- ✅ Async user subscription
- ✅ Mobile menu support
- ✅ Proper cleanup (takeUntil)
- ✅ Navigation support

#### `sidebar/sidebar.component.ts`
**Purpose**: Side navigation menu  
**OOP Concepts**:
- **Menu Items**: Data-driven menu
- **Icon Display**: Semantic icons
- **Navigation**: Route linking

```typescript
@Component({ selector: 'app-sidebar' })
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: '📊', link: '/dashboard' },
    { label: 'Products', icon: '🛍️', link: '/products' }
  ];
}
```

### Directives

#### `debounce.directive.ts`
**Purpose**: Debounce input events  
**OOP Concepts**:
- **Custom Directive**: Reusable behavior
- **Event Handling**: HostListener
- **Timeout Management**: Cleanup

```typescript
@Directive({ selector: '[appDebounce]' })
export class DebounceDirective {
  @Input() appDebounce = 300;
  @Input() debounceAction = (): void => { };
  
  @HostListener('input')
  onInput(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.debounceAction();
    }, this.appDebounce);
  }
}
```

**Usage**:
```html
<input [appDebounce]="300" (debounceAction)="search()">
```

### Pipes

#### `custom.pipes.ts`
**Purpose**: Custom data transformation  
**OOP Concepts**:
- **Pipe Pattern**: Transform data in templates
- **Reusability**: Used across components
- **Type Safety**: Generic transformations

```typescript
@Pipe({ name: 'currency' })
export class CurrencyFormatterPipe implements PipeTransform {
  transform(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value / 100);
  }
}

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
```

**Usage**:
```html
{{ product.price | currency: 'USD' }}
{{ product.description | truncate: 50 }}
```

### `shared.module.ts`
**Purpose**: Export shared components  
**OOP Concepts**:
- **Module Pattern**: Groups shared items
- **Re-exportable**: Other modules can import

```typescript
@NgModule({
  declarations: [NavbarComponent, SidebarComponent, ...Directives, ...Pipes],
  exports: [NavbarComponent, SidebarComponent, ...Directives, ...Pipes]
})
export class SharedModule { }
```

---

## 📁 Configuration Files

### `package.json`
**Purpose**: Dependencies and scripts  
**Key Dependencies**:
- `@angular/core`: Angular framework
- `@angular/router`: Routing module
- `rxjs`: Reactive programming
- `typescript`: Language transpiler

### `tsconfig.json`
**Purpose**: TypeScript configuration  
**Key Settings**:
- `strict: true`: Strict type checking
- `noImplicitAny: true`: Method parameter typing
- `strictNullChecks: true`: Null safety
- Path aliases for imports

### `tsconfig.app.json`
**Purpose**: App-specific TypeScript config  
**Purpose**: Extends base tsconfig for app compilation

---

##OOP Summary Table

| Concept | File | Implementation |
|---------|------|-----------------|
| **Encapsulation** | auth.service.ts | Private token storage |
| **Abstraction** | IUser, IProduct interfaces | Interface contracts |
| **Inheritance** | PaginatedResponse extends ApiResponse | Code reuse |
| **Polymorphism** | Multiple action types | Different state transitions |
| **Single Responsibility** | Each service has one job | Clean separation |
| **Dependency Injection** | @Injectable() | Angular DI container |
| **Factory Pattern** | ApiResponse.success() | Object creation |
| **Singleton** | providedIn: 'root' | One instance app-wide |
| **Observable Pattern** | BehaviorSubject | Reactive state |
| **Guard Pattern** | CanActivate interface | Route protection |
| **Interceptor Pattern** | HttpInterceptor | Global HTTP handling |

---

## Best Practices Implemented

✅ **Type Safety**: Full TypeScript strict mode  
✅ **Memory Management**: Proper subscription cleanup  
✅ **Error Handling**: Global interceptor + local error handling  
✅ **Security**: Guards, interceptors, secure token storage  
✅ **Performance**: Lazy loading, change detection optimization  
✅ **Maintainability**: Clear class structures, documentation  
✅ **Scalability**: Modular feature-based architecture  
✅ **Testing**: Service-oriented design for easy testing

---

## Conclusion

This codebase demonstrates professional OOP implementation in Angular with:
- Clear separation of concerns
- Proper abstraction and encapsulation
- Enterprise-level architecture
- Production-ready code patterns

