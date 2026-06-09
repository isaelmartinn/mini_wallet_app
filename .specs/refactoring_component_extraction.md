# Refactoring: Component Extraction

## Context

During code review, a pattern of `render*` functions returning JSX was identified that could be extracted as independent components, following the same pattern applied in `ContactPicker`.

## Pattern Applied in ContactPicker

### ✅ Completed

1. **`renderPermissionDeniedState`** → `PermissionDeniedState`
   - Location: `src/components/ContactPicker/components/PermissionDeniedState/`
   - Files: `.tsx`, `.styles.ts`, `.test.tsx`, `index.ts`

2. **`renderContactItem`** → `ContactItem`
   - Location: `src/components/ContactPicker/components/ContactItem/`
   - Files: `.tsx`, `.styles.ts`, `.test.tsx`, `index.ts`

## Component Candidates for Extraction

### 1. TransactionList - Empty and Error States

**File:** `src/features/wallet/screens/HomeScreen/components/TransactionList/TransactionList.tsx`

**Inline components found:**

#### a) `EmptyState` (lines 17-23)
```tsx
const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>💳</Text>
    <Text style={styles.emptyTitle}>No hay transacciones</Text>
    <Text style={styles.emptyText}>Tus movimientos aparecerán aquí</Text>
  </View>
);
```

**Suggested action:**
- ✅ **Already a separate component** within the same file
- ⚠️ **Could be improved:** Move it to its own folder following the pattern
- Proposed location: `src/features/wallet/screens/HomeScreen/components/TransactionList/components/EmptyState/`

#### b) `ErrorState` (lines 25-32)
```tsx
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Error al cargar transacciones</Text>
    <Text style={styles.errorText}>No pudimos cargar tus movimientos</Text>
    <Button title="Reintentar" onPress={onRetry} variant="outline" />
  </View>
);
```

**Suggested action:**
- ✅ **Already a separate component** within the same file
- ⚠️ **Could be improved:** Move it to its own folder following the pattern
- Proposed location: `src/features/wallet/screens/HomeScreen/components/TransactionList/components/ErrorState/`

---

### 2. ResultScreen - getErrorIcon Function

**File:** `src/features/transactions/screens/ResultScreen/ResultScreen.tsx`

**Function found (lines 128-139):**
```tsx
const getErrorIcon = (): JSX.Element => {
  switch (result.errorType) {
    case TransactionErrorType.INSUFFICIENT_FUNDS:
      return <AlertCircle size={80} color={Theme.colors.error} />;
    case TransactionErrorType.NETWORK_ERROR:
      return <WifiOff size={80} color={Theme.colors.error} />;
    case TransactionErrorType.TIMEOUT:
      return <Clock size={80} color={Theme.colors.warning} />;
    default:
      return <XCircle size={80} color={Theme.colors.error} />;
  }
};
```

**Suggested action:**
- ⚠️ **DO NOT extract as separate component**
- **Reason:** It's a simple helper function that returns icons based on error type
- **Alternative:** Could be a helper/utility if reused elsewhere
- If extracted: `src/features/transactions/components/ErrorIcon/ErrorIcon.tsx`

---

### 3. ResultScreen - Success and Error States

**File:** `src/features/transactions/screens/ResultScreen/ResultScreen.tsx`

#### a) Success State (lines 84-125)
```tsx
if (result.success) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Theme.colors.success} />
        </View>
        <Text style={styles.title}>¡Transacción exitosa!</Text>
        {/* ... más contenido ... */}
      </View>
    </SafeAreaView>
  );
}
```

**Suggested action:**
- ✅ **Extract as component**
- Name: `TransactionSuccess`
- Location: `src/features/transactions/screens/ResultScreen/components/TransactionSuccess/`
- Props: `{ transactionId: string; recipientName: string; amount: number; onGoHome: () => void; onNewTransaction: () => void }`

#### b) Error State (lines 145-169)
```tsx
return (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.iconContainer}>{getErrorIcon()}</View>
      <Text style={styles.title}>Transacción fallida</Text>
      {/* ... más contenido ... */}
    </View>
  </SafeAreaView>
);
```

**Suggested action:**
- ✅ **Extract as component**
- Name: `TransactionError`
- Location: `src/features/transactions/screens/ResultScreen/components/TransactionError/`
- Props: `{ errorType: TransactionErrorType; errorMessage: string; canRetry: boolean; isProcessing: boolean; onRetry: () => void; onGoHome: () => void }`

