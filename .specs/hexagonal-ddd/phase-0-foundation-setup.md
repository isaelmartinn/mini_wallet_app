# Phase 0 — Foundation Setup (Hexagonal + DDD)

Goal: introduce the minimal **foundation** required to support hexagonal architecture across contexts, without changing app behavior.

This plan is designed to be executed independently.

## References

- `architecture-reference.md`
- `current-state-analysis.md`

## Scope

- Create the base folder structure (`contexts/`, `shared/`, `core/di/`).
- Add shared primitives (Result, base errors) used by use cases.
- Add DI container + providers skeletons.
- Update TypeScript path aliases for new folders.

No feature code migration is required in this phase (only foundation + wiring). App behavior should remain identical.

## Step-by-step

### 1) Create base folders

Create:

- `src/contexts/`
- `src/shared/domain/errors/`
- `src/shared/domain/result/`
- `src/core/di/providers/`

### 2) Add shared domain primitives

Create minimal shared types:

- `src/shared/domain/errors/DomainError.ts`
  - Base class for domain/application errors.

- `src/shared/domain/errors/ValidationError.ts`
  - Extends `DomainError`.

- `src/shared/domain/result/Result.ts`
  - A small `Result<T>` helper.
  - Must be fully typed (no `any`).
  - Include tests next to it:
    - `Result.test.ts`

Recommended API:

- `Result.ok(value)`
- `Result.fail(error)`
- `isOk`, `isFail`, `value?`, `error?`

### 3) Add DI skeleton

Create:

- `src/core/di/providers/ContactsProvider.ts`
- `src/core/di/providers/AuthProvider.ts`
- `src/core/di/providers/WalletProvider.ts`
- `src/core/di/providers/TransactionsProvider.ts`

At this stage providers can export placeholder factory functions (or return `null` / throw) **only if they are not used yet**.

Create:

- `src/core/di/container.ts`
  - Export a stable public API surface for presentation to consume in later phases.
  - Example:
    - `export const di = { contacts: ..., auth: ..., wallet: ..., transactions: ... }`

Do not wire into `App.tsx` yet unless needed.

### 4) Update TS path aliases

Update `tsconfig.json` to include:

- `@contexts/* -> src/contexts/*`
- `@shared/* -> src/shared/*`
- `@core/* -> src/core/*`

Keep existing `@/*` alias intact.

### 5) No-op check: ensure no imports break

- Do not change existing imports yet.
- Ensure the new files compile.

## Verification

Run:

- `yarn lint`
- `yarn test`

Acceptance criteria:

- No lint errors.
- All existing tests pass.
- App builds/runs as before.

## Rollback strategy

If lint/tests fail due to TS path config:

- Revert `tsconfig.json` changes, keep foundation files, re-run checks.

Notes:

- This phase must not move existing feature code yet.
