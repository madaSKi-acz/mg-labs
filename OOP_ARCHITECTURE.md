# MG Labs - Enterprise Angular Application

## Overview
This project is a comprehensive Angular application built with **Object-Oriented Programming (OOP)** principles and best practices. The application demonstratesadvanced Angular patterns, modular architecture, and proper separation of concerns.

---

## OOP Principles Implemented

### 1. **Encapsulation**
- **Data Hiding**: Private members in services and classes restrict direct access
- **Controlled Access**: Public methods provide controlled interface to internal state
- **Example**: 
  ```typescript
  class User {
    private _email: string;  // Private member
    
    getEmail(): string {     // Public getter
      return this._email;
    }
  }
  ```

### 2. **Abstraction**
- **Interfaces**: Define contracts for classes
- **Abstract Classes**: Define template methods for inheritance
- **Example**:
  ```typescript
  interface IApiResponse<T> {
    status: number;
    message: string;
    data: T;
  }
  
  class ApiResponse<T> implements IApiResponse<T> {
    // Implementation
  }
  ```

### 3. **Inheritance**
- **Code Reuse**: Child classes inherit from parent classes
- **Method Overriding**: Specialized behavior in subclasses
- **Example**:
  ```typescript
  class ApiResponse<T> { }
  class PaginatedResponse<T> extends ApiResponse<T[]> { }
  ```

### 4. **Polymorphism**
- **Method Overloading**: Multiple service methods for different scenarios
- **Interface Implementation**: Multiple classes implementing same interface
- **Example**:
  ```typescript
  // Different implementations of authentication
  login(credentials: LoginCredentials): Observable<User>
  register(userData: any): Observable<User>
  ```

### 5. **Dependency Injection**
- **Service Injection**: Services injected into components
- **Factory Pattern**: Angular provides singleton instances
- **Example**:
  ```typescript
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }
  ```

### 6. **Single Responsibility Principle (SRP)**
- **AuthService**: Handles authentication only
- **UserService**: Handles user data operations
- **ProductService**: Handles product operations
- **AdminService**: Handles admin-specific operations

### 7. **Open/Closed Principle**
- **Open for Extensions**: Guards can be extended
- **Closed for Modification**: Core services remain unchanged
- **Theme**: Use inheritance and interfaces

---

## Project Structure

```
app/
├── core/                    # Core services (singleton)
│   ├── auth.service.ts     # Authentication & Authorization
│   ├── user.service.ts     # User data management
│   ├── gaurds/
│   │   └── auth.guard.ts   # Route protection
│   ├── interceptors/
│   │   └── auth.interceptor.ts  # HTTP token injection
│   └── core.module.ts
│
├── features/               # Feature modules (lazy-loaded)
│   ├── admin/             # Admin module
│   │   ├── services/
│   │   │   └── admin.service.ts
│   │   ├── components/
│   │   │   └── admin-dashboard.component.ts
│   │   └── admin.module.ts
│   │
│   ├── product/           # Product module
│   │   ├── services/
│   │   │   └── product.service.ts
│   │   ├── components/
│   │   │   ├── product-list.component.ts
│   │   │   └── product-details.component.ts
│   │   └── products.module.ts
│   │
│   ├── user/              # User module
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── components/
│   │   │   ├── user-profile.component.ts
│   │   │   └── user-settings.component.ts
│   │   └── user.module.ts
│   │
│   └── state/             # Redux-style state management
│       ├── actions/
│       │   ├── auth.actions.ts
│       │   └── user.actions.ts
│       └── reducers/
│           ├── auth.reducer.ts
│           └── user.reducer.ts
│
├── shared/                # Shared components & utilities
│   ├── components/
│   │   ├── navbar/       # Top navigation component
│   │   └── sidebar/      # Side navigation component
│   ├── directives/
│   │   └── debounce.directive.ts
│   ├── pipes/
│   │   └── custom.pipes.ts
│   └── shared.module.ts
│
├── app.module.ts          # Root module
├── app-routing.module.ts  # Root routing
└── app.component.ts       # Root component
```

---

## Design Patterns Used

### 1. **Singleton Pattern**
- **Services**: Provided at root via `providedIn: 'root'`
- **Guarantees**: Only one instance throughout the application
- **Example**: AuthService, UserService

### 2. **Factory Pattern**
- **ApiResponse.success()**: Creates success responses
- **ApiResponse.error()**: Creates error responses
- **Example**:
  ```typescript
  ApiResponse.success(data, 'Success', 200)
  ApiResponse.error('Error message', 500)
  ```

### 3. **Model-View-Component (MVC)**
- **Model**: User, Product, DashboardStats classes
- **View**: Component templates
- **Component**: Business logic and data binding

