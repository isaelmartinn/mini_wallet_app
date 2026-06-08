# Plan 04: Transaction Flow & Validations

This plan implements the core business logic of sending money.

## Context & Objectives
Implement a multi-step flow to send money: Amount -> Recipient (Manual) -> Summary -> Result.

## Implementation Steps

### 1. Transaction Flow State
- Use a local state or a temporary Zustand store `useTransactionFlowStore` to keep track of the current transfer details before confirmation.

### 2. Amount Screen
- Input for the amount.
- **Validation**: 
  - Cannot be <= 0.
  - Cannot exceed available balance (cross-reference `useWalletStore`).
- Numerical keypad optimization.

### 3. Recipient Screen (Manual)
- Form to enter recipient details (Name, Account/Phone).
- **Validation**: Required fields.

### 4. Summary & Confirmation
- Review screen showing: Amount, Recipient, and Fee (optional/0).
- "Confirm" button that triggers the simulated transaction.

### 5. Transaction Result (The "Chaos" Screen)
- Simulate different outcomes randomly:
  - **Success**: Update balance in store, show receipt.
  - **Error (Insufficient Funds)**: Show descriptive error.
  - **Error (Network/Timeout)**: Show retry option.
  - **Error (General)**: Fallback error UI.

## Acceptance Criteria
- [ ] User cannot proceed with invalid amounts.
- [ ] User cannot send more than their balance.
- [ ] Confirmation screen accurately reflects inputs.
- [ ] Successful transactions are added to the history list on Home.
- [ ] All error scenarios are reachable and handled gracefully.

## Business Rules
- `MIN_AMOUNT = 1`
- `MAX_AMOUNT = currentBalance`
- Recipient must have a name > 3 characters.
