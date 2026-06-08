# Plan de Implementación: Cantidades Diferentes por Usuario Mockeado

## Objetivo
Implementar cantidades de balance diferentes para cada usuario mockeado en lugar de usar una cantidad fija de $5,835.01 para todos. Los balances se almacenarán en centavos y se convertirán a pesos en el UI.

## Contexto Técnico

### Archivos Involucrados
- `@/src/utils/constants/constants.ts` - Definición de usuarios mockeados
- `@/src/api/wallet.ts` - API que retorna balance
- `@/src/types/auth.types.ts` - Tipo User
- `@/src/utils/currency/currency.ts` - Funciones de formateo de moneda
- `@/src/store/walletStore/walletStore.ts` - Store que consume la API

### Estado Actual
- Balance hardcodeado: `MOCK_BALANCE = 5835.01` en `@/src/api/wallet.ts:101`
- `walletApi.getWalletData()` retorna siempre el mismo balance
- No hay relación entre el usuario autenticado y su balance
- Los balances se manejan en pesos (decimales)

## Cambios Requeridos

### 1. Actualizar Tipo User
**Archivo:** `@/src/types/auth.types.ts`

**Acción:** Agregar campo `balanceInCents` al interface `User`

```typescript
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  balanceInCents: number; // Nuevo campo
}
```

### 2. Actualizar Usuarios Mockeados
**Archivo:** `@/src/utils/constants/constants.ts`

**Acción:** Agregar `balanceInCents` a cada usuario con valores diferentes

```typescript
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+525512345678',
    balanceInCents: 583501, // $5,835.01
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+525587654321',
    balanceInCents: 1250000, // $12,500.00
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '+525555555555',
    balanceInCents: 750050, // $7,500.50
  },
];

export const DEFAULT_BALANCE_IN_CENTS = 1000000; // $10,000.00 para usuarios no mockeados
```

**Nota:** Agregar también la constante `DEFAULT_BALANCE_IN_CENTS` para usuarios no mockeados.

### 3. Crear Utilidad de Conversión
**Archivo:** `@/src/utils/currency/currency.ts`

**Acción:** Agregar funciones para convertir entre centavos y pesos

```typescript
/**
 * Convierte centavos a pesos
 * @param cents - Cantidad en centavos
 * @returns Cantidad en pesos (con decimales)
 */
export const centsToPesos = (cents: number): number => {
  return cents / 100;
};

/**
 * Convierte pesos a centavos
 * @param pesos - Cantidad en pesos
 * @returns Cantidad en centavos (entero)
 */
export const pesosToCents = (pesos: number): number => {
  return Math.round(pesos * 100);
};
```

**Ubicación:** Agregar al final del archivo existente.

### 4. Actualizar API de Wallet
**Archivo:** `@/src/api/wallet.ts`

**Acción:** Modificar `getWalletData` para aceptar `userId` y retornar balance según usuario

**Cambios específicos:**

a) Actualizar interface `WalletDataResponse` (no requiere cambios, balance sigue siendo number en pesos)

b) Modificar función `getWalletData`:
```typescript
export const walletApi = {
  getWalletData: async (userId?: string): Promise<WalletDataResponse> => {
    await simulateNetworkDelay();

    if (shouldSimulateError()) {
      return {
        success: false,
        balance: 0,
        transactions: [],
        error: 'Error al cargar los datos de la wallet. Intenta de nuevo.',
      };
    }

    // Buscar usuario mockeado
    const mockUser = MOCK_USERS.find(user => user.id === userId);
    
    // Determinar balance en centavos
    const balanceInCents = mockUser 
      ? mockUser.balanceInCents 
      : DEFAULT_BALANCE_IN_CENTS;
    
    // Convertir a pesos para la respuesta
    const balanceInPesos = centsToPesos(balanceInCents);

    return {
      success: true,
      balance: balanceInPesos,
      transactions: MOCK_TRANSACTIONS,
    };
  },
};
```

c) Eliminar la constante `MOCK_BALANCE` (línea 101)

d) Agregar imports necesarios:
```typescript
import { MOCK_USERS, DEFAULT_BALANCE_IN_CENTS } from '@/utils/constants/constants';
import { centsToPesos } from '@/utils/currency/currency';
```

### 5. Actualizar WalletStore
**Archivo:** `@/src/store/walletStore/walletStore.ts`

**Acción:** Pasar `userId` a `walletApi.getWalletData()`

**Cambios específicos:**