### 4. **Observable Pattern**
- **RxJS Observables**: For asynchronous operations
- **Subject**: For managing state
- **BehaviorSubject**: For current value access
- **Example**:
  ```typescript
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  ```

### 5. **Guard Pattern**
- **Route Protection**: AuthGuard controls access
- **Role-based Access**: Check roles before activation
- **Example**:
  ```typescript
  canActivate(route, state): Observable<boolean> | boolean
  ```

### 6. **Interceptor Pattern**
- **Global HTTP Handling**: Token injection
- **Error Handling**: Centralized error handling
- **Token Refresh**: Automatic token refresh on 401

### 7. **Module Pattern**
- **Feature Modules**: Self-contained features
- **Lazy Loading**: Modules loaded on demand
- **Shared Module**: Reusable components

---

## Key Features

### Authentication System
```typescript
// Login flow
authService.login(credentials)
  .subscribe(user => {
    // User authenticated
    router.navigate(['dashboard'])
  })

// Automatic token refresh
authInterceptor handles 401 errors and refreshes tokens
```

### State Management
```typescript
// Redux-style actions and reducers
authReducer(state, action) => newState
userReducer(state, action) => newState
```

### Component Communication
```typescript
// Using observables
@Component()
class MyComponent {
  user$ = this.authService.currentUser$
  
  // In template
  {{ user$ | async | name }}
}
```

### Error Handling
```typescript
// Global error handling via interceptor
httpClient.get(url)
  .subscribe({
    next: (data) => {}, 
    error: (err) => {
      // Global error handling
    }
  })
```

---

## Best Practices Used

### 1. **Type Safety**
- - Interfaces for data structures
- Generic types for reusable components
- Strict null checking

### 2. **Memory Management**
- Unsubscribe from observables in ngOnDestroy
- Use async pipe to avoid manual subscriptions
- Use takeUntil operator for automatic cleanup

### 3. **Performance**
- Lazy loading of feature modules
- OnPush change detection strategy
- Trackby functions for *ngFor

### 4. **Security**
- HTTP interceptor adds auth tokens
- Guards prevent unauthorized access
- CSRF protection via Angular

### 5. **Separation of Concerns**
- Business logic in services
- UI logic in components
- Data models as classes

### 6. **Reusability**
- Shared module for common components
- Custom pipes and directives
- Utility services

---

## Usage Examples

### Authentication Guard
```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  }
]
```

### HTTP Interceptor
```typescript
// Automatically injects token
HTTP_INTERCEPTOR provider with AuthInterceptor
Handles 401 errors with token refresh
```

### Custom Directives
```html
<input [appDebounce]="300" (appDebounceAction)="search()">
```

### Custom Pipes
```html
{{ product.price | currency: 'USD' }}
{{ text | truncate: 50 }}
```

---

## Services Overview

### AuthService
- Login/Register/Logout
- Token management
- Authentication state
- Role-based checks

### UserService
- User CRUD operations
- User caching
- Profile management
- Password updates

### ProductService
- Product listing
- Search functionality
- Product details
- Stock management

### AdminService
- Dashboard statistics
- System analytics
- Logs management
- Cache control

---

## Running the Application

```bash
# Install dependencies
npm install

# Development server
ng serve

# Production build
ng build --configuration production

# Run tests
ng test

# Run linting
ng lint
```

---

## File Breakdown with OOP Concepts

## Core Module

### auth.service.ts
- **Encapsulation**: Private token storage
- **Singleton**: Single instance manages all auth
- **Observable Pattern**: BehaviorSubject for state
- **OOP Methods**: login(), logout(), refreshToken()

### user.service.ts
- **Encapsulation**: Cache management
- **Abstraction**: IUser interface
- **CRUD Operations**: Create, Read, Update, Delete
- **Generics**: Observable<User[]>

## Feature Modules

### admin/admin.service.ts
- Polymorphism: Different analytics methods
- Factory pattern: DashboardStats creation
- Business logic encapsulation

### product/product.service.ts
- Type-safe Product class
- Cache management with BehaviorSubject
- Search and filtering logic

### user/user.service.ts
- Profile management
- Preferences handling
- File upload operations

## Shared Module

### Directives
- **debounce.directive.ts**: Reusable debouncing logic
- Implements HostListener for input events
- Encapsulates timeout logic

### Pipes
- **custom.pipes.ts**: Reusable formatting pipes
- SafeHtmlPipe: HTML escaping
- CurrencyFormatterPipe: Currency formatting
- TruncatePipe: Text truncation

### Components
- **navbar.component.ts**: Navigation logic
- **sidebar.component.ts**: Menu management

---

## Conclusion

This Angular application demonstrates professional OOP practices and architectural patterns suitable for enterprise applications. The modular structure, proper encapsulation, and clear separation of concerns make it maintainable, testable, and scalable.

