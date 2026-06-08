# Plan de Implementación: Timeout en AmountScreen

## 📋 Metadata
- **Feature**: Transaction Timeout
- **Screen**: `AmountScreen.tsx`
- **Timeout**: 60 segundos (1 minuto)
- **Prioridad**: Alta
- **Complejidad**: Media

---

## 🎯 Objetivo
Implementar un sistema de timeout que redirija al usuario a una pantalla de timeout si permanece inactivo durante 60 segundos en la pantalla de ingreso de monto (`AmountScreen`).

---

## 🏗️ Arquitectura

### Componentes a Crear/Modificar

1. **`TimeoutScreen.tsx`** (NUEVO)
   - Pantalla de destino cuando ocurre timeout
   - Ubicación: `src/features/transactions/screens/TimeoutScreen.tsx`

2. **`TimeoutScreen.styles.ts`** (NUEVO)
   - Estilos de la pantalla de timeout
   - Ubicación: `src/features/transactions/screens/TimeoutScreen.styles.ts`

3. **`useInactivityTimeout.ts`** (NUEVO)
   - Hook personalizado para manejar lógica de timeout
   - Ubicación: `src/features/transactions/hooks/useInactivityTimeout.ts`

4. **`AmountScreen.tsx`** (MODIFICAR)
   - Integrar hook de timeout
   - Detectar actividad del usuario

5. **`types.ts`** (MODIFICAR)
   - Agregar tipos relacionados con timeout

6. **Navigation Stack** (MODIFICAR)
   - Agregar ruta de TimeoutScreen

---

## 📐 Diseño Técnico

### 1. Hook `useInactivityTimeout`

**Responsabilidades:**
- Iniciar timer de 60 segundos
- Resetear timer en cada interacción del usuario
- Ejecutar callback cuando expire el tiempo
- Limpiar timers al desmontar

**Interfaz:**
```typescript
interface UseInactivityTimeoutParams {
  timeoutMs: number;
  onTimeout: () => void;
  enabled?: boolean;
}

interface UseInactivityTimeoutReturn {
  resetTimer: () => void;
  remainingTime: number;
  isActive: boolean;
}
```

**Eventos que resetean el timer:**
- `onChangeText` en Input
- `onPress` en Button
- Interacción con teclado
- Touch en pantalla

**Implementación:**
- Usar `useRef` para almacenar referencia del timer
- Usar `useState` para tracking de tiempo restante (opcional)
- Usar `useEffect` para iniciar/limpiar timer
- Usar `useCallback` para función de reset

---

### 2. Pantalla `TimeoutScreen`

**Elementos UI:**
- Icono de reloj/timeout
- Título: "Tiempo agotado"
- Mensaje descriptivo: "La sesión ha expirado por inactividad"
- Botón primario: "Intentar de nuevo" → Navega a AmountScreen
- Botón secundario: "Volver al inicio" → Navega a Home/Wallet

**Estados:**
- No requiere estados complejos
- Navegación simple con botones

**Props:**
```typescript
interface TimeoutScreenProps {
  navigation: StackNavigationProp<TransactionStackParamList>;
}
```

---

### 3. Modificaciones en `AmountScreen`

**Cambios necesarios:**

1. Importar hook `useInactivityTimeout`
2. Configurar timeout de 60000ms (60 segundos)
3. Callback `onTimeout` navega a TimeoutScreen
4. Llamar `resetTimer()` en:
   - `handleAmountChange`
   - `handleContinue`
   - Eventos de teclado (opcional)

**Pseudocódigo:**
```typescript
const { resetTimer } = useInactivityTimeout({
  timeoutMs: 60000,
  onTimeout: () => {
    navigation.replace('Timeout');
  },
  enabled: true,
});

// En handleAmountChange
const handleAmountChange = (text: string): void => {
  resetTimer(); // <-- AGREGAR
  // ... resto de lógica
};

// En handleContinue
const handleContinue = (): void => {
  resetTimer(); // <-- AGREGAR
  // ... resto de lógica
};
```

---

### 4. Actualización de Tipos

**Archivo: `src/features/transactions/types.ts`**

Agregar:
```typescript
export interface InactivityTimeoutConfig {
  timeoutMs: number;
  enabled: boolean;
}

export type TimeoutReason = 'inactivity' | 'session_expired';
```

---

### 5. Navegación

**Archivo a modificar:** `src/navigation/TransactionStack.tsx` (o equivalente)

