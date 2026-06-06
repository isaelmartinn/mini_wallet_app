# Normalización de Números Telefónicos

## Problema

Cuando se selecciona un contacto desde los contactos del dispositivo, el número de teléfono puede venir en formato internacional (ej: `+521234567890`). El input tenía un `maxLength` de 10 dígitos, lo que causaba que el número se cortara.

## Solución

Se implementó un sistema de normalización de números telefónicos que:

1. **Detecta formato internacional**: Identifica números con prefijo `+52` (México)
2. **Normaliza a 10 dígitos**: Convierte `+521234567890` → `1234567890`
3. **Ajusta el input dinámicamente**: Cambia `maxLength` según el origen del número
4. **Valida correctamente**: Asegura que el número final tenga exactamente 10 dígitos

## Implementación

### Función de Normalización

```typescript
// src/features/transactions/utils/phoneNormalization.ts
export const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('52') && cleaned.length === 12) {
    return cleaned.substring(2);
  }
  
  return cleaned;
};
```

### Comportamiento del Input

- **Entrada manual**: `maxLength={10}`, `keyboardType="number-pad"`
- **Desde contactos**: `maxLength={13}`, `keyboardType="phone-pad"`

### Flujo de Datos

1. Usuario selecciona contacto → `+521234567890`
2. Se muestra en el input → `+521234567890`
3. Al continuar, se normaliza → `1234567890`
4. Se valida → ✅ 10 dígitos válidos
5. Se guarda → `1234567890`

## Casos de Prueba

| Entrada | Salida Esperada |
|---------|----------------|
| `+521234567890` | `1234567890` |
| `521234567890` | `1234567890` |
| `1234567890` | `1234567890` |
| `123-456-7890` | `1234567890` |
| `+52 (123) 456-7890` | `1234567890` |

## Tests

Ejecutar tests de normalización:

```bash
npm test -- phoneNormalization.test.ts
```

O usar el script de verificación:

```bash
./scripts/verify-phone-normalization.sh
```

## Archivos Modificados

- `src/features/transactions/screens/RecipientScreen.tsx`
- `src/features/transactions/utils/phoneNormalization.ts` (nuevo)
- `src/features/transactions/utils/__tests__/phoneNormalization.test.ts` (nuevo)
- `src/features/transactions/utils/index.ts`

## Reglas de Negocio

1. Los números de teléfono deben tener **exactamente 10 dígitos** después de la normalización
2. Se acepta formato internacional `+52` seguido de 10 dígitos
3. Se eliminan todos los caracteres no numéricos excepto el `+` inicial cuando viene de contactos
4. La validación siempre se hace sobre el número normalizado (10 dígitos)
