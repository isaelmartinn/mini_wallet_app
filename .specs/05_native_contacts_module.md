# Plan 05: Native Contacts Module (Bonus)

This plan covers the integration with native device APIs.

## Context & Objectives
Create a custom Native Module to fetch device contacts and integrate it into the transaction flow.

## Architecture
- **Choice**: TurboModules (New Architecture) or Legacy Native Module (Bridge). 
- **Recommendation**: Use **TurboModules** if the RN version supports it easily, otherwise use the **Legacy Bridge** for maximum compatibility and simpler demonstration of the bridge logic. 
- **Abstraction**: Create a `NativeContacts` wrapper in TypeScript to decouple the UI from the native implementation.

## Implementation Steps

### 1. Android Implementation (Kotlin/Java)
- Create `ContactsModule.kt`.
- Implement `getContacts()` method using `ContentResolver`.
- Handle `READ_CONTACTS` permission.

### 2. iOS Implementation (Swift/Obj-C)
- Create `ContactsModule.swift`.
- Use `CNContactStore` to fetch names and numbers.
- Handle privacy permissions in `Info.plist`.

### 3. TypeScript Abstraction
- Define an interface `Contact { name: string, phoneNumber: string }`.
- Create a `ContactsService.ts` that handles:
  - Permission requests.
  - Native module calls.
  - Mapping native data to the app's `Contact` type.

### 4. UI Integration (Fallback)
- Update the Recipient screen to allow "Pick from Contacts".
- If permission is denied or module fails, ensure the manual input fallback remains functional.

## Acceptance Criteria
- [ ] Contacts are fetched and displayed in a list.
- [ ] Permission denial does not crash the app.
- [ ] Selecting a contact populates the recipient details in the transaction flow.
- [ ] Works on both iOS and Android.

## Risks & Mitigations
- **Risk**: Large number of contacts causing performance issues.
- **Mitigation**: Limit the initial fetch or implement basic search/filtering at the native level or bridge level.
