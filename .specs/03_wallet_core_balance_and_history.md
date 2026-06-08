# Plan 03: Wallet Core (Balance & History)

This plan covers the main dashboard where users see their financial status.

## Context & Objectives
Display the current balance and a list of recent transactions.

## Implementation Steps

### 1. Wallet Store (Zustand)
- Implement `useWalletStore` to manage:
  - `balance`: Numeric value.
  - `transactions`: Array of transaction objects (id, amount, date, description, type: 'in'|'out').
  - `fetchWalletData()`: Action to populate data from mock API.

### 2. Mock Data Service
- Create `src/api/wallet.ts` to return mock balance and transaction history.
- Ensure diversity in data (different amounts, dates, and statuses).

### 3. Home Screen Components
- **Balance Card**: A prominent card showing the total balance.
- **Transaction Item**: A list item component for individual transactions with icons (up/down arrow).
- **Transaction List**: A `FlatList` with pull-to-refresh functionality.

### 4. Empty & Error States
- Handle cases where there are no transactions.
- Simulate and handle API errors with a "Retry" button.

## Acceptance Criteria
- [ ] Balance is displayed correctly with currency formatting.
- [ ] Recent transactions are listed chronologically.
- [ ] Pull-to-refresh works to "update" data.
- [ ] List is scrollable and performance is optimized.

## Design Notes
- Use a clean financial UI style (e.g., Apple Wallet or Revolut style).
- Ensure high contrast for balance readability.
