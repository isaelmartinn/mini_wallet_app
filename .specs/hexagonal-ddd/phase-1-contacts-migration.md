# Phase 1 — Contacts Context Migration

Goal: migrate the **Contacts** capability (native module + permission handling + hook) into a hexagonal bounded context under `src/contexts/contacts`.

This is the smallest context and should be migrated first.

## References

- `architecture-reference.md`
- `current-state-analysis.md`

## Target behavior (must remain identical)

- `ContactPicker` still works.
- Permission denied flow still provides a manual fallback.
- If the native module is unavailable, the UI does not crash and behaves gracefully.

## Current code to migrate

- `src/services/ContactsService/ContactsService.ts`
- `src/hooks/useContacts/*`
- `src/types/contacts.ts`
- `src/components/ContactPicker/*` (only update imports to new hook as needed)

## Target structure

Create:

```
src/contexts/contacts/
  domain/
    entities/
    value-objects/
    repositories/
    errors/
  application/
    use-cases/
  infrastructure/
    repositories/
  presentation/
    hooks/
```

## Step-by-step

### 1) Domain layer

Create:

- `domain/entities/Contact.ts`
  - Pure TS entity.
  - Represents a contact returned to presentation.

- `domain/value-objects/ContactsPermissionStatus.ts`
  - Models `granted`, `canAskAgain`.

- `domain/repositories/IContactsRepository.ts`
  - Port interface:
    - `requestPermission(): Promise<Result<ContactsPermissionStatus>>`
    - `getContacts(): Promise<Result<Contact[]>>`
    - `isAvailable(): boolean`

- `domain/errors/*`
  - `ContactsUnavailableError`
  - `ContactsPermissionError`

Move/translate types from `src/types/contacts.ts` into the new domain model.

Add tests next to each file.

### 2) Infrastructure adapter

Create:

- `infrastructure/repositories/NativeContactsRepository.ts`
  - Implements `IContactsRepository`.
  - Wrap `NativeModules.ContactsModule`.
  - Preserve current behavior:
    - If module missing: return `Result.fail(new ContactsUnavailableError(...))`.
    - `requestPermission` returns a safe denied status on failure.

Add `NativeContactsRepository.test.ts` using jest mocks for `react-native` NativeModules.

### 3) Application use cases

Create:

- `application/use-cases/RequestContactsPermissionUseCase.ts`
- `application/use-cases/GetContactsUseCase.ts`

Both depend only on `IContactsRepository` and return `Result<...>`.

### 4) Presentation hook

Create:

- `presentation/hooks/useContacts/useContacts.ts`
  - Replace logic previously in `src/hooks/useContacts/useContacts.ts`.
  - Use DI (Phase 0 container) or accept injected use cases (preferred for tests).

Add `useContacts.test.ts`.

### 5) Wire DI

Update:

- `src/core/di/providers/ContactsProvider.ts`
  - Provide repository + use cases.

Update:

- `src/core/di/container.ts`
  - Export `contacts` use cases to be consumed by the hook.

### 6) Redirect imports (non-breaking)

Update:

- `src/components/ContactPicker/ContactPicker.tsx` to import the new hook.

Keep the old `src/hooks/useContacts` temporarily, but ensure it is no longer used.

### 7) Remove old code (only when safe)

After verification, delete:

- `src/hooks/useContacts/`
- `src/services/ContactsService/`
- `src/types/contacts.ts` (if no longer referenced; otherwise leave until Phase 5)

## Verification

- `yarn lint`
- `yarn test`

Manual checks:

- Open ContactPicker, accept permission → list visible.
- Deny permission → manual fallback works.
- Simulate missing module (in tests) → no crash.
