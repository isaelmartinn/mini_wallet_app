# Phase 4 — Transactions Context Migration

Goal: migrate the full transaction flow into `src/contexts/transactions` with domain rules in the domain layer and orchestration in use cases.

This is the largest context.

## References

- `architecture-reference.md`
- `current-state-analysis.md`

## Target behavior (must remain identical)

- Flow: Amount → Recipient → Summary → Result (success/error) and Timeout screen.
- Validations:
  - amount > 0
  - amount <= balance
  - recipient required
  - phone/account formatting rules
- Random outcomes from mock transactions API remain the same.
- Inactivity timeout behavior remains.

## Current code to migrate

- `src/api/transactions.ts`
- `src/store/transactionFlowStore/*`
- `src/features/transactions/*` (screens/hooks/utils/constants/types)

## Target structure

```
src/contexts/transactions/
  domain/
  application/
  infrastructure/
  presentation/
```

## Step-by-step

### 1) Domain

Create:

- Entities:
  - `TransactionDraft`
  - `Recipient`

- Value objects:
  - `Amount`
  - `AccountOrPhone` (or `PhoneNumber` depending on business rules)

- Rules and errors:
  - Move rules from `src/features/transactions/constants.ts` into domain.
  - Replace string constants with typed errors where appropriate.

- Ports:
  - `ITransactionsRepository` (sendMoney)

- Domain service:
  - `TransactionValidationService` that encapsulates current validateAmount/validateRecipient behavior.

Add tests:

- For validation service covering all existing validation cases.

### 2) Infrastructure

Create:

- `infrastructure/repositories/TransactionsApiRepository.ts`
  - Wrap `transactionsApi.sendMoney`.
  - Map outcomes to a stable application/domain result.

Add tests mocking the api.

### 3) Application use cases

Create:

- `application/use-cases/SetAmountUseCase.ts`
- `application/use-cases/SetRecipientUseCase.ts`
- `application/use-cases/ProcessTransactionUseCase.ts`

Important: keep the flow orchestration here.

If wallet balance update is part of current behavior, coordinate with wallet presentation store through an application port (avoid directly importing Zustand).

### 4) Presentation

Create:

- `presentation/store/transactionFlowStore.ts`
  - Keep external API compatible with existing `useTransactionFlowStore`.
  - Internally delegates to use cases.

- Move screens:
  - AmountScreen
  - RecipientScreen
  - SummaryScreen
  - ResultScreen (+ components)
  - TimeoutScreen

- Move `useInactivityTimeout` hook under transactions presentation.

- Keep `phoneNormalization` as presentation util.

Update navigation routes to point to moved screens.

### 5) DI wiring

Update:

- `src/core/di/providers/TransactionsProvider.ts`
- `src/core/di/container.ts`

### 6) Redirect usage incrementally

Recommendation:

- Keep `src/store/transactionFlowStore/index.ts` as a temporary re-export.

### 7) Remove old code (only when safe)

After verification:

- Remove `src/features/transactions`.
- Remove old store folder and old api module if unused.

## Verification

- `yarn lint`
- `yarn test`

Manual checks:

- Entire transaction flow works.
- Timeout triggers after configured inactivity.
- Errors render the correct UI and allow retry/home navigation.
