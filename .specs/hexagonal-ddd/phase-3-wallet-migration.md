# Phase 3 — Wallet Context Migration

Goal: migrate Wallet (balance + transaction list) into `src/contexts/wallet`.

## References

- `architecture-reference.md`
- `current-state-analysis.md`

## Target behavior (must remain identical)

- Home screen loads wallet data, supports retry and refresh.
- Error/empty/loading states behave the same.
- Data remains sourced from the same mock API behavior.

## Current code to migrate

- `src/api/wallet.ts`
- `src/store/walletStore/*`
- `src/features/wallet/*`
- `src/types/wallet.types.ts`
- Currency utilities: `src/utils/currency/*` (decide shared vs wallet VO)

## Target structure

```
src/contexts/wallet/
  domain/
  application/
  infrastructure/
  presentation/
```

## Step-by-step

### 1) Domain

Create:

- `domain/entities/Wallet.ts`
- `domain/entities/Transaction.ts`
- `domain/value-objects/Money.ts` (or keep formatting in shared presentation; Money should be numeric-safe)
- `domain/repositories/IWalletRepository.ts`
- `domain/errors/*`

Add tests for:

- Wallet invariants.
- Money operations.

### 2) Infrastructure

Create:

- `infrastructure/repositories/WalletApiRepository.ts`
  - Wrap current `walletApi.getWalletData` behavior.

Add tests mocking the underlying mock api module.

### 3) Application

Create:

- `application/use-cases/GetWalletDataUseCase.ts`
- `application/use-cases/RefreshWalletDataUseCase.ts`

### 4) Presentation

Create:

- `presentation/store/walletStore.ts`
  - Keep API compatible with current `useWalletStore` to minimize changes.
  - Delegates to use cases.

- `presentation/hooks/useWallet/*` (move existing hook)
- `presentation/screens/HomeScreen/*` (move screen + nested components)

Update navigation imports.

### 5) DI wiring

Update:

- `src/core/di/providers/WalletProvider.ts`
- `src/core/di/container.ts`

### 6) Redirect usage incrementally

Recommendation:

- Keep `src/store/walletStore/index.ts` as a re-export to the new presentation store temporarily.

### 7) Remove old code (only when safe)

After verification:

- Remove `src/features/wallet`.
- Remove `src/api/wallet.ts` only when unused.

## Verification

- `yarn lint`
- `yarn test`

Manual checks:

- Home shows correct balance.
- Pull-to-refresh works.
- Retry works after simulated error.
