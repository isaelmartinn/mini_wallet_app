# Phase 2 — Authentication Context Migration

Goal: migrate Authentication into `src/contexts/authentication` with hexagonal layering.

## References

- `architecture-reference.md`
- `current-state-analysis.md`

## Target behavior (must remain identical)

- Login screen validations remain the same.
- Auth state persistence remains the same (AsyncStorage via zustand persist).
- Navigation behavior remains the same.

## Current code to migrate

- `src/api/auth.ts`
- `src/store/authStore/*`
- `src/features/auth/*`
- `src/types/auth.types.ts`
- `src/utils/validation/*` (only identifier validation portions used by auth)

## Target structure

```
src/contexts/authentication/
  domain/
  application/
  infrastructure/
  presentation/
```

## Key design choices

- Zustand store remains in presentation as an adapter for UI state.
- The store must delegate the business flow to use cases.
- Use cases return `Result<T>` and never import Zustand.

## Step-by-step

### 1) Domain layer

Create:

- `domain/entities/User.ts`
- `domain/value-objects/Email.ts`
- `domain/value-objects/PhoneNumber.ts`
- `domain/value-objects/Identifier.ts` (recommended: encapsulate current validateIdentifier rules)
- `domain/repositories/IAuthRepository.ts` (port)
- `domain/errors/*`

Add tests for value objects and entity invariants.

### 2) Infrastructure

Create:

- `infrastructure/repositories/AuthApiRepository.ts`
  - Wrap current behavior from `src/api/auth.ts`.

- `infrastructure/persistence/AuthSessionStorage.ts`
  - Wrap AsyncStorage interactions if needed.

Do not introduce new dependencies.

### 3) Application use cases

Create:

- `application/use-cases/LoginUseCase.ts`
  - Input DTO: identifier string.
  - Output: `Result<User>`.
  - Must reuse Identifier VO validation.

- `application/use-cases/LogoutUseCase.ts`

Add tests that mock `IAuthRepository`.

### 4) Presentation: store + hooks + screens

Create:

- `presentation/store/authStore.ts`
  - Keep the public API compatible with current `useAuthStore` to minimize changes.
  - Internally call use cases.

- `presentation/hooks/useLogin/*`
- `presentation/hooks/useLogout/*`
- `presentation/screens/LoginScreen/*` (move existing screen)

Update imports in navigation and screen index exports to point to new locations.

### 5) DI wiring

Update:

- `src/core/di/providers/AuthProvider.ts`
- `src/core/di/container.ts`

### 6) Redirect usage

Ensure that:

- Existing imports like `@/store/authStore` are updated (or re-exported) to the new presentation store.

Recommendation for incremental migration:

- Keep `src/store/authStore/index.ts` as a re-export to new store temporarily, then delete in Phase 5.

### 7) Remove old code (only when safe)

After verification:

- Remove `src/features/auth` (if navigation updated).
- Remove `src/api/auth.ts` only if no longer imported.
- Remove old auth types if unused.

## Verification

- `yarn lint`
- `yarn test`

Manual checks:

- Invalid identifier shows same error.
- Login success persists session.
- Logout clears session.
