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

## Current Features

- ✅ TypeScript setup
- ✅ React Navigation (Stack Navigator)
- ✅ Zustand state management
- ✅ Theme system with colors and typography
- ✅ Two example screens (Splash, Wallet)
- ✅ Jest testing setup
- ✅ ESLint + Prettier

## Next Steps

1. **Run the app** to verify everything works
2. **Explore the code** in `src/` directory
3. **Add new features** following the feature-based structure
4. **Write tests** for new components in `__tests__/` directories

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