Agregar ruta:
```typescript
<Stack.Screen 
  name="Timeout" 
  component={TimeoutScreen}
  options={{
    headerShown: false,
    gestureEnabled: false, // Prevenir swipe back
  }}
/>
```

**Tipo de navegación:**
```typescript
export type TransactionStackParamList = {
  Amount: undefined;
  Recipient: undefined;
  Summary: undefined;
  Result: undefined;
  Timeout: undefined; // <-- AGREGAR
};
```

---

## 🔄 Flujo de Usuario

```
[AmountScreen]
    ↓ (usuario inactivo 60s)
[TimeoutScreen]
    ↓ (tap "Intentar de nuevo")
[AmountScreen] (limpio, sin datos previos)
    ↓ (tap "Volver al inicio")
[WalletScreen/Home]
```

---

## ✅ Criterios de Aceptación

### Funcionales
- [ ] Timer inicia automáticamente al entrar a AmountScreen
- [ ] Timer se resetea cuando usuario escribe en input
- [ ] Timer se resetea cuando usuario presiona botón
- [ ] Después de 60s de inactividad, navega a TimeoutScreen
- [ ] TimeoutScreen muestra mensaje claro
- [ ] Botón "Intentar de nuevo" limpia estado y vuelve a AmountScreen
- [ ] Botón "Volver al inicio" navega a pantalla principal
- [ ] Timer se limpia al salir de AmountScreen (cleanup)

### No Funcionales
- [ ] No usar tipo `any`
- [ ] Estilos en archivo `.styles.ts` separado
- [ ] Imports con alias `@/`
- [ ] Props tipadas con interfaces
- [ ] Hook reutilizable y testeable
- [ ] Manejo de cleanup en useEffect

---

## 🧪 Plan de Pruebas

### Tests Unitarios

**Hook `useInactivityTimeout`:**
- [ ] Timer inicia correctamente
- [ ] `resetTimer()` reinicia el contador
- [ ] Callback `onTimeout` se ejecuta después de timeout
- [ ] Timer se limpia al desmontar
- [ ] Timer no inicia si `enabled: false`
- [ ] Timer se limpia cuando `enabled` cambia a false
- [ ] Múltiples llamadas a `resetTimer()` funcionan correctamente

**TimeoutScreen (NUEVO):**
- [ ] Renderiza correctamente todos los elementos UI
- [ ] Muestra título "Tiempo agotado"
- [ ] Muestra mensaje descriptivo de inactividad
- [ ] Renderiza botón "Intentar de nuevo"
- [ ] Renderiza botón "Volver al inicio"
- [ ] Botón "Intentar de nuevo" navega a AmountScreen
- [ ] Botón "Volver al inicio" navega a pantalla principal
- [ ] Navegación usa `replace` en lugar de `navigate`
- [ ] Store de transacción se resetea al navegar
- [ ] Props de navegación están correctamente tipadas

**AmountScreen (AJUSTES):**
- [ ] Hook de timeout se inicializa correctamente
- [ ] `resetTimer` se llama en `handleAmountChange`
- [ ] `resetTimer` se llama en `handleContinue`
- [ ] Timer se limpia al desmontar componente
- [ ] Navegación a Timeout usa `replace` no `navigate`
- [ ] Todos los tests existentes siguen pasando
- [ ] Mock del hook de timeout funciona correctamente
- [ ] No hay regresiones en validaciones de monto
- [ ] No hay regresiones en formato de input

### Tests de Integración
- [ ] Navegación a TimeoutScreen después de 60s
- [ ] Navegación desde TimeoutScreen a AmountScreen funciona
- [ ] Navegación desde TimeoutScreen a Home funciona
- [ ] Estado de transacción se limpia apropiadamente
- [ ] Timer se resetea al volver a AmountScreen desde Timeout
- [ ] No se puede navegar back desde TimeoutScreen (gestureEnabled: false)
- [ ] Stack de navegación se maneja correctamente

### Tests Manuales
- [ ] Esperar 60s sin tocar → debe navegar a Timeout
- [ ] Escribir en input → timer se resetea
- [ ] Presionar botón → timer se resetea
- [ ] Desde TimeoutScreen, botones funcionan correctamente
- [ ] Volver a AmountScreen limpia el input anterior
- [ ] Timer funciona correctamente en múltiples ciclos
- [ ] No hay memory leaks al navegar entre pantallas

---

## 📦 Archivos a Crear/Modificar

