# AI Usage Documentation - Mini Wallet App

Este documento detalla el uso de herramientas de Inteligencia Artificial durante el desarrollo del proyecto Mini Wallet App, incluyendo las decisiones tomadas, el flujo de trabajo implementado y las correcciones aplicadas.

---

## 📋 Resumen Ejecutivo

El desarrollo de este proyecto se realizó utilizando **AI-Driven Development (AIDD)**, una metodología que combina la capacidad de generación de código de la IA con el criterio de ingeniería humano para garantizar calidad, coherencia y cumplimiento de estándares técnicos.

**Herramientas utilizadas:**
- Cascade AI (Claude)
- GitHub Copilot

**Enfoque:** Planificación arquitectónica supervisada + Implementación asistida con validación continua.

---

## 🛠️ Herramientas Utilizadas y Áreas de Aplicación

### 1. Fase de Planificación y Arquitectura

**Herramienta:** Cascade AI con rol de **Sr. Arquitecto Frontend**

**Aplicación:**
- Análisis detallado de requerimientos del proyecto
- Diseño de arquitectura de la aplicación
- Creación de 5 planes de implementación estructurados:
  1. Setup y Arquitectura Base
  2. Autenticación y Sesión
  3. Wallet Core (Balance e Historial)
  4. Flujo de Transacciones y Validaciones
  5. Integración de Contactos Nativos

**Proceso:**
- Cada plan fue revisado detalladamente antes de su ejecución
- Se verificó que las soluciones propuestas concordaran con los requerimientos técnicos
- Los planes fueron optimizados para ser ejecutables por IA de manera eficiente
- Se establecieron criterios de aceptación claros para cada fase

### 2. Fase de Implementación

**Herramienta:** Cascade AI con rol de **Sr. Frontend Developer**

**Aplicación:**
- Generación de código basado en los planes aprobados
- Implementación de componentes, hooks y servicios
- Creación de tests unitarios
- Configuración de navegación y estado global

**Razón del cambio de rol:**
El cambio de "Arquitecto" a "Developer" permite que la IA se enfoque en la implementación práctica sin sobre-diseñar o cuestionar decisiones arquitectónicas ya tomadas.

### 3. Asistencia Continua

**Herramienta:** GitHub Copilot

**Aplicación:**
- Autocompletado de código repetitivo
- Sugerencias de implementación de funciones
- Generación de tipos TypeScript

---

## ✅ Qué se Aceptó Directamente

### Código Generado Aceptado

1. **Estructura de componentes y hooks**
   - La organización en carpetas individuales con barrel exports
   - Separación de lógica y presentación
   - Implementación de custom hooks

2. **Implementación de Zustand stores**
   - Stores por dominio (auth, wallet, transactions)
   - Uso de persist middleware
   - Tipado estricto de estados y acciones

3. **Configuración de navegación**
   - Stack navigators por feature
   - Tipado de rutas y parámetros
   - Protección de rutas autenticadas

4. **Tests unitarios**
   - Estructura de tests con describe/it
   - Mocks de servicios y stores
   - Casos de prueba para validaciones críticas

5. **Servicios API mock**
   - Simulación de delays realistas
   - Manejo de errores consistente
   - Estructura de respuestas tipadas

### Sugerencias Arquitectónicas Aceptadas

- Uso de React Navigation v6 con tipado fuerte
- Implementación de Zustand sobre Redux para simplicidad
- Estructura de features por dominio
- Separación de estilos en archivos `.styles.ts`

---

## ❌ Qué se Corrigió o Rechazó

### 1. Creación de Carpetas `__tests__`

**Problema detectado:**
La IA inicialmente generaba carpetas separadas `__tests__/` para los tests unitarios.

**Corrección aplicada:**
- Se estableció la regla de colocar tests junto al archivo que prueban
- Convención: `ComponentName.test.tsx` junto a `ComponentName.tsx`
- Se documentó en `.ai/rules.md` como regla obligatoria

**Razón:**
Mejor cohesión, facilita encontrar y mantener tests, reduce navegación entre carpetas.

### 2. Uso de Inline Styles

**Problema detectado:**
Algunos componentes generados incluían estilos inline directamente en JSX.

**Corrección aplicada:**
- Prohibición explícita de inline styles en `.ai/rules.md`
- Obligatoriedad de usar `StyleSheet.create()` en archivos `.styles.ts`
- Centralización de design tokens en `src/theme/`

**Razón:**
Mejor rendimiento, reutilización de estilos, mantenibilidad, consistencia visual.

### 3. Uso del Tipo `any`

**Problema detectado:**
La IA ocasionalmente usaba `any` como tipo en TypeScript.

**Corrección aplicada:**
- Prohibición total del uso de `any` en `.ai/rules.md`
- Requerimiento de tipos específicos o `unknown` cuando sea necesario
- Definición de interfaces y tipos de dominio

**Razón:**
Pérdida de type safety, errores en tiempo de ejecución, dificulta refactoring.

### 4. Imports Relativos

**Problema detectado:**
Uso de paths relativos como `../../components/Button`.

**Corrección aplicada:**
- Configuración de alias en `tsconfig.json` y `babel.config.js`
- Prohibición de paths relativos en `.ai/rules.md`
- Uso obligatorio de aliases: `@/components`, `@/api`, etc.

**Razón:**
Mejor legibilidad, facilita refactoring, evita errores de path al mover archivos.

### 5. Versiones de Dependencias con Rangos

**Problema detectado:**
La IA sugería versiones con `^` o `~` en `package.json`.

