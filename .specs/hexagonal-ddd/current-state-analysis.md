# Current State Analysis (Mini Wallet App)

This is a shared reference for the hexagonal/DDD migration plans.

## Current source tree (high-level)

```
src/
  api/
    auth.ts
    wallet.ts
    transactions.ts
  components/
    Button/
    Input/
    ContactPicker/
  features/
    auth/
      hooks/
      screens/
    wallet/
      hooks/
      screens/
    transactions/
      constants.ts
      types.ts
      utils/
      hooks/
      screens/
  hooks/
    useContacts/
  navigation/
  services/
    ContactsService/
  store/
    authStore/
    walletStore/
    transactionFlowStore/
  theme/
  types/
    auth.types.ts
    wallet.types.ts
    contacts.ts
    index.ts
  utils/
    validation/
    currency/
    constants/
    deviceSettings/
```

## Current data flow (by feature)

### Authentication

- UI:
  - `src/features/auth/screens/LoginScreen/*`
  - Hook: `src/features/auth/hooks/useLogin/useLogin.ts`
- State:
  - `src/store/authStore/authStore.ts` (Zustand + persist to AsyncStorage)
- API:
  - `src/api/auth.ts` (mock login + validateIdentifier)
- Shared validation:
  - `src/utils/validation/validation.ts` (identifier validation)

### Wallet

- UI:
  - `src/features/wallet/screens/HomeScreen/*`
  - Hook: `src/features/wallet/hooks/useWallet/useWallet.ts` (thin wrapper)
- State:
  - `src/store/walletStore/walletStore.ts`
- API:
  - `src/api/wallet.ts` (mock wallet data + random failures)
- Coupling:
  - `walletStore` reads current user via `useAuthStore.getState()`.

### Transactions

- UI:
  - Screens: Amount → Recipient → Summary → Result → Timeout
- State:
  - `src/store/transactionFlowStore/transactionFlowStore.ts`
- API:
  - `src/api/transactions.ts` (random outcomes)
- Business rules:
  - `src/features/transactions/utils/validation/validation.ts`
  - `src/features/transactions/constants.ts`
- Coupling:
  - Screens directly call store setters and validation utils.

### Contacts

- Presentation:
  - `src/hooks/useContacts/*`
  - Component: `src/components/ContactPicker/*`
- Infrastructure:
  - `src/services/ContactsService/ContactsService.ts` wraps `NativeModules.ContactsModule`

## Testing baseline

- Jest is configured (`yarn test`).
- ESLint is configured (`yarn lint`).
- There are ~18 tests spread next to modules (good convention already).

## Migration implications

- The current structure is feature-based with shared stores/APIs.
- The hexagonal migration will:
  - Introduce `src/contexts/*` with domain/application/infrastructure/presentation.
  - Move or wrap existing stores and APIs as adapters.
  - Keep old code temporarily and progressively redirect imports.
  - Remove old folders only in the final cleanup phase.
