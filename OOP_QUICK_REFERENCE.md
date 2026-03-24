# OOP Concepts Quick Reference

## 1. ENCAPSULATION (Data Hiding)

**Definition**: Bundle data and methods, hide internal details  
**Benefit**: Control access, maintain data integrity

### Example in Project
```typescript
// ❌ Without Encapsulation
export class AuthService {
  token: string;  // Anyone can access/modify
}

// ✅ With Encapsulation
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';  // Private
  
  private getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY) || '';
  }
  
  public isAuthenticated(): boolean {  // Public interface
    return this.getToken() !== '';
  }
}
```

### Files Using Encapsulation
- `auth.service.ts`: Private token storage
- `product.service.ts`: Private cache management
- `user.service.ts`: Private data transformation

---

## 2. ABSTRACTION (Interface Contracts)

**Definition**: Hide complexity, show only necessary details  
**Benefit**: Loose coupling, easier testing

### Example in Project
```typescript
// ✅ Abstract Interface
export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// ✅ Implementation
export class ApiResponse<T> implements IApiResponse<T> {
  // Implementation details hidden
}

// ✅ Usage (don't care how it works)
const response: IApiResponse<User> = await apiCall();
```

### Files Using Abstraction
- `api-response.model.ts`: IApiResponse, IPaginatedResponse
- `auth.service.ts`: IAuthService pattern
- `product.service.ts`: IProduct interface

---

## 3. INHERITANCE (Code Reuse)

**Definition**: Child class inherits from parent class  
**Benefit**: Code reuse, consistent behavior

### Example in Project
```typescript
// ✅ Parent Class
export class ApiResponse<T> {
  constructor(
    public status: number,
    public message: string,
    public data: T
  ) { }
  
  isSuccess(): boolean {
    return this.status >= 200 && this.status < 300;
  }
}

// ✅ Child Class (Extends & Reuses)
export class PaginatedResponse<T> extends ApiResponse<T[]> {
  constructor(
    data: T[],
    message: string,
    public pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    statusCode: number = 200
  ) {
    super(statusCode, message, data);  // Call parent constructor
  }
  
  // New methods
  hasNextPage(): boolean {
    return this.pagination.page < this.pagination.totalPages;
  }
}
```

### Inheritance in Project
- `PaginatedResponse extends ApiResponse`
- `Product` extends `IProduct` interface implementation
- Service inheritance patterns (query building)

---

## 4. POLYMORPHISM (Multiple Forms)

**Definition**: Same interface, different implementations  
**Benefit**: Flexibility, extensibility

### Example 1: Method Overloading (Same method, different params)
```typescript
// ✅ Polymorphic Methods
export class AuthService {
  // Login with email/password
  login(credentials: LoginCredentials): Observable<User> { }
  
  // Register new user
  register(userData: any): Observable<User> { }
  
  // Login with OAuth
  loginWithProvider(provider: 'google' | 'github'): Observable<User> { }
}
```

### Example 2: Interface Implementation (Multiple classes, one interface)
```typescript
// ✅ Common Interface
export interface IGuard {
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean;
}

// ✅ Different Implementations
export class AuthGuard implements CanActivate { }
export class RoleGuard implements CanActivate { }
export class PermissionGuard implements CanActivate { }
```

### Example 3: Generic Polymorphism
```typescript
// ✅ Single class, works with any type
export class ApiResponse<T> {
  constructor(public data: T) { }
}

// ✅ Used with different types
const userResponse = new ApiResponse<User>(userData);
const productResponse = new ApiResponse<Product>(productData);
const listResponse = new ApiResponse<User[]>(users);
```

### Polymorphism in Project
- Multiple action types (AuthAction, UserAction)
- Multiple reducer functions
- Generic services working with different models

---

## 5. DEPENDENCY INJECTION (Loose Coupling)

**Definition**: Pass dependencies to objects, don't create them  
**Benefit**: Testable, flexible, reusable

### Example in Project
```typescript
// ❌ Tight Coupling (Bad)
export class ProductComponent {
  private productService = new ProductService();  // Creates dependency
  
  loadProducts() {
    this.productService.getAll();
  }
}

// ✅ Loose Coupling with DI (Good)
export class ProductComponent {
  constructor(private productService: ProductService) { }  // Injected
  
  loadProducts() {
    this.productService.getAll();
  }
}

// Service Registration
providers: [ProductService]  // Angular creates singleton
```

### DI Benefits in Project
- Easy to mock for testing
- Can switch implementations easily
- Service reuse across components
- Single instance management (Singleton)

### Files Using DI
- `app.module.ts`: Registers core services
- All components: Constructor injection
- `core.module.ts`: Service provision

---

## 6. SINGLE RESPONSIBILITY PRINCIPLE

**Definition**: Class should have only one reason to change  
**Benefit**: Maintainability, clarity, testability

### Example in Project
```typescript
// ❌ Multiple Responsibilities (Bad)
export class UserComponent {
  // Auth responsibility
  login() { }
  logout() { }
  
  // User responsibility
  getProfile() { }
  updateProfile() { }
  
  // UI responsibility
  updateUI() { }
}

// ✅ Single Responsibility (Good)
// Auth Component
export class AuthComponent {
  constructor(private authService: AuthService) { }
  login() { }
  logout() { }
}

// User Service
export class UserService {
  getProfile() { }
  updateProfile() { }
}

// Keep concerns separate
```

