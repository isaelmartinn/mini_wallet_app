# Plan 01: Project Setup & Architecture

This plan covers the initial configuration of the Mini Wallet App repository, ensuring a solid foundation for scalability and maintainability.

## Context & Objectives
Initialize the React Native project with TypeScript, configure the core directory structure, and set up the foundational libraries: React Navigation and Zustand.

## Architecture & Design
- **Pattern**: Feature-based folder structure (modular).
- **State Management**: Zustand (Atomic stores).
- **Navigation**: React Navigation (Stack & Tab).
- **Styling**: Standard StyleSheet or Tailwind (NativeWind) for speed and consistency. Let's stick to standard `StyleSheet` + a `Theme` provider for simplicity as requested.

## Folder Structure
```text
src/
  api/          # Mock services
  assets/       # Images, fonts
  components/   # Reusable UI components (Atom/Molecule)
  features/     # Module-specific logic and screens
    auth/
    wallet/
    transactions/
  hooks/        # Global custom hooks
  navigation/   # Navigators and route definitions
  store/        # Zustand stores
  theme/        # Colors, spacing, typography
  utils/        # Helpers, constants, validations
```

## Implementation Steps

### 1. Project Initialization
- Initialize React Native project with TypeScript.
- **Use Yarn as package manager** (configured in package.json).
- Clean up default boilerplate.
- Install core dependencies:
  - `react-navigation` (native, stack)
  - `zustand`
  - `lucide-react-native` (for icons)
  - `react-native-safe-area-context`
  - `react-native-screens`

### 2. Basic Infrastructure
- Create the folder structure defined above.
- Implement a basic `Theme.ts` with the app's color palette (Primary, Secondary, Success, Error).
- Create a `MainNavigator` with an initial `Splash` or `Loading` screen.

### 3. Zustand Store Setup
- Create a basic `useAppStore` for global app state (loading, errors).

### 4. Testing Setup
- Configure `Jest` and `react-native-testing-library`.
- Create a sample test to verify the setup.

## Acceptance Criteria
- [ ] Project compiles and runs on iOS/Android.
- [ ] Navigation works between at least two dummy screens.
- [ ] Zustand store is accessible from a component.
- [ ] `npm test` runs successfully.

## Tools & Recommended Guides
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Zustand Docs](https://github.com/pmndrs/zustand)
