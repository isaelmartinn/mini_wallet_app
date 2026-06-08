# Archivos con Problemas de ESLint

**Total:** 22 problemas (21 errores, 1 warning)

---

## 1. src/api/transactions.ts
**Errores:** 2
- `amount` is defined but never used (línea 67)
- `recipientName` is defined but never used (línea 68)

**Solución:** Prefixar con `_` si son parámetros no utilizados: `_amount`, `_recipientName`

---

## 2. src/components/Button/Button.test.tsx
**Errores:** 1
- `getByTestId` is assigned a value but never used (línea 64)

**Solución:** Eliminar la variable o usarla en el test

---

## 3. src/components/ContactPicker/ContactPicker.test.tsx
**Errores:** 1
- Require statement not part of import statement (línea 18)

**Solución:** Cambiar `require()` por `import`

---

## 4. src/components/ContactPicker/ContactPicker.tsx
**Errores:** 1
- `Button` is defined but never used (línea 14)

**Solución:** Eliminar el import si no se usa

---

## 5. src/features/auth/hooks/useLogin/useLogin.test.ts
**Errores:** 1
- `waitFor` is defined but never used (línea 1)

**Solución:** Eliminar del import

---

## 6. src/features/transactions/screens/AmountScreen/AmountScreen.tsx
**Errores:** 1
- Unexpected any. Specify a different type (línea 23)

**Solución:** Reemplazar `any` con tipo específico (ej: `NavigationProp`, `RouteProp`)

---

## 7. src/features/transactions/screens/RecipientScreen/RecipientScreen.tsx
**Errores:** 1
- Unexpected any. Specify a different type (línea 23)

**Solución:** Reemplazar `any` con tipo específico

---

## 8. src/features/transactions/screens/ResultScreen/ResultScreen.tsx
**Errores:** 1
- Unexpected any. Specify a different type (línea 20)

**Solución:** Reemplazar `any` con tipo específico

---

## 9. src/features/transactions/screens/SummaryScreen/SummaryScreen.tsx
**Errores:** 1
- Unexpected any. Specify a different type (línea 10)

**Solución:** Reemplazar `any` con tipo específico

---

## 10. src/features/wallet/screens/HomeScreen/HomeScreen.test.tsx
**Errores:** 3
- `waitFor` is defined but never used (línea 2)
- Require statement not part of import statement (línea 13)
- Require statement not part of import statement (línea 24)

**Solución:** 
- Eliminar `waitFor` del import
- Cambiar `require()` por `import`

---

## 11. src/features/wallet/screens/HomeScreen/components/TransactionList/TransactionList.test.tsx
**Errores:** 2
- `Text` is defined but never used (línea 3)
- Require statement not part of import statement (línea 9)

**Solución:**
- Eliminar `Text` del import
- Cambiar `require()` por `import`

---

## 12. src/navigation/AppStack/AppStack.tsx
**Warnings:** 1
- Do not define components during render (línea 87)

**Solución:** Mover la definición del componente fuera del render

---

## 13. src/services/ContactsService/ContactsService.ts
**Errores:** 1
- `Platform` is defined but never used (línea 1)

**Solución:** Eliminar el import de `Platform`

---

## 14. src/store/authStore/authStore.ts
**Errores:** 1
- `get` is defined but never used (línea 9)

**Solución:** Prefixar con `_get` si no se usa

---

## Resumen por Tipo de Error

### Variables/Imports No Utilizados (9 errores)
- `amount`, `recipientName`, `getByTestId`, `Button`, `waitFor` (x2), `Text`, `Platform`, `get`

### Uso de `any` Prohibido (4 errores)
- AmountScreen.tsx
- RecipientScreen.tsx
- ResultScreen.tsx
- SummaryScreen.tsx

### Uso de `require()` (4 errores)
- ContactPicker.test.tsx
- HomeScreen.test.tsx (x2)
- TransactionList.test.tsx

### Componentes Durante Render (1 warning)
- AppStack.tsx

---

## Comandos para Verificar

```bash
# Ver todos los errores
yarn lint

# Intentar corrección automática
yarn lint:fix

# Formatear código
yarn format
```