**Corrección aplicada:**
- Establecimiento de versiones fijas sin prefijos
- Documentación en `.ai/rules.md` sobre gestión de dependencias
- Justificación: builds consistentes, prevención de breaking changes

---

## 🧠 Decisiones Tomadas por el Ingeniero (No por la IA)

### 1. Stack Tecnológico

**Decisiones:**
- React Native (no Flutter ni nativo)
- TypeScript (no JavaScript)
- Zustand (no Redux, MobX, Context API)
- React Navigation v6
- Jest + React Native Testing Library
- Versiones fijas de dependencias

**Justificación:**
- React Native: ecosistema maduro, comunidad activa, experiencia del equipo
- TypeScript: type safety, mejor DX, prevención de errores
- Zustand: simplicidad, menos boilerplate que Redux
- Versiones fijas: reproducibilidad, estabilidad

### 2. Arquitectura y Estructura de Carpetas

**Decisiones:**
- Arquitectura por features (no por tipo de archivo)
- Separación de componentes reutilizables y específicos de feature
- Estructura de carpetas individuales para componentes/hooks/screens
- Barrel exports en cada módulo

**Justificación:**
- Escalabilidad: fácil agregar nuevas features sin afectar otras
- Mantenibilidad: código relacionado vive junto
- Cohesión: cada feature es autocontenida

### 3. Reglas de Desarrollo (`.ai/rules.md`)

**Decisión:**
Creación de un documento de reglas obligatorias para guiar a la IA y mantener coherencia en el código generado.

**Contenido:**
- Prohibiciones explícitas (any, inline styles, paths relativos)
- Estructura de carpetas y convenciones de nombres
- Reglas de testing y organización de archivos
- Instrucciones específicas para la IA

**Justificación:**
Prevenir anti-patterns, mantener calidad de código, reducir tiempo de revisión, garantizar coherencia.

### 4. Decisiones de Producto

**Mockeo de Cantidades por Usuario:**
- Decisión de simular balances diferentes por usuario
- Implementación de lógica de mock basada en userId
- Definición de montos realistas para testing

**Razón:**
Estas decisiones afectan la experiencia de usuario y los requerimientos de negocio, no son puramente técnicas.

### 5. Estrategia de Testing

**Decisiones:**
- Tests unitarios para lógica de negocio y validaciones
- Tests de integración para flujos críticos
- Mocks de servicios y stores
- Cobertura mínima en hooks, stores y validaciones

**Justificación:**
Balance entre cobertura y velocidad de desarrollo, enfoque en código crítico.

### 6. Gestión de Estado

**Decisiones:**
- Zustand para estado global (auth, wallet, transactions)
- useState/useReducer para estado local de componentes
- Persist middleware solo para datos críticos (auth, balance)

**Justificación:**
Simplicidad, rendimiento, evitar over-engineering.

---

## 📊 Flujo de Trabajo AI-Driven Development

```
┌─────────────────────────────────────────────────────────┐
│  1. Análisis de Requerimientos (Humano)                 │
│     - Lectura de specs                                   │
│     - Definición de alcance                              │
│     - Identificación de features                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. Planificación Arquitectónica (IA + Humano)          │
│     - IA genera planes de implementación                 │
│     - Humano revisa y valida cada plan                   │
│     - Ajustes y refinamiento                             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. Creación de Reglas (.ai/rules.md) (Humano)         │
│     - Definición de estándares                           │
│     - Prohibiciones explícitas                           │
│     - Guías para la IA                                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. Implementación (IA con supervisión)                  │
│     - IA genera código siguiendo reglas                  │
│     - Humano revisa cada commit                          │
│     - Correcciones inmediatas si es necesario            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. Testing y Validación (IA + Humano)                  │
│     - IA genera tests unitarios                          │
│     - Humano ejecuta y valida tests                      │
│     - Pruebas manuales de flujos críticos                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  6. Refinamiento (Iterativo)                             │
│     - Ajustes basados en feedback                        │
│     - Optimizaciones de rendimiento                      │
│     - Mejoras de UX                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Criterio de Ingeniería vs. Generación de IA

### El Rol del Ingeniero

**La IA es una herramienta, no un reemplazo.** El criterio de ingeniería humano fue fundamental en:

1. **Decisiones Arquitectónicas**
   - Elección de tecnologías y librerías
   - Diseño de la estructura de carpetas
   - Definición de patrones de diseño

2. **Revisión de Código**
   - Validación de que el código generado sigue las reglas
   - Detección de anti-patterns
   - Verificación de type safety

3. **Decisiones de Producto**
   - Definición de flujos de usuario
   - Validaciones de negocio
   - Priorización de features

4. **Calidad y Mantenibilidad**
   - Establecimiento de estándares de código
   - Definición de estrategia de testing
   - Documentación de decisiones

5. **Seguridad y Rendimiento**
   - Validación de manejo de datos sensibles
   - Optimización de re-renders
   - Gestión de memoria

### El Rol de la IA

La IA actuó como un **acelerador de desarrollo** en:

1. **Generación de Código Boilerplate**
   - Estructura de componentes
   - Configuración de navegación
   - Setup de stores

2. **Implementación de Patrones Establecidos**
   - Componentes siguiendo reglas definidas
   - Tests unitarios con estructura consistente
   - Servicios API con manejo de errores

3. **Documentación**
   - Comentarios de código cuando necesario
   - Documentación de funciones complejas

4. **Sugerencias de Mejora**
   - Optimizaciones de código
   - Mejores prácticas de React Native
   - Patrones de TypeScript