### Crear (5 archivos)
1. `src/features/transactions/hooks/useInactivityTimeout.ts`
2. `src/features/transactions/screens/TimeoutScreen.tsx`
3. `src/features/transactions/screens/TimeoutScreen.styles.ts`
4. `src/features/transactions/hooks/__tests__/useInactivityTimeout.test.ts`
5. `src/features/transactions/screens/__tests__/TimeoutScreen.test.tsx` ⭐ **NUEVO**

### Modificar (5 archivos)
1. `src/features/transactions/screens/AmountScreen.tsx`
2. `src/features/transactions/screens/__tests__/AmountScreen.test.tsx` ⭐ **AJUSTAR**
3. `src/features/transactions/types.ts`
4. `src/navigation/TransactionStack.tsx` (o archivo de navegación)
5. `src/features/transactions/screens/index.ts` (exports)

---

## 🎨 Especificaciones de UI - TimeoutScreen

### Layout
- SafeAreaView container
- Centrado vertical y horizontal
- Padding: 24px

### Elementos
1. **Icono**
   - Tamaño: 80x80
   - Color: warning/error del theme
   - Tipo: reloj o ícono de timeout

2. **Título**
   - Texto: "Tiempo agotado"
   - Font size: 24
   - Font weight: bold
   - Color: texto primario
   - Margin bottom: 16

3. **Descripción**
   - Texto: "La sesión ha expirado por inactividad. Por favor, intenta nuevamente."
   - Font size: 16
   - Color: texto secundario
   - Text align: center
   - Margin bottom: 32

4. **Botón Primario**
   - Label: "Intentar de nuevo"
   - Tipo: primary
   - Full width
   - Margin bottom: 12

5. **Botón Secundario**
   - Label: "Volver al inicio"
   - Tipo: secondary/outline
   - Full width

---

## 🔧 Configuración

### Constantes
Crear en `src/features/transactions/constants.ts`:

```typescript
export const TRANSACTION_TIMEOUT_MS = 60000; // 60 segundos
export const TIMEOUT_WARNING_MS = 50000; // 50 segundos (opcional: mostrar warning)
```

---

## 🧪 Especificaciones Detalladas de Pruebas

### 1. TimeoutScreen.test.tsx (NUEVO)

**Ubicación:** `src/features/transactions/screens/__tests__/TimeoutScreen.test.tsx`

**Setup:**
```typescript
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TimeoutScreen} from '../TimeoutScreen';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';

jest.mock('@/store/transactionFlowStore');
```

**Tests a implementar:**

#### Renderizado
- **Test:** "should render correctly"
  - Verificar título "Tiempo agotado"
  - Verificar mensaje descriptivo
  - Verificar botón "Intentar de nuevo"
  - Verificar botón "Volver al inicio"

#### Navegación - Botón "Intentar de nuevo"
- **Test:** "should navigate to AmountScreen when 'Intentar de nuevo' is pressed"
  - Mock: `navigation.replace`
  - Acción: `fireEvent.press(getByText('Intentar de nuevo'))`
  - Verificar: `navigation.replace` llamado con 'Amount'

- **Test:** "should reset transaction store when navigating to AmountScreen"
  - Mock: `mockReset` del store
  - Acción: Presionar "Intentar de nuevo"
  - Verificar: `mockReset` fue llamado

#### Navegación - Botón "Volver al inicio"
- **Test:** "should navigate to Home when 'Volver al inicio' is pressed"
  - Mock: `navigation.replace`
  - Acción: `fireEvent.press(getByText('Volver al inicio'))`
  - Verificar: `navigation.replace` llamado con 'Home' o 'Wallet'

- **Test:** "should reset transaction store when navigating to Home"
  - Mock: `mockReset` del store
  - Acción: Presionar "Volver al inicio"
  - Verificar: `mockReset` fue llamado

#### Estilos y Accesibilidad
- **Test:** "should have proper styling for all elements"
  - Verificar que no hay inline styles
  - Verificar que usa StyleSheet

- **Test:** "should have accessible buttons"
  - Verificar touch targets adecuados
  - Verificar labels descriptivos

**Total de tests:** Mínimo 6 tests

---

### 2. AmountScreen.test.tsx (AJUSTES)

**Ubicación:** `src/features/transactions/screens/__tests__/AmountScreen.test.tsx`

**Nuevos mocks necesarios:**
```typescript
// Agregar al inicio del archivo
jest.mock('@/features/transactions/hooks/useInactivityTimeout');

const mockResetTimer = jest.fn();
const mockUseInactivityTimeout = useInactivityTimeout as jest.MockedFunction<typeof useInactivityTimeout>;
```

