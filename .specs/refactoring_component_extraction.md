# Refactoring: Extracción de Componentes

## Contexto

Durante la revisión del código se identificó el patrón de funciones `render*` que retornan JSX y que podrían ser extraídas como componentes independientes, siguiendo el mismo patrón aplicado en `ContactPicker`.

## Patrón Aplicado en ContactPicker

### ✅ Completado

1. **`renderPermissionDeniedState`** → `PermissionDeniedState`
   - Ubicación: `src/components/ContactPicker/components/PermissionDeniedState/`
   - Archivos: `.tsx`, `.styles.ts`, `.test.tsx`, `index.ts`

2. **`renderContactItem`** → `ContactItem`
   - Ubicación: `src/components/ContactPicker/components/ContactItem/`
   - Archivos: `.tsx`, `.styles.ts`, `.test.tsx`, `index.ts`

## Componentes Candidatos para Extracción

### 1. TransactionList - Estados Vacíos y de Error

**Archivo:** `src/features/wallet/screens/HomeScreen/components/TransactionList/TransactionList.tsx`

**Componentes inline encontrados:**

#### a) `EmptyState` (líneas 17-23)
```tsx
const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>💳</Text>
    <Text style={styles.emptyTitle}>No hay transacciones</Text>
    <Text style={styles.emptyText}>Tus movimientos aparecerán aquí</Text>
  </View>
);
```

**Acción sugerida:**
- ✅ **Ya es un componente separado** dentro del mismo archivo
- ⚠️ **Podría mejorarse:** Moverlo a su propia carpeta siguiendo el patrón
- Ubicación propuesta: `src/features/wallet/screens/HomeScreen/components/TransactionList/components/EmptyState/`

#### b) `ErrorState` (líneas 25-32)
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

**Acción sugerida:**
- ✅ **Ya es un componente separado** dentro del mismo archivo
- ⚠️ **Podría mejorarse:** Moverlo a su propia carpeta siguiendo el patrón
- Ubicación propuesta: `src/features/wallet/screens/HomeScreen/components/TransactionList/components/ErrorState/`

---

### 2. ResultScreen - Función getErrorIcon

**Archivo:** `src/features/transactions/screens/ResultScreen/ResultScreen.tsx`

**Función encontrada (líneas 128-139):**
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

**Acción sugerida:**
- ⚠️ **NO extraer como componente separado**
- **Razón:** Es una función helper simple que retorna iconos basados en tipo de error
- **Alternativa:** Podría ser un helper/utility si se reutiliza en otros lugares
- Si se extrae: `src/features/transactions/components/ErrorIcon/ErrorIcon.tsx`

---

### 3. ResultScreen - Estados de Éxito y Error

**Archivo:** `src/features/transactions/screens/ResultScreen/ResultScreen.tsx`

#### a) Estado de Éxito (líneas 84-125)
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

**Acción sugerida:**
- ✅ **Extraer como componente**
- Nombre: `TransactionSuccess`
- Ubicación: `src/features/transactions/screens/ResultScreen/components/TransactionSuccess/`
- Props: `{ transactionId: string; recipientName: string; amount: number; onGoHome: () => void; onNewTransaction: () => void }`

#### b) Estado de Error (líneas 145-169)
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

**Acción sugerida:**
- ✅ **Extraer como componente**
- Nombre: `TransactionError`
- Ubicación: `src/features/transactions/screens/ResultScreen/components/TransactionError/`
- Props: `{ errorType: TransactionErrorType; errorMessage: string; canRetry: boolean; isProcessing: boolean; onRetry: () => void; onGoHome: () => void }`

---

### 4. ContactPicker - renderEmptyState

**Archivo:** `src/components/ContactPicker/ContactPicker.tsx`

**Función encontrada (líneas 94-132):**
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

**Acción sugerida:**
- ⚠️ **NO extraer completamente**
- **Razón:** Es una función de lógica condicional que orquesta diferentes estados
- **Alternativa:** Extraer los estados individuales:
  - `LoadingState` → `src/components/ContactPicker/components/LoadingState/`
  - `NoResultsState` → `src/components/ContactPicker/components/NoResultsState/`
  - `NoContactsState` → `src/components/ContactPicker/components/NoContactsState/`

---

### 5. RecipientScreen - Botón de Contactos

**Archivo:** `src/features/transactions/screens/RecipientScreen/RecipientScreen.tsx`

**Código inline (líneas 118-127):**
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

**Acción sugerida:**
- ⚠️ **NO extraer**
- **Razón:** Es demasiado simple (un solo botón con texto)
- **Alternativa:** Si se reutiliza, usar el componente `Button` con variante personalizada

---

## Resumen de Acciones Recomendadas

### Alta Prioridad (Extraer)
1. ✅ `ResultScreen` → `TransactionSuccess` component
2. ✅ `ResultScreen` → `TransactionError` component
3. ✅ `ContactPicker` → `LoadingState` component
4. ✅ `ContactPicker` → `NoResultsState` component
5. ✅ `ContactPicker` → `NoContactsState` component

### Media Prioridad (Mejorar estructura existente)
6. ⚠️ `TransactionList` → Mover `EmptyState` a carpeta separada
7. ⚠️ `TransactionList` → Mover `ErrorState` a carpeta separada

### Baja Prioridad (Mantener como está)
8. ❌ `ResultScreen.getErrorIcon` → Mantener como función helper
9. ❌ `RecipientScreen` botón de contactos → Demasiado simple

---

## Estructura de Carpetas Propuesta

```
src/
├── components/
│   └── ContactPicker/
│       ├── components/
│       │   ├── ContactItem/
│       │   ├── PermissionDeniedState/
│       │   ├── LoadingState/          ← NUEVO
│       │   ├── NoResultsState/        ← NUEVO
│       │   └── NoContactsState/       ← NUEVO
│       ├── ContactPicker.tsx
│       └── ContactPicker.styles.ts
│
└── features/
    ├── transactions/
    │   └── screens/
    │       └── ResultScreen/
    │           ├── components/
    │           │   ├── TransactionSuccess/  ← NUEVO
    │           │   └── TransactionError/    ← NUEVO
    │           ├── ResultScreen.tsx
    │           └── ResultScreen.styles.ts
    │
    └── wallet/
        └── screens/
            └── HomeScreen/
                └── components/
                    └── TransactionList/
                        ├── components/
                        │   ├── EmptyState/    ← MOVER
                        │   └── ErrorState/    ← MOVER
                        ├── TransactionList.tsx
                        └── TransactionList.styles.ts
```

---

## Criterios para Extracción de Componentes

### ✅ Extraer cuando:
1. El código JSX tiene más de 15-20 líneas
2. Tiene su propia lógica de presentación
3. Podría ser reutilizable en el futuro
4. Mejora la legibilidad del componente padre
5. Tiene múltiples elementos y estilos propios

### ❌ NO extraer cuando:
1. Es un elemento simple (< 10 líneas)
2. Es solo lógica condicional sin JSX complejo
3. Está fuertemente acoplado al componente padre
4. Es una función helper que retorna primitivos o iconos simples
5. La extracción no mejora la legibilidad

---

## Notas Adicionales

- Todos los componentes extraídos deben seguir las reglas de `.ai/rules.md`
- Cada componente debe tener su archivo de tests
- Los estilos deben estar en archivos `.styles.ts` separados
- Usar TypeScript con tipos estrictos (no `any`)
- Incluir archivo `index.ts` para exports limpios
