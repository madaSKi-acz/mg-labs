# Task Proposals from Codebase Review

## 1) Typo fix task
**Title:** Rename `gaurds` to `guards` across the app routing and file structure.

- **Issue found:** The folder/import path is consistently misspelled as `gaurds`, which is confusing and makes search/navigation harder.
- **Evidence:** `app/core/gaurds/auth.guard.ts` and imports in `app/app-routing.module.ts`.
- **Proposed scope:**
  - Rename directory `app/core/gaurds` ➜ `app/core/guards`.
  - Update all imports referencing `./core/gaurds/auth.guard`.
  - Run TypeScript build and unit tests after rename.
- **Acceptance criteria:**
  - No references to `gaurds` remain.
  - App builds and routes still function.

## 2) Bug fix task
**Title:** Prevent interceptor refresh recursion/deadlock on 401 responses from auth endpoints.

- **Issue found:** `AuthInterceptor` retries on any 401. If `/auth/refresh` itself returns 401 while refresh is in progress, requests may wait indefinitely on `refreshTokenSubject` (or repeatedly attempt refresh logic).
- **Evidence:** `app/core/interceptors/auth.interceptor.ts` currently handles all 401 statuses in one path, including refresh/logout requests.
- **Proposed scope:**
  - Skip refresh logic for auth endpoints (`/login`, `/refresh`, `/logout`) and fail fast to logout/propagate.
  - Ensure pending subscribers are released when refresh fails.
  - Add defensive guard to avoid intercepting the retried refresh request recursively.
- **Acceptance criteria:**
  - A 401 from `/auth/refresh` does not deadlock pending requests.
  - Users are logged out cleanly when refresh fails.

## 3) Documentation discrepancy task
**Title:** Align README build instructions with actual Angular CLI configurations.

- **Issue found:** README instructs `ng build --configuration staging`, but `angular.json` defines only `production` and `development` for build.
- **Evidence:** `README.md` build section vs. `angular.json` build configurations.
- **Proposed scope:**
  - Remove `staging` example from README **or** add a real `staging` configuration in `angular.json` and corresponding environment file.
  - Keep instructions and config in sync.
- **Acceptance criteria:**
  - Every build command documented in README works as written.

## 4) Test improvement task
**Title:** Add unit tests for `AuthInterceptor` refresh behavior and failure paths.

- **Issue found:** There are currently no `*.spec.ts` files in the repository, leaving auth-critical behavior untested.
- **Evidence:** repository search returns no spec files.
- **Proposed scope:**
  - Add `auth.interceptor.spec.ts` to cover:
    - Adds `Authorization` header when token exists.
    - Refreshes once on 401 and retries original request.
    - Does not refresh for `/auth/refresh` failures and logs out.
    - Concurrent 401 requests queue and resume correctly.
- **Acceptance criteria:**
  - New tests pass locally via `ng test` (or equivalent headless Karma command).
  - Core refresh scenarios are regression-protected.