**Setup actualizado:**
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock existentes...
  (useWalletStore as unknown as jest.Mock).mockReturnValue({
    balance: 10000,
  });
  
  // NUEVO: Mock del hook de timeout
  mockUseInactivityTimeout.mockReturnValue({
    resetTimer: mockResetTimer,
    remainingTime: 60000,
    isActive: true,
  });
});
```

**Nuevos tests a agregar:**

#### Integración con Hook de Timeout
- **Test:** "should initialize timeout hook on mount"
  - Renderizar componente
  - Verificar: `useInactivityTimeout` fue llamado con config correcta
  - Verificar: `timeoutMs: 60000`
  - Verificar: `enabled: true`

- **Test:** "should call resetTimer when user types in input"
  - Acción: `fireEvent.changeText(input, '100')`
  - Verificar: `mockResetTimer` fue llamado

- **Test:** "should call resetTimer when continue button is pressed"
  - Setup: Input con valor válido
  - Acción: `fireEvent.press(continueButton)`
  - Verificar: `mockResetTimer` fue llamado

- **Test:** "should navigate to Timeout screen when timeout occurs"
  - Mock: Simular callback `onTimeout`
  - Ejecutar callback manualmente
  - Verificar: `navigation.replace` llamado con 'Timeout'

#### Cleanup
- **Test:** "should cleanup timeout on unmount"
  - Renderizar componente
  - Desmontar: `unmount()`
  - Verificar: Timer limpiado (verificar con mock)

**Tests existentes a mantener:**
- ✅ Todos los 15 tests existentes deben seguir pasando
- ✅ No modificar lógica de validación
- ✅ No modificar lógica de formato

**Total de tests:** 15 existentes + 5 nuevos = **20 tests**

---

### 3. useInactivityTimeout.test.ts (NUEVO)

**Ubicación:** `src/features/transactions/hooks/__tests__/useInactivityTimeout.test.ts`

**Setup:**
```typescript
import {renderHook, act} from '@testing-library/react-hooks';
import {useInactivityTimeout} from '../useInactivityTimeout';

jest.useFakeTimers();
```

**Tests a implementar:**

#### Inicialización
- **Test:** "should initialize with correct default values"
  - Verificar: `isActive: true`
  - Verificar: `remainingTime` inicial

- **Test:** "should not start timer when enabled is false"
  - Config: `enabled: false`
  - Avanzar tiempo
  - Verificar: `onTimeout` NO llamado

#### Funcionalidad del Timer
- **Test:** "should call onTimeout after specified time"
  - Config: `timeoutMs: 5000`
  - Acción: `jest.advanceTimersByTime(5000)`
  - Verificar: `onTimeout` llamado

- **Test:** "should not call onTimeout before timeout expires"
  - Config: `timeoutMs: 5000`
  - Acción: `jest.advanceTimersByTime(4000)`
  - Verificar: `onTimeout` NO llamado

#### Reset Timer
- **Test:** "should reset timer when resetTimer is called"
  - Avanzar tiempo: 3000ms
  - Acción: `resetTimer()`
  - Avanzar tiempo: 3000ms más
  - Verificar: `onTimeout` NO llamado (total 6s pero se reseteó)

- **Test:** "should handle multiple resetTimer calls"
  - Llamar `resetTimer()` múltiples veces
  - Verificar: No hay errores
  - Verificar: Timer funciona correctamente

#### Cleanup
- **Test:** "should cleanup timer on unmount"
  - Renderizar hook
  - Desmontar: `unmount()`
  - Avanzar tiempo
  - Verificar: `onTimeout` NO llamado

- **Test:** "should cleanup previous timer when resetTimer is called"
  - Verificar: No hay múltiples timers activos
  - Verificar: Solo un setTimeout activo

#### Edge Cases
- **Test:** "should handle enabled changing from true to false"
  - Iniciar con `enabled: true`
  - Cambiar a `enabled: false`
  - Avanzar tiempo
  - Verificar: `onTimeout` NO llamado

**Total de tests:** Mínimo 9 tests

---

### Resumen de Cobertura de Tests

| Archivo | Tests Nuevos | Tests Modificados | Total |
|---------|--------------|-------------------|-------|
| `TimeoutScreen.test.tsx` | 6 | 0 | 6 |
| `AmountScreen.test.tsx` | 5 | 15 (mantener) | 20 |
| `useInactivityTimeout.test.ts` | 9 | 0 | 9 |
| **TOTAL** | **20** | **15** | **35** |

---

### Comandos de Testing

**Ejecutar todos los tests:**
```bash
yarn test
```

**Ejecutar tests específicos:**
```bash
# Solo TimeoutScreen
yarn test TimeoutScreen.test.tsx

