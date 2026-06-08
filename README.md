# Mini Wallet App

A React Native mobile application for managing a personal wallet with TypeScript, React Navigation, and Zustand.

## Tech Stack

- **React Native** 0.76.5
- **TypeScript** 5.0.4
- **React Navigation** (Stack & Bottom Tabs)
- **Zustand** (State Management)
- **Lucide React Native** (Icons)
- **Jest** & **React Native Testing Library** (Testing)

## Package Manager

This project uses **Yarn** as the package manager.

## Project Structure

```
src/
  api/          # Mock services and API calls
  assets/       # Images, fonts, and static resources
  components/   # Reusable UI components (Atom/Molecule)
  features/     # Module-specific logic and screens
    auth/       # Authentication screens
    wallet/     # Wallet screens
    transactions/ # Transaction screens
  hooks/        # Global custom hooks
  navigation/   # Navigators and route definitions
  store/        # Zustand stores
  theme/        # Colors, spacing, typography
  utils/        # Helpers, constants, validations
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn 1.22+
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Install dependencies
yarn install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

### Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Linting

```bash
# Run ESLint
yarn lint
```

## Features

### ✅ Plan 02: Authentication & Session (Completed)

- **Login Screen**: Modern UI with email/phone validation
- **Session Persistence**: AsyncStorage integration via Zustand persist
- **Navigation Guard**: Conditional rendering (AuthStack vs AppStack)
- **Mock Authentication**: Simulated API with validation
- **Error Handling**: Inline validation feedback
- **Logout Functionality**: Clear session and redirect

### ✅ Plan 03: Wallet Core - Balance & History (Completed)

- **Balance Card**: Apple Wallet-style display with MXN formatting
- **Transaction List**: FlatList with pull-to-refresh and virtualización
- **Transaction Items**: Visual icons, relative dates, status badges
- **State Management**: walletStore with Zustand (loading, error, empty states)
- **Mock API**: Realistic network simulation with 10 diverse transactions
- **Custom Hook**: `useWallet` for clean UI/logic separation
- **Tests**: 18 tests covering store, utils, and components
- **Performance**: Optimized with FlatList, prevented duplicate calls

**Quick Start**: `./scripts/verify-wallet.sh`

### ✅ Infrastructure

- TypeScript strict mode (no `any` allowed)
- Path aliases (`@/`) configured in Babel, Metro, and TypeScript
- Feature-based architecture
- Centralized theme system
- Reusable components (Input, Button, BalanceCard, TransactionItem, TransactionList)
- Development rules documented in `.ai/rules.md`
- Automated testing with Jest & React Native Testing Library

### ✅ Plan 05: Native Contacts Module (Completed)

- **Custom Native Module**: Legacy Bridge implementation for iOS & Android
- **Contact Picker**: Modal with search, FlatList optimization, avatar initials
- **Permission Handling**: Runtime permission requests with graceful fallback
- **Service Layer**: `ContactsService` abstraction over NativeModules
- **Custom Hook**: `useContacts` for state management (contacts, loading, error, permissions)
- **Fallback Support**: Manual input always available if permission denied
- **Performance**: Limited to 100 contacts, local search, deduplication
- **Tests**: Unit tests for service and hook with mocked NativeModules
- **Documentation**: Complete setup guide in `NATIVE_MODULE_SETUP.md`

**⚠️ iOS Setup Required**: See `NATIVE_MODULE_SETUP.md` for Xcode configuration

### 🚧 Upcoming Features

- Plan 04: Transaction Flow & Validations (In Progress)

## Development

### Architecture

The app follows a **feature-based architecture** where each domain is self-contained:

```
features/
  auth/
    screens/      # LoginScreen
    hooks/        # useLogin
  wallet/
    screens/      # HomeScreen
  transactions/
    screens/      # (upcoming)
```

**Benefits**:
- Scalability: Features grow independently
- Maintainability: Changes are localized
- Clarity: Structure reflects business domains

### Development Rules

All code must follow the rules in `.ai/rules.md`:
- ❌ No `any` types
- ❌ No inline styles
- ❌ No relative paths
- ✅ Use `@/` aliases
- ✅ StyleSheet.create() in `.styles.ts` files
- ✅ Validations in services/hooks, not just UI
- ✅ Props typed with interfaces

### Theme

Centralized in `src/theme/Theme.ts`:
- **Colors**: primary, secondary, success, error, backgrounds, text
- **Spacing**: xs (4) → xxl (48)
- **Typography**: h1-h4, body, caption, button
- **Border Radius**: sm → full
- **Shadows**: sm, md, lg

### State Management

**Zustand** stores with TypeScript:
- `authStore`: User session, login/logout
- `walletStore`: Balance, transactions, fetch/refresh actions
- Persist middleware for AsyncStorage (authStore)
- Optimized selectors to prevent re-renders
- Separate loading states (initial vs refresh)

### Components

**Reusable UI Components**:
- `Input`: Labeled input with validation, icons, error states
- `Button`: Variants (primary, secondary, outline, ghost), sizes, loading state

### Mock Data

#### Test Users

Each user has a different balance to test various scenarios:

| Usuario | Email | Teléfono | Balance |
|---------|-------|----------|---------|
| **Juan Pérez** | `juan@example.com` | `+52 55 1234 5678` | **$5,835.01** |
| **María García** | `maria@example.com` | `+52 55 8765 4321` | **$12,500.00** |
| **Carlos López** | `carlos@example.com` | `+52 55 5555 5555` | **$7,500.50** |

**Usuario Demo**: Si ingresas con cualquier otro email o teléfono válido, se creará un usuario demo con un balance de **$10,000.00**.

**Nota**: Los balances se almacenan internamente en centavos para precisión, y se convierten a pesos para el UI.

## License

Private project
