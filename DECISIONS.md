# Decisiones de Diseño - Mini Wallet App

## Arquitectura General

### Estructura de Carpetas por Features
**Decisión**: Organizar el código por features/dominios en lugar de por tipo de archivo.

**Razón**: 
- Escalabilidad: Cada feature es independiente y puede crecer sin afectar otros
- Mantenibilidad: Cambios en un dominio están localizados
- Claridad: La estructura refleja el modelo de negocio

**Estructura**:
```
src/
├── features/
│   ├── auth/          # Todo lo relacionado con autenticación
│   ├── wallet/        # Gestión de wallet y saldo
│   └── transactions/  # Transacciones y transferencias
```

### Alias de Paths (@/)
**Decisión**: Usar alias `@/` para imports absolutos.

**Razón**:
- Evita paths relativos complejos (`../../../components`)
- Facilita refactoring (mover archivos no rompe imports)
- Mejora legibilidad del código

**Configuración**: `tsconfig.json`, `babel.config.js`, `metro.config.js`

---

## Estado Global

### Zustand sobre Context API o Redux
**Decisión**: Usar Zustand para estado global.

**Razones**:
- **Simplicidad**: API minimalista, menos boilerplate que Redux
- **Performance**: Re-renders optimizados por defecto
- **TypeScript**: Excelente soporte de tipos
- **Tamaño**: Bundle pequeño (~1KB)
- **Middleware**: Persist integrado para AsyncStorage

**Estructura de Stores**:
- Un store por dominio (`authStore`, `walletStore`, `transactionsStore`)
- Acciones y estado en el mismo lugar
- Selectores para optimizar re-renders

---

## Validaciones

### Validaciones en Servicios, No Solo en UI
**Decisión**: Implementar validaciones en capa de servicios/hooks.

**Razón**:
- **Seguridad**: UI puede ser bypasseada
- **Reutilización**: Mismas validaciones en múltiples componentes
- **Testing**: Más fácil testear lógica aislada
- **Separación de responsabilidades**: UI solo presenta, lógica valida

**Implementación**:
- `utils/validation.ts`: Funciones de validación puras
- `api/auth.ts`: Validación antes de procesar
- `hooks/useLogin.ts`: Validación antes de submit

---

## Estilos

### StyleSheet.create() en Archivos Separados
**Decisión**: Prohibir inline styles, usar archivos `.styles.ts`.

**Razones**:
- **Performance**: StyleSheet.create() optimiza estilos
- **Organización**: Separación clara entre lógica y presentación
- **Reutilización**: Estilos centralizados en Theme
- **Mantenibilidad**: Cambios de diseño localizados

**Convención**: `ComponentName.tsx` + `ComponentName.styles.ts`

### Sistema de Tema Centralizado
**Decisión**: Theme.ts con tokens de diseño.

**Contenido**:
- Colores (primary, secondary, error, etc.)
- Espaciados (xs, sm, md, lg, xl, xxl)
- Tipografía (h1-h4, body, caption, button)
- Border radius
- Shadows

**Beneficio**: Cambios de diseño globales en un solo lugar

---

## TypeScript

### Prohibición de `any`
**Decisión**: No usar `any` en ningún lugar del código.

**Alternativas**:
- Tipos específicos cuando se conoce la estructura
- `unknown` cuando el tipo es dinámico (requiere type guards)
- Generics para código reutilizable
- Interfaces para contratos claros

**Beneficio**: Type safety real, menos bugs en runtime

---

## Componentes

### Composición sobre Herencia
**Decisión**: Componentes pequeños y composables.

**Ejemplos**:
- `Input`: Componente base reutilizable
- `Button`: Variantes via props, no componentes separados
- Props tipadas con interfaces

### Separación UI/Lógica
**Decisión**: Hooks personalizados para lógica de negocio.

**Ejemplo**: `useLogin` hook
- Maneja estado local (identifier, validationError)
- Interactúa con store global
- Expone API simple al componente
- Testeable independientemente

---

## Navegación

### Navigation Guard Pattern
**Decisión**: Renderizado condicional basado en `isAuthenticated`.

**Implementación**:
```tsx
{isAuthenticated ? <AppStack /> : <AuthStack />}
```

**Razones**:
- Seguridad: Usuario no autenticado no puede acceder a AppStack
- UX: Transición automática al login/logout
- Simplicidad: No requiere lógica compleja de redirección

---

## Persistencia

### AsyncStorage con Zustand Persist
**Decisión**: Persistir solo datos necesarios (user, isAuthenticated).

**Razones**:
- **Performance**: No persistir estado temporal (loading, errors)
- **Seguridad**: Solo datos no sensibles en storage local
- **UX**: Sesión persiste entre reinicios

**Configuración**:
```ts
partialize: state => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
})
```

---

## Testing (Próximos Pasos)

### Estrategia de Testing
**Plan**:
1. **Validaciones**: Tests unitarios (`validation.ts`)
2. **Hooks**: Tests de hooks personalizados (`useLogin`)
3. **Stores**: Tests de acciones y estado
4. **Componentes**: Tests de integración para flujos críticos

**Herramientas**: Jest + React Native Testing Library

---

## Reglas Centralizadas

### Archivo `.ai/rules.md`
**Decisión**: Centralizar reglas de desarrollo para IA y equipo.

**Contenido**:
- Reglas obligatorias (no `any`, no inline styles, etc.)
- Arquitectura de carpetas
- Convenciones de código
- Checklist pre-commit

**Beneficio**: 
- Consistencia en código generado por IA
- Onboarding más rápido para nuevos desarrolladores
- Documentación viva de estándares del proyecto

---

## Decisiones Pendientes

### Manejo de Errores Global
**Próximo**: Implementar error boundary y sistema de notificaciones/toasts.

### Logging
**Próximo**: Integrar sistema de logging para debugging y monitoreo.

### Internacionalización
**Consideración futura**: i18n si la app crece a múltiples idiomas.

---

## Qué Haría Diferente con Más Tiempo

1. **Tests Completos**: Cobertura de tests unitarios e integración
2. **Error Boundary**: Manejo robusto de errores en toda la app
3. **Animaciones**: Transiciones suaves entre pantallas
4. **Accessibility**: Mejorar labels, screen readers, contraste
5. **Performance Monitoring**: Integrar herramientas de profiling
6. **CI/CD**: Pipeline automatizado de testing y deployment
