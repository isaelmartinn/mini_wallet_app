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

### ✅ Infrastructure

- TypeScript strict mode (no `any` allowed)
- Path aliases (`@/`) configured in Babel, Metro, and TypeScript
- Feature-based architecture
- Centralized theme system
- Reusable components (Input, Button)
- Development rules documented in `.ai/rules.md`

### 🚧 Upcoming Features

- Plan 03: Wallet & Balance Display
- Plan 04: Transactions & Transfers
- Plan 05: Native Contacts Module (Bonus)

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
- Persist middleware for AsyncStorage
- Optimized selectors to prevent re-renders

### Components

**Reusable UI Components**:
- `Input`: Labeled input with validation, icons, error states
- `Button`: Variants (primary, secondary, outline, ghost), sizes, loading state

### Mock Data

Test credentials in `src/utils/constants.ts`:
- `juan@example.com` / `+52 55 1234 5678`
- `maria@example.com` / `+52 55 8765 4321`
- `carlos@example.com` / `+52 55 5555 5555`

Or use any valid email/phone format for demo user.

## License

Private project
