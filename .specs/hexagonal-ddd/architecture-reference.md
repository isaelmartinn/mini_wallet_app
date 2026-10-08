# Hexagonal + DDD Reference (Frontend / React Native)

This document is a shared reference for all phase plans in `.specs/hexagonal-ddd/`.

It defines the **target architecture**, **folder conventions**, and **implementation patterns** to keep each phase plan independent and consistent.

## Non‑negotiable constraints

- Do not break app behavior at any point (incremental migration).
- After each phase:
  - `yarn lint` must pass.
  - `yarn test` must pass.
- Tests **must live next to the unit under test** (same folder as the component/hook/service). Do **not** create a centralized `__tests__` folder.
- Do **not** create additional documentation files about the migration; only the phase plan files in this folder.

## Target architecture (Hexagonal)

Each bounded context is organized into four layers:

- `domain/`
  - Entities, Value Objects, Domain Services, Domain Errors, Port interfaces (repositories)
  - Must be framework-agnostic (no React, Zustand, React Native imports).

- `application/`
  - Use cases (input/output DTOs), orchestration, policies
  - Depends on `domain/` and domain ports.

- `infrastructure/`
  - Adapters implementing domain ports: mock APIs, AsyncStorage, NativeModules
  - May depend on React Native / external libraries.

- `presentation/`
  - React components/screens, hooks, Zustand stores (as UI state adapters)
  - Uses `application/` use cases.

### Folder structure conventions

- New contexts live under `src/contexts/<context-name>/...`
- Shared cross-context code lives under `src/shared/...`
- Composition / DI setup lives under `src/core/di/...`

Example (simplified):

```
src/
  contexts/
    contacts/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
    domain/
    infrastructure/
    presentation/
  core/
    di/
```

## DDD modeling guidelines

### Entity vs Value Object

- **Entity**: has identity (`id`), can change over time (e.g., `User`, `Wallet`, `Transaction`).
- **Value Object**: no identity, should be immutable, equality by value (e.g., `Email`, `PhoneNumber`, `Money`, `Amount`).

### Where business rules live

- Simple validations → Value Objects (preferred).
- Invariant rules about an entity → inside entity.
- Multi-entity rules → domain service.
- Orchestration / sequencing / calling ports → use cases.
- UI state & rendering → presentation.

## Error handling contract

Prefer a consistent pattern across use cases:

- Use cases return a `Result<T>` (or similar) rather than throwing.
- Infrastructure adapters may throw internally but should be mapped to `Result.fail(...)` at the boundary.

Recommended minimal `Result<T>` shape:

- `ok(value)`
- `fail(error)` where `error` is a typed domain/application error

## Dependency direction

- `domain` has **no** dependencies on other layers.
- `application` depends on `domain`.
- `infrastructure` depends on `application` + `domain` (implements ports).
- `presentation` depends on `application` + `domain` (consumes use cases, types).

## Dependency Injection (DI) pattern

Keep DI simple (no new dependencies):

- Create factory/provider functions in `src/core/di/providers/*`.
- Provide a single `container.ts` exporting ready-to-use instances for presentation.

Presentation imports from DI (examples):

- `import { contactsUseCases } from '@core/di/container'`

## Verification commands

- Lint: `yarn lint`
- Tests: `yarn test`
- Formatting check (optional if used in repo): `yarn format:check`

## Notes about existing project constraints

- The project uses:
  - React Native 0.76
  - Zustand stores in `src/store/*`
  - Mock APIs in `src/api/*`
  - Native module wrapper in `src/services/ContactsService/*`
  - Path alias `@/* -> src/*`

All phases should preserve runtime behavior while gradually redirecting imports to the new architecture.
