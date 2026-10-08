# Phase 5 — Final Cleanup

Goal: remove old architecture folders and ensure the app exclusively uses the new hexagonal/DDD structure.

This phase should be executed only after Phases 1–4 are complete and stable.

## References

- `architecture-reference.md`
- `current-state-analysis.md`

## Preconditions

- Contacts context migrated and working.
- Authentication context migrated and working.
- Wallet context migrated and working.
- Transactions context migrated and working.
- Any temporary re-export shims still present (e.g. `src/store/*/index.ts`) can be removed safely.

## Step-by-step

### 1) Find and remove legacy imports

Search for imports from:

- `src/features/*`
- `src/store/*`
- `src/api/*`
- `src/services/*`
- `src/hooks/useContacts/*` (legacy)

Update remaining imports to new `src/contexts/*` or `src/shared/*` paths.

### 2) Remove legacy folders (destructive — do after verification)

Delete folders only when unused:

- `src/features/`
- `src/store/`
- `src/api/`
- `src/services/`
- `src/hooks/useContacts/`

For `src/types/*` and `src/utils/*`:

- Keep only what is truly shared and still used.
- Otherwise move shared parts into `src/shared/*` and delete unused leftovers.

### 3) Normalize exports / entrypoints

- Ensure `src/types/index.ts` exports correct types (or remove it if replaced).
- Ensure navigation imports the correct screens.

### 4) Verify DI container is the only composition root

- All contexts should be wired via `src/core/di/container.ts`.
- Presentation should not instantiate infrastructure adapters directly.

## Verification

Run:

- `yarn lint`
- `yarn test`

Manual smoke test:

- Login → Home → New Transaction → Result.
- Logout.
- Refresh wallet.
- Contact picker flow (grant + deny).

Acceptance criteria:

- No references to removed legacy folders.
- All tests pass.
- Lint passes.
- App behavior unchanged.