# Solo AmountScreen
yarn test AmountScreen.test.tsx

# Solo hook
yarn test useInactivityTimeout.test.ts

# Tests de transactions
yarn test src/features/transactions
```

**Ejecutar con coverage:**
```bash
yarn test --coverage
```

**Cobertura mínima esperada:**
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## 🚀 Orden de Implementación

### Fase 1: Fundamentos + Tests
1. Crear tipos en `types.ts`
2. Agregar constantes en `constants.ts`
3. Crear hook `useInactivityTimeout.ts`
4. **Crear `useInactivityTimeout.test.ts`** ⭐
5. Ejecutar tests del hook y validar

### Fase 2: UI + Tests
6. Crear `TimeoutScreen.styles.ts`
7. Crear `TimeoutScreen.tsx`
8. **Crear `TimeoutScreen.test.tsx`** ⭐
9. Ejecutar tests de TimeoutScreen
10. Agregar ruta en navegación

### Fase 3: Integración + Ajustes de Tests
11. Modificar `AmountScreen.tsx` para usar hook
12. **Ajustar `AmountScreen.test.tsx`** ⭐ (agregar 5 tests nuevos)
13. Ejecutar todos los tests de AmountScreen (15 + 5 = 20)
14. Validar que no hay regresiones
15. Actualizar exports en `index.ts`

### Fase 4: Validación Completa
16. Ejecutar suite completa de tests (`yarn test`)
17. Validar cobertura de código (> 80%)
18. Validar criterios de aceptación funcionales
19. Testing manual e2e
20. Testing en dispositivo real (iOS y Android)

---

## ⚠️ Consideraciones Técnicas

### Performance
- Timer debe limpiarse correctamente para evitar memory leaks
- Usar `useCallback` para funciones que se pasan como deps
- Evitar re-renders innecesarios

### UX
- Considerar mostrar warning visual a los 50 segundos (opcional)
- No mostrar timer visible para no generar ansiedad
- Mensaje de timeout debe ser claro y no alarmante

### Edge Cases
- Usuario sale de la app y vuelve → timer debe continuar o resetear (definir comportamiento)
- Usuario navega back desde AmountScreen → limpiar timer
- Usuario completa flujo antes de timeout → limpiar timer

### Accesibilidad
- Labels descriptivos en botones
- Mensaje de timeout legible
- Touch targets mínimo 44x44

---

## 📝 Notas para IA

### Reglas Obligatorias a Seguir
- ✅ NO usar tipo `any`
- ✅ Estilos en archivos `.styles.ts` separados
- ✅ Imports con alias `@/`
- ✅ Props tipadas con interfaces
- ✅ Cleanup en useEffect
- ✅ Tests para lógica crítica

### Patrones a Aplicar
- Custom hooks para lógica reutilizable
- Separación de concerns (UI vs lógica)
- Navegación con `replace` para evitar back a pantalla expirada
- Constantes centralizadas

### Validaciones Pre-Commit

#### Código
- [ ] No hay tipos `any`
- [ ] No hay inline styles
- [ ] Todos los imports usan `@/`
- [ ] Props tipadas con interfaces
- [ ] Cleanup implementado en useEffect
- [ ] Sin warnings ESLint
- [ ] Código formateado con Prettier

#### Tests
- [ ] `TimeoutScreen.test.tsx` creado (6 tests mínimo)
- [ ] `AmountScreen.test.tsx` ajustado (5 tests nuevos)
- [ ] `useInactivityTimeout.test.ts` creado (9 tests mínimo)
- [ ] Todos los tests existentes siguen pasando (15 de AmountScreen)
- [ ] Cobertura > 80% en archivos modificados
- [ ] Tests usan mocks apropiados
- [ ] Tests usan `jest.useFakeTimers()` para el hook
- [ ] No hay tests skipped o comentados

#### Funcionalidad
- [ ] Timer de 60s funciona correctamente
- [ ] Reset de timer en interacciones
- [ ] Navegación a TimeoutScreen funciona
- [ ] Navegación desde TimeoutScreen funciona
- [ ] Store se resetea apropiadamente
- [ ] No hay memory leaks

---

## 🔗 Referencias

- Reglas del proyecto: `.ai/rules.md`
- Arquitectura: Ver estructura en `src/features/`
- Componentes base: `src/components/`
- Theme tokens: `src/theme/`