### Single Responsibility in Project
- `AuthService`: Only authentication
- `UserService`: Only user data
- `ProductService`: Only product data
- `AdminService`: Only admin operations
- `auth.guard.ts`: Only route protection
- `auth.interceptor.ts`: Only HTTP handling

---

## 7. OPEN/CLOSED PRINCIPLE

**Definition**: Open for extension, closed for modification  
**Benefit**: Easy to extend without breaking code

### Example in Project
```typescript
// ✅ Guard Pattern - Easy to extend
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Base authentication
  }
}

// ✅ Extend without modifying
export class AdminGuard extends AuthGuard {
  override canActivate(route: ActivatedRouteSnapshot): boolean {
    const baseCheck = super.canActivate(route);
    // Additional admin checks
    return baseCheck && this.isAdmin();
  }
}
```

### Open/Closed in Project
- Guards can be extended
- Services can be inherited
- Pipes can be created for new transformations
- Directives can be added without modifying existing ones

---

## 8. LISKOV SUBSTITUTION PRINCIPLE

**Definition**: Derived class can substitute base class  
**Benefit**: Correct inheritance hierarchy

### Example in Project
```typescript
// ✅ Correct Substitution
export class ApiResponse<T> {
  isSuccess(): boolean { }
}

export class PaginatedResponse<T> extends ApiResponse<T[]> {
  // Can be used anywhere ApiResponse<T[]> is expected
  // Additional method doesn't break the contract
  hasNextPage(): boolean { }
}

// Usage
function handle(response: ApiResponse<User[]>) {
  if (response.isSuccess()) { }
}

// Can pass PaginatedResponse without issues
const paginated = new PaginatedResponse(...);
handle(paginated);  // Works!
```

---

## 9. INTERFACE SEGREGATION PRINCIPLE

**Definition**: Create small, specific interfaces  
**Benefit**: Flexibility, clarity

### Example in Project
```typescript
// ❌ Fat Interface (Bad)
interface IUserManager {
  create(): void;
  read(): void;
  update(): void;
  delete(): void;
  login(): void;
  logout(): void;
  refreshToken(): void;
  getAnalytics(): void;
  sendEmail(): void;
}

// ✅ Segregated Interfaces (Good)
interface IUserCrud {
  create(): void;
  read(): void;
  update(): void;
  delete(): void;
}

interface IAuthManager {
  login(): void;
  logout(): void;
  refreshToken(): void;
}

interface IUserService extends IUserCrud { }
interface IAuthService extends IAuthManager { }
```

---

## 10. DESIGN PATTERNS

### Singleton Pattern
```typescript
// ✅ Angular's providedIn: 'root'
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Only one instance in entire app
}
```

### Factory Pattern
```typescript
// ✅ Static factory methods
export class ApiResponse<T> {
  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }
  
  static error<T>(message: string): ApiResponse<T> {
    return new ApiResponse(500, message, null as T);
  }
}

// Usage
const success = ApiResponse.success(data);
const error = ApiResponse.error('Something went wrong');
```

### Observer Pattern
```typescript
// ✅ RxJS Observables
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  // Components subscribe
}

// Usage in component
this.authService.isAuthenticated$.subscribe(isAuth => {
  this.showLoginBtn = !isAuth;
});
```

### Guard Pattern
```typescript
// ✅ Route protection
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

// Usage
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];
```

### Interceptor Pattern
```typescript
// ✅ Global HTTP handling
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add token to all requests
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

---

## Quick Reference Table

| Concept | Purpose | Example | Benefit |
|---------|---------|---------|---------|
| **Encapsulation** | Hide internal data | Private token storage | Data integrity |
| **Abstraction** | Simplify complexity | Interface contracts | Loose coupling |
| **Inheritance** | Code reuse | PaginatedResponse extends ApiResponse | DRY principle |
| **Polymorphism** | Multiple forms | Generic ApiResponse<T> | Flexibility |
| **DI** | Inject dependencies | Constructor injection | Testability |
| **SRP** | Single responsibility | AuthService only handles auth | Maintainability |
| **Factory** | Create objects | ApiResponse.success() | Consistent creation |
| **Singleton** | One instance | @Injectable(root) | Resource efficiency |
| **Observer** | Reactive updates | BehaviorSubject | Real-time updates |
| **Guard** | Protect routes | CanActivate | Security |

---

## Practice Exercise

Try identifying OOP concepts in your project:

1. Find 3 examples of **Encapsulation** ✓
2. Find 2 uses of **Inheritance** ✓
3. Identify the **Singleton** services ✓
4. Name the **Guards** and their purpose ✓
5. List **Interceptors** and what they do ✓
6. Find services following **SRP** ✓
7. Identify **Polymorphic** methods ✓
8. Find **Observable** implementations ✓
9. List **Interfaces** in the project ✓
10. Explain the **Module** architecture ✓

---

## Resources

- [Angular Official Style Guide](https://angular.io/guide/styleguide)
- [TypeScript OOP](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/)
- [RxJS Documentation](https://rxjs.dev/)

