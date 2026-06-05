# Reglas de Desarrollo - Mini Wallet App

Este archivo contiene las reglas obligatorias que **TODA** implementación de código debe seguir. La IA debe consultar y aplicar estas reglas en cada sesión de desarrollo.

---

## 🎯 Reglas Obligatorias

### 1. TypeScript Estricto
- ❌ **PROHIBIDO** usar `any` como tipado
- ✅ Usar tipos específicos, interfaces o `unknown` cuando sea necesario
- ✅ Definir tipos para props, estados, y retornos de funciones
- ✅ Crear tipos de dominio en `src/types/`

### 2. Estilos
- ❌ **PROHIBIDO** usar inline styles
- ✅ Usar StyleSheet.create() en archivos separados `.styles.ts`
- ✅ Centralizar tokens de diseño (colores, espaciados, tipografía) en `src/theme/`
- ✅ Seguir convención: `ComponentName.styles.ts` junto a `ComponentName.tsx`

### 3. Imports y Paths
- ❌ **PROHIBIDO** usar paths relativos (`../../components`)
- ✅ Usar alias configurados: `@/components`, `@/api`, `@/store`, etc.
- ✅ Mantener imports ordenados: externos → alias → relativos
- ✅ Agrupar imports por tipo (React, librerías, componentes, tipos, estilos)

### 4. Arquitectura de Carpetas
```
src/
├── api/           # Servicios y llamadas API (mock o real)
├── assets/        # Imágenes, fuentes, iconos
├── components/    # Componentes reutilizables
├── features/      # Features por dominio (auth, wallet, transactions)
│   └── [feature]/
│       ├── components/  # Componentes específicos del feature
│       ├── screens/     # Pantallas del feature
│       ├── hooks/       # Hooks personalizados
│       └── types.ts     # Tipos del feature
├── navigation/    # Configuración de navegación
├── store/         # Estado global (Zustand stores)
├── theme/         # Tokens de diseño, colores, tipografía
├── types/         # Tipos globales y modelos de dominio
├── utils/         # Utilidades y helpers
└── App.tsx
```

### 5. Componentes
- ✅ Separar lógica de presentación (hooks personalizados)
- ✅ Props tipadas con interfaces
- ✅ Componentes pequeños y con responsabilidad única
- ✅ Usar composición sobre herencia
- ✅ Memoización cuando sea necesario (React.memo, useMemo, useCallback)

### 6. Estado Global (Zustand)
- ✅ Un store por dominio (authStore, walletStore, transactionsStore)
- ✅ Acciones tipadas y descriptivas
- ✅ Usar middleware de persist para datos que deben sobrevivir reinicios
- ✅ Selectores para evitar re-renders innecesarios

### 7. Validaciones y Reglas de Negocio
- ✅ Validaciones en servicios/hooks, NO solo en UI
- ✅ Mensajes de error descriptivos y centralizados
- ✅ Manejo de estados: loading, error, success, empty
- ✅ Implementar reglas de negocio en capa de dominio

### 8. Testing
- ✅ Tests unitarios para validaciones y lógica de negocio
- ✅ Tests de componentes críticos
- ✅ Mocks para servicios y stores
- ✅ Cobertura mínima: validaciones, hooks, stores

### 9. Manejo de Errores
- ✅ Try-catch en operaciones asíncronas
- ✅ Feedback visual al usuario (toast, mensajes inline)
- ✅ Logging de errores para debugging
- ✅ Fallbacks y estados de error definidos

### 10. Accesibilidad
- ✅ Labels descriptivos en inputs
- ✅ Feedback táctil y visual
- ✅ Tamaños de touch targets adecuados (mínimo 44x44)
- ✅ Contraste de colores apropiado

### 11. Performance
- ✅ Listas con FlatList/SectionList (no ScrollView con map)
- ✅ KeyExtractor único y estable
- ✅ Optimizar re-renders con React.memo
- ✅ Lazy loading cuando sea apropiado

### 12. Documentación
- ✅ JSDoc para funciones complejas
- ✅ README actualizado con instrucciones
- ✅ Comentarios solo cuando el código no sea auto-explicativo
- ✅ DECISIONS.md con decisiones arquitectónicas

---

## 📋 Checklist Pre-Commit

Antes de considerar una tarea completada, verificar:

- [ ] No hay tipos `any`
- [ ] No hay inline styles
- [ ] Todos los imports usan alias `@/`
- [ ] Componentes tienen props tipadas
- [ ] Manejo de estados loading/error/success
- [ ] Validaciones implementadas
- [ ] Código formateado (Prettier)
- [ ] Sin warnings de ESLint
- [ ] Tests relevantes agregados/actualizados

---

## 🔄 Evolución de Reglas

Este archivo puede crecer con nuevas reglas. Cuando se agreguen:
1. Actualizar este archivo
2. Notificar al equipo
3. Refactorizar código existente si es necesario
4. Actualizar documentación relacionada

---

## 🤖 Instrucciones para IA

**IMPORTANTE**: Al inicio de cada sesión de desarrollo:
1. Leer este archivo completo
2. Aplicar TODAS las reglas en el código generado
3. Si una regla entra en conflicto con una solicitud, preguntar al usuario
4. Sugerir mejoras cuando el código existente no siga las reglas
5. Documentar decisiones que afecten estas reglas en DECISIONS.md

**Estas reglas son OBLIGATORIAS y tienen prioridad sobre sugerencias generales.**
