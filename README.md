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

- ✅ TypeScript configuration
- ✅ React Navigation setup (Stack Navigator)
- ✅ Zustand state management
- ✅ Theme system with colors, spacing, and typography
- ✅ Feature-based folder structure
- ✅ Jest and Testing Library configuration
- ✅ ESLint and Prettier setup

## Development

The app follows a feature-based architecture where each feature module contains its own screens, components, and logic. Global utilities, hooks, and stores are kept in their respective directories.

### Theme

The theme is centralized in `src/theme/Theme.ts` and includes:
- Color palette (primary, secondary, success, error, etc.)
- Spacing scale
- Typography styles
- Border radius values
- Shadow presets

### State Management

Zustand stores are located in `src/store/`. The main app store (`useAppStore`) manages global state like loading and error states.

## License

Private project
