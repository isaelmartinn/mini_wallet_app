# Quick Start Guide - Mini Wallet App

## Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18 installed
- **Yarn** 1.22+ installed (`npm install -g yarn`)
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS: `sudo gem install cocoapods`)

## Initial Setup

### 1. Dependencies are already installed ✅

The project dependencies have been installed. If you need to reinstall:

```bash
yarn install
```

### 2. Install iOS Pods (macOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Start Metro Bundler

```bash
yarn start
```

### 4. Run the App

In a new terminal:

**For iOS:**
```bash
yarn ios
```

**For Android:**
```bash
yarn android
```

## Available Scripts

```bash
# Start Metro bundler
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator/device
yarn android

# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run linter
yarn lint
```

## Project Structure Overview

```
src/
  ├── features/     # Feature modules (auth, wallet, transactions)
  ├── navigation/   # React Navigation setup
  ├── store/        # Zustand state management
  ├── theme/        # Design system (colors, spacing, typography)
  ├── components/   # Reusable UI components
  ├── api/          # API calls and mock services
  ├── hooks/        # Custom React hooks
  ├── utils/        # Helper functions
  └── App.tsx       # Root component
```

## Current Features (Plan 02 Completed)

### Authentication & Session
- ✅ Login screen with email/phone validation
- ✅ Session persistence with AsyncStorage
- ✅ Navigation guard (AuthStack vs AppStack)
- ✅ Mock authentication API
- ✅ Logout functionality

### Infrastructure
- ✅ TypeScript strict mode (no `any`)
- ✅ Path aliases (`@/`) configured
- ✅ React Navigation setup
- ✅ Zustand with persist middleware
- ✅ Centralized theme system
- ✅ Reusable components (Input, Button)
- ✅ Development rules in `.ai/rules.md`
- ✅ Jest testing setup
- ✅ ESLint + Prettier

## Testing the App

### Login Flow
1. Run the app
2. You'll see the Login screen
3. Enter any of these test credentials:
   - `juan@example.com` or `+52 55 1234 5678`
   - `maria@example.com` or `+52 55 8765 4321`
   - Or any valid email/phone format
4. Tap "Iniciar Sesión"
5. You'll be redirected to Home screen
6. Session persists on app reload
7. Tap "Cerrar Sesión" to logout

## Next Steps

1. **Test authentication flow** with different credentials
2. **Verify session persistence** by reloading the app
3. **Review code structure** in `src/features/auth/`
4. **Check development rules** in `.ai/rules.md`
5. **Implement Plan 03**: Wallet & Balance Display

## Troubleshooting

### iOS Build Issues

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
```

### Metro Cache Issues

```bash
yarn start --reset-cache
```

## Documentation

- Full documentation: `README.md`
- Implementation details: `.specs/IMPLEMENTATION_SUMMARY.md`
- Original plan: `.specs/01_setup_and_architecture.md`

## Support

For React Native issues, refer to:
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
