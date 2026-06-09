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

### Code Quality

```bash
# Run ESLint
yarn lint

# Run ESLint and auto-fix issues
yarn lint:fix

# Format code with Prettier
yarn format

# Check code formatting without modifying files
yarn format:check
```

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

### Mock Data

#### Test Users

Each user has a different balance to test various scenarios:

| User | Email | Phone | Balance |
|---------|-------|----------|---------|
| **Juan Pérez** | `juan@example.com` | `+52 55 1234 5678` | **$5,835.01** |
| **María García** | `maria@example.com` | `+52 55 8765 4321` | **$12,500.00** |
| **Carlos López** | `carlos@example.com` | `+52 55 5555 5555` | **$7,500.50** |

**Demo User**: If you log in with any other valid email or phone number, a demo user will be created with a balance of **$10,000.00**.

**Note**: Balances are stored internally in cents for precision and converted to pesos for the UI.

### Time Invested

This project required all Friday afternoon, a few hours on Saturday night, Sunday afternoon, and Monday afternoon to fine-tune the details.
