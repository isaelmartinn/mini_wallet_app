# Development Rules - Mini Wallet App

This file contains the mandatory rules that **ALL** code implementations must follow. The AI must consult and apply these rules in every development session.

---

## 🎯 Mandatory Rules

### 1. Strict TypeScript
- ❌ **FORBIDDEN** to use `any` as a type
- ✅ Use specific types, interfaces, or `unknown` when necessary
- ✅ Define types for props, states, and function returns
- ✅ Create domain types in `src/types/`

### 2. Styles
- ❌ **FORBIDDEN** to use inline styles
- ✅ Use StyleSheet.create() in separate `.styles.ts` files
- ✅ Centralize design tokens (colors, spacing, typography) in `src/theme/`
- ✅ Follow convention: `ComponentName.styles.ts` next to `ComponentName.tsx`

### 3. Imports and Paths
- ❌ **FORBIDDEN** to use relative paths (`../../components`)
- ✅ Use configured aliases: `@/components`, `@/api`, `@/store`, etc.
- ✅ Keep imports ordered: external → aliases → relative
- ✅ Group imports by type (React, libraries, components, types, styles)

### 4. Dependencies and Package Management
- ✅ **This project uses FIXED package versions** (no `^` or `~` prefixes)
- ✅ All dependencies in `package.json` must have exact versions (e.g., `"1.2.3"` not `"^1.2.3"`)
- ✅ This ensures consistent builds across environments and prevents unexpected breaking changes
- ❌ **FORBIDDEN** to add dependencies with version ranges

### 5. Folder Architecture
```
src/
├── api/           # Services and API calls (mock or real)
├── assets/        # Images, fonts, icons
├── components/    # Reusable components
├── features/      # Features by domain (auth, wallet, transactions)
│   └── [feature]/
│       ├── components/  # Feature-specific components
│       ├── screens/     # Feature screens
│       ├── hooks/       # Custom hooks
│       └── types.ts     # Feature types
├── navigation/    # Navigation configuration
├── store/         # Global state (Zustand stores)
├── theme/         # Design tokens, colors, typography
├── types/         # Global types and domain models
├── utils/         # Utilities and helpers
└── App.tsx
```

#### 5.1 Component, Hook, and Screen Structure
**MANDATORY**: Each component, hook, and screen must be organized in its own folder:

```
components/
└── Button/
    ├── Button.tsx           # Component implementation
    ├── Button.styles.ts     # Component styles
    ├── Button.test.tsx      # Unit tests
    └── index.ts             # Barrel export

hooks/
└── useContacts/
    ├── useContacts.ts       # Hook implementation
    ├── useContacts.test.ts  # Unit tests
    └── index.ts             # Barrel export

features/auth/screens/
└── LoginScreen/
    ├── LoginScreen.tsx      # Screen implementation
    ├── LoginScreen.styles.ts # Screen styles
    ├── LoginScreen.test.tsx # Unit tests
    └── index.ts             # Barrel export
```

**Rules**:
- ✅ Each component/hook/screen must have its own folder with the same name
- ✅ Unit tests must be inside the same folder (not in separate `__tests__` folders)
- ✅ Each folder must contain a barrel export (`index.ts`)
- ✅ Barrel exports should re-export the main module: `export { Button } from './Button';`
- ✅ Import from the folder, not the file: `import { Button } from '@/components/Button';`

### 6. Components
- ✅ Separate logic from presentation (custom hooks)
- ✅ Typed props with interfaces
- ✅ Small components with single responsibility
- ✅ Use composition over inheritance
- ✅ Memoization when necessary (React.memo, useMemo, useCallback)

### 7. Global State (Zustand)
- ✅ One store per domain (authStore, walletStore, transactionsStore)
- ✅ Typed and descriptive actions
- ✅ Use persist middleware for data that must survive restarts
- ✅ Selectors to avoid unnecessary re-renders

### 8. Validations and Business Rules
- ✅ Validations in services/hooks, NOT only in UI
- ✅ Descriptive and centralized error messages
- ✅ State handling: loading, error, success, empty
- ✅ Implement business rules in domain layer

### 9. Testing
- ✅ Unit tests for validations and business logic
- ✅ Tests for critical components
- ✅ Mocks for services and stores
- ✅ Minimum coverage: validations, hooks, stores
- ✅ Test files must live next to the component/module they test
- ❌ **FORBIDDEN** to create separate `__tests__` folders
- ✅ Convention: `ComponentName.test.tsx` next to `ComponentName.tsx`

### 10. Error Handling
- ✅ Try-catch in asynchronous operations
- ✅ Visual feedback to user (toast, inline messages)
- ✅ Error logging for debugging
- ✅ Defined fallbacks and error states

### 11. Accessibility
- ✅ Descriptive labels on inputs
- ✅ Tactile and visual feedback
- ✅ Adequate touch target sizes (minimum 44x44)
- ✅ Appropriate color contrast

### 12. Performance
- ✅ Lists with FlatList/SectionList (not ScrollView with map)
- ✅ Unique and stable KeyExtractor
- ✅ Optimize re-renders with React.memo
- ✅ Lazy loading when appropriate


## 🤖 Instructions for AI

**IMPORTANT**: At the beginning of each development session:
1. Read this entire file
2. Apply ALL rules in the generated code
3. If a rule conflicts with a request, ask the user
4. Suggest improvements when existing code doesn't follow the rules
5. Document decisions that affect these rules in DECISIONS.md

**These rules are MANDATORY and take priority over general suggestions.**