---

### 4. ContactPicker - renderEmptyState

**File:** `src/components/ContactPicker/ContactPicker.tsx`

**Function found (lines 94-132):**
```tsx
const renderEmptyState = (): React.ReactElement => {
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.emptyText}>Cargando contactos...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <PermissionDeniedState
        canAskAgain={canAskAgain}
        onOpenSettings={handleOpenSettings}
        onManualEntry={handleManualEntry}
      />
    );
  }

  if (searchQuery && filteredContacts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No se encontraron contactos</Text>
      </View>
    );
  }

  if (contacts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay contactos disponibles</Text>
      </View>
    );
  }

  return <></>;
};
```

**Suggested action:**
- ⚠️ **DO NOT extract completely**
- **Reason:** It's a conditional logic function that orchestrates different states
- **Alternative:** Extract individual states:
  - `LoadingState` → `src/components/ContactPicker/components/LoadingState/`
  - `NoResultsState` → `src/components/ContactPicker/components/NoResultsState/`
  - `NoContactsState` → `src/components/ContactPicker/components/NoContactsState/`

---

### 5. RecipientScreen - Contacts Button

**File:** `src/features/transactions/screens/RecipientScreen/RecipientScreen.tsx`

**Inline code (lines 118-127):**
```tsx
{isContactsAvailable && (
  <TouchableOpacity
    style={styles.contactButton}
    onPress={handleOpenContactPicker}
    activeOpacity={0.7}>
    <Text style={styles.contactButtonText}>
      📱 Seleccionar de contactos
    </Text>
  </TouchableOpacity>
)}
```

**Suggested action:**
- ⚠️ **DO NOT extract**
- **Reason:** Too simple (single button with text)
- **Alternative:** If reused, use `Button` component with custom variant

---

## Summary of Recommended Actions

### High Priority (Extract)
1. ✅ `ResultScreen` → `TransactionSuccess` component
2. ✅ `ResultScreen` → `TransactionError` component
3. ✅ `ContactPicker` → `LoadingState` component
4. ✅ `ContactPicker` → `NoResultsState` component
5. ✅ `ContactPicker` → `NoContactsState` component

### Medium Priority (Improve existing structure)
6. ⚠️ `TransactionList` → Move `EmptyState` to separate folder
7. ⚠️ `TransactionList` → Move `ErrorState` to separate folder

### Low Priority (Keep as is)
8. ❌ `ResultScreen.getErrorIcon` → Keep as helper function
9. ❌ `RecipientScreen` contacts button → Too simple

---

## Proposed Folder Structure

```
src/
├── components/
│   └── ContactPicker/
│       ├── components/
│       │   ├── ContactItem/
│       │   ├── PermissionDeniedState/
│       │   ├── LoadingState/          ← NEW
│       │   ├── NoResultsState/        ← NEW
│       │   └── NoContactsState/       ← NEW
│       ├── ContactPicker.tsx
│       └── ContactPicker.styles.ts
│
└── features/
    ├── transactions/
    │   └── screens/
    │       └── ResultScreen/
    │           ├── components/
    │           │   ├── TransactionSuccess/  ← NEW
    │           │   └── TransactionError/    ← NEW
    │           ├── ResultScreen.tsx
    │           └── ResultScreen.styles.ts
    │
    └── wallet/
        └── screens/
            └── HomeScreen/
                └── components/
                    └── TransactionList/
                        ├── components/
                        │   ├── EmptyState/    ← MOVE
                        │   └── ErrorState/    ← MOVE
                        ├── TransactionList.tsx
                        └── TransactionList.styles.ts
```

---

## Criteria for Component Extraction

### ✅ Extract when:
1. JSX code has more than 15-20 lines
2. Has its own presentation logic
3. Could be reusable in the future
4. Improves parent component readability
5. Has multiple elements and its own styles

### ❌ DO NOT extract when:
1. It's a simple element (< 10 lines)
2. It's only conditional logic without complex JSX
3. It's tightly coupled to the parent component
4. It's a helper function that returns primitives or simple icons
5. Extraction doesn't improve readability

---

## Additional Notes

- All extracted components must follow `.ai/rules.md` rules
- Each component must have its test file
- Styles must be in separate `.styles.ts` files
- Use TypeScript with strict types (no `any`)
- Include `index.ts` file for clean exports
