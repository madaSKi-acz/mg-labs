# MG Labs Angular Application

A comprehensive, enterprise-grade Angular application built with Object-Oriented Programming (OOP) principles, modular architecture, and best practices.

## Features

✅ **Advanced Authentication System**
- JWT token-based authentication
- Automatic token refresh
- Role-based access control

✅ **Modular Architecture**
- Lazy-loaded feature modules
- Core services (singleton pattern)
- Shared utilities and components

✅ **OOP Implementation**
- Interfaces and abstract classes
- Encapsulation and abstraction
- Inheritance and polymorphism
- Dependency injection

✅ **State Management**
- Redux-style actions and reducers
- Observable-based state
- BehaviorSubject for reactive updates

✅ **Security**
- HTTP interceptors for token injection
- Route guards for access control
- Secure token storage

✅ **Performance**
- Lazy loading of modules
- Caching mechanisms
- OnPush change detection

---

## Project Structure

```
📁 app/
├── 📁 core/                 # Singleton services
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── 📁 gaurds/
│   │   └── auth.guard.ts
│   ├── 📁 interceptors/
│   │   └── auth.interceptor.ts
│   └── core.module.ts
│
├── 📁 features/             # Lazy-loaded feature modules
│   ├── 📁 admin/
│   │   ├── services/
│   │   ├── components/
│   │   └── admin.module.ts
│   ├── 📁 product/
│   │   ├── services/
│   │   ├── components/
│   │   └── products.module.ts
│   ├── 📁 user/
│   │   ├── services/
│   │   ├── components/
│   │   └── user.module.ts
│   └── 📁 state/
│       ├── 📁 actions/
│       └── 📁 reducers/
│
├── 📁 shared/               # Reusable components
│   ├── 📁 components/
│   ├── 📁 directives/
│   ├── 📁 pipes/
│   └── shared.module.ts
│
├── app.module.ts
├── app-routing.module.ts
└── app.component.ts
```

---

## OOP Principles

### 1. **Encapsulation**
All sensitive data is hidden behind private members with public accessors.

```typescript
class User {
  private _password: string;
  
  setPassword(password: string): void {
    this._password = this.hashPassword(password);
  }
}
```

### 2. **Abstraction**
Interfaces define contracts, implementations handle details.

```typescript
interface IAuthService {
  login(credentials: LoginCredentials): Observable<User>;
  logout(): Observable<void>;
}

class AuthService implements IAuthService { }
```

### 3. **Inheritance**
Related classes share common functionality.

```typescript
class ApiResponse<T> { }
class PaginatedResponse<T> extends ApiResponse<T[]> { }
```

### 4. **Polymorphism**
Different implementations of the same interface.

```typescript
class UserService implements IService { }
class ProductService implements IService { }
```

---

## Key Services

### AuthService
```typescript
// Authentication & Authorization
login(credentials: LoginCredentials): Observable<User>
logout(): Observable<void>
refreshToken(): Observable<string>
hasRole(role: UserRole): boolean
```

### UserService
```typescript
// User Management
getAll(params: UserQueryParams): Observable<any>
getById(id: string): Observable<User>
create(userData: Partial<IUser>): Observable<User>
update(id: string, payload: Partial<IUser>): Observable<User>
delete(id: string): Observable<void>
```

### ProductService
```typescript
// Product Management
getAll(page: number, limit: number): Observable<any>
getById(id: string): Observable<Product>
search(query: string): Observable<Product[]>
create(productData: Partial<IProduct>): Observable<Product>
update(id: string, productData: Partial<IProduct>): Observable<Product>
```

### AdminService
```typescript
// Admin Operations
getDashboardStats(): Observable<DashboardStats>
getUserAnalytics(period: string): Observable<any>
getRevenueAnalytics(period: string): Observable<any>
getSystemLogs(page: number): Observable<any>
```

---

## Design Patterns

- **Singleton**: Services are singletons (providedIn: 'root')
- **Factory**: ApiResponse.success() / ApiResponse.error()
- **Observable**: RxJS for reactive programming
- **Guard**: Route protection with CanActivate
- **Interceptor**: Global HTTP request/response handling
- **Module**: Modular feature-based architecture

---

## Installation & Setup

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Install dependencies
npm install

# 3. Configure environment
# Edit environments/environment.ts for your API URL

# 4. Start development server
ng serve

# 5. Navigate to
# http://localhost:4200
```

---

## Configuration

### Environment Files
- `environments/environment.ts` - Development
- `environments/environment.prod.ts` - Production

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'MG Labs (Dev)'
};
```

---

##Authentication Flow

```
1. User enters credentials
   ↓
2. AuthService.login() sends to API
   ↓
3. API returns user & tokens
   ↓
4. Store tokens in localStorage
   ↓
5. Update AuthService state
   ↓
6. Navigate to dashboard
   ↓
7. Guards check authentication
   ↓
8. AuthInterceptor adds token to requests
```

---

## Error Handling

### Global Error Handling
The `AuthInterceptor` handles HTTP errors globally:
- **401 Errors**: Refresh token and retry
- **403 Errors**: Redirect to unauthorized page
- **Other Errors**: Log and propagate

```typescript
catchError((error: HttpErrorResponse) => {
  if (error.status === 401) {
    return this.handle401Error(request, next);
  }
  return throwError(() => error);
})
```

---

## Security Considerations

✅ **Token Storage**: Tokens stored in localStorage
✅ **Token Refresh**: Automatic refresh on expiration
✅ **CORS**: Configured on backend
✅ **CSRF**: Angular built-in protection
✅ **XSS**: Template sanitization
✅ **Route Guards**: Authorization checks

---

## Performance Optimizations

- **Lazy Loading**: Feature modules loaded on demand
- **Change Detection**: OnPush strategy where applicable
- **Unsubscribe**: Proper cleanup in ngOnDestroy
- **Caching**: Service-level data caching
- **TrackBy**: Used in *ngFor loops

---

## Testing

```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e

# Generate coverage report
ng test --coverage
```

---

## Building

```bash
# Development build
ng build

# Production build
ng build --configuration production

# Build for specific environment
ng build --configuration staging
```

---

## API Integration

### Base URL Configuration
Update `environment.ts`:
```typescript
apiUrl: 'http://your-api-url.com/api'
```

### ExpectedAPI Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/users` - Get all users
- `GET /api/products` - Get all products
- `GET /api/admin/dashboard` - Admin dashboard

---

## OOP Architecture Guide

See [OOP_ARCHITECTURE.md](./OOP_ARCHITECTURE.md) for detailed documentation on:
- OOP Principles Implementation
- Design Patterns Used
- Architecture Decisions
- Best Practices

---

## Contributing

1. Follow Angular style guide
2. Implement OOP principles
3. Write unit tests
4. Update documentation
5. Create descriptive commit messages

---

## License

MIT

---

## Support

For issues or questions, please create an issue in the repository.