a) En `fetchWalletData`:
```typescript
fetchWalletData: async () => {
  const { isLoading } = get();
  if (isLoading) return;

  set({ isLoading: true, error: null });

  try {
    // Obtener userId del authStore
    const userId = useAuthStore.getState().user?.id;
    const response = await walletApi.getWalletData(userId);

    if (response.success) {
      set({
        balance: response.balance,
        transactions: response.transactions,
        isLoading: false,
      });
    } else {
      set({
        error: response.error || 'Error desconocido',
        isLoading: false,
      });
    }
  } catch (error) {
    set({
      error: 'Error de red. Verifica tu conexión.',
      isLoading: false,
    });
  }
},
```

b) En `refreshWalletData`:
```typescript
refreshWalletData: async () => {
  const { isRefreshing } = get();
  if (isRefreshing) return;

  set({ isRefreshing: true, error: null });

  try {
    // Obtener userId del authStore
    const userId = useAuthStore.getState().user?.id;
    const response = await walletApi.getWalletData(userId);

    if (response.success) {
      set({
        balance: response.balance,
        transactions: response.transactions,
        isRefreshing: false,
      });
    } else {
      set({
        error: response.error || 'Error desconocido',
        isRefreshing: false,
      });
    }
  } catch (error) {
    set({
      error: 'Error de red. Verifica tu conexión.',
      isRefreshing: false,
    });
  }
},
```

c) Agregar import:
```typescript
import { useAuthStore } from '@/store/authStore/authStore';
```

## Validación de Cambios

### Tests a Actualizar

#### 1. `@/src/utils/currency/currency.test.ts`
Agregar tests para las nuevas funciones:

```typescript
describe('centsToPesos', () => {
  it('should convert cents to pesos correctly', () => {
    expect(centsToPesos(583501)).toBe(5835.01);
    expect(centsToPesos(1000000)).toBe(10000);
    expect(centsToPesos(0)).toBe(0);
  });
});

describe('pesosToCents', () => {
  it('should convert pesos to cents correctly', () => {
    expect(pesosToCents(5835.01)).toBe(583501);
    expect(pesosToCents(10000)).toBe(1000000);
    expect(pesosToCents(0)).toBe(0);
  });

  it('should round to nearest cent', () => {
    expect(pesosToCents(10.005)).toBe(1001);
    expect(pesosToCents(10.004)).toBe(1000);
  });
});
```

#### 2. `@/src/store/walletStore/walletStore.test.ts`
Actualizar mocks para incluir `userId`:

```typescript
// Mock de walletApi.getWalletData debe esperar userId como parámetro
(walletApi.getWalletData as jest.Mock).mockResolvedValue(mockData);

// Verificar que se llama con el userId correcto
expect(walletApi.getWalletData).toHaveBeenCalledWith(expect.any(String));
```

### Comando de Pruebas
```bash
npm test -- --testPathPattern="currency|walletStore"
```

## Criterios de Aceptación

- [ ] Cada usuario mockeado tiene un `balanceInCents` diferente
- [ ] Los balances están almacenados en centavos (enteros)
- [ ] El UI muestra los balances convertidos a pesos con formato correcto
- [ ] Usuarios no mockeados reciben el balance default de $10,000.00
- [ ] Las funciones `centsToPesos` y `pesosToCents` están implementadas
- [ ] `walletApi.getWalletData()` acepta `userId` opcional
- [ ] `walletStore` pasa el `userId` del usuario autenticado a la API
- [ ] Todos los tests existentes pasan
- [ ] Nuevos tests para conversión de moneda están implementados
- [ ] No se usa el tipo `any` en ningún lugar
- [ ] Se usan alias `@/` para imports

## Notas de Implementación

### Orden de Implementación
1. Actualizar tipo `User` en `auth.types.ts`
2. Agregar funciones de conversión en `currency.ts`
3. Actualizar `MOCK_USERS` y agregar `DEFAULT_BALANCE_IN_CENTS` en `constants.ts`
4. Modificar `walletApi.getWalletData()` en `wallet.ts`
5. Actualizar `walletStore` para pasar `userId`
6. Actualizar/crear tests
7. Ejecutar suite completa de tests

### Consideraciones
- El balance en la respuesta de la API sigue siendo `number` en pesos (no cambiar interfaces existentes)
- La conversión de centavos a pesos se hace en la API, no en el store
- El UI no necesita cambios, ya usa `formatCurrency()` que maneja pesos
- Mantener compatibilidad: si no hay `userId`, usar balance default

### Validación de Tipos
- `balanceInCents`: `number` (entero, sin decimales)
- `balance` en API response: `number` (pesos, con decimales)
- Todas las funciones deben tener tipos explícitos, sin `any`
