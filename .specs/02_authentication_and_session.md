# Plan 02: Authentication & Session

This plan focuses on the user entry point and session persistence logic.

## Context & Objectives
Implement a mock login flow that persists the user's session locally and allows access to the main application.

## Implementation Steps

### 1. Auth Store (Zustand)
- Implement `useAuthStore` to manage:
  - `user`: User details (name, email/phone).
  - `isAuthenticated`: Boolean flag.
  - `login()` and `logout()` actions.
  - `persist` middleware to save session in `AsyncStorage`.

### 2. Mock API Service
- Create `src/api/auth.ts` to simulate login delays and mock responses.
- Implement validation for email/phone formats.

### 3. Login Screen
- Design a clean, modern UI for the Login screen.
- Features:
  - Form with email/phone input.
  - Validation feedback (errors for empty fields or invalid formats).
  - Loading state during "authentication".
  - Navigation to Home upon success.

### 4. Navigation Guard
- Update `MainNavigator` to conditionally render `AuthStack` or `AppStack` based on the `isAuthenticated` state from Zustand.

## Acceptance Criteria
- [ ] User can "login" with valid-looking credentials.
- [ ] Error messages appear for invalid inputs.
- [ ] Session is persisted (reloading the app keeps the user logged in).
- [ ] Logout functionality works and redirects to Login.

## Risks & Mitigations
- **Risk**: Hardcoding mock users.
- **Mitigation**: Create a set of constants for mock users in `utils/constants.ts`.
