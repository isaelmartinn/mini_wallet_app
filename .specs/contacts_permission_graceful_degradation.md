# Plan 06: Contacts Permission - Graceful Degradation

## Contexto
El flujo de transacciones se rompe cuando el usuario niega permisos de contactos. El modal queda bloqueado sin permitir continuar la transacción manualmente.

## Objetivo
Implementar degradación elegante que permita al usuario completar transacciones sin acceso a contactos, proporcionando rutas alternativas claras.

## Problema Actual
1. Botón "Cerrar" no funciona
2. Botón "Reintentar" entra en loop infinito
3. Usuario queda atrapado en modal
4. No existe ruta alternativa para continuar

## Solución: Graceful Degradation
Permitir que el usuario continúe con entrada manual cuando niega permisos, sin romper el flujo de transacción.

---

## Pasos de Implementación

### 1. Actualizar tipos y interfaces

#### 1.1 Extender `useContacts` hook
- Agregar estado `canAskAgain` al return type de `UseContactsReturn`
- Exponer `canAskAgain` desde el estado interno del hook
- Actualizar estado cuando `requestPermission` retorna resultado

#### 1.2 Verificar tipo `ContactsPermissionStatus`
- Confirmar que incluye propiedad `canAskAgain: boolean`
- Si no existe, agregarla al tipo en `@/types/contacts.ts`

---

### 2. Crear utilidad para abrir Settings del dispositivo

#### 2.1 Crear archivo `@/utils/deviceSettings.ts`
- Importar `Linking` y `Platform` de React Native
- Crear función `openDeviceSettings()` que:
  - En iOS: use `Linking.openSettings()`
  - En Android: use `Linking.openSettings()`
  - Maneje errores con try/catch
  - Retorne `Promise<boolean>` indicando éxito

#### 2.2 Agregar tipos
- Crear tipo de retorno para la función
- Documentar comportamiento por plataforma

---

### 3. Modificar `ContactPicker` component

#### 3.1 Agregar nuevos estados locales
- Estado `permissionDenied: boolean` para rastrear denegación
- Estado `canRequestAgain: boolean` para saber si puede pedir permiso nuevamente

#### 3.2 Actualizar lógica de `useEffect` inicial
- Cuando `visible` cambia a `true`, llamar `fetchContacts()`
- Capturar resultado de permiso
- Actualizar estados `permissionDenied` y `canRequestAgain` según respuesta

#### 3.3 Modificar función `renderEmptyState`
- Eliminar caso de error genérico con botón "Reintentar"
- Agregar caso específico para `permissionDenied === true`
- Renderizar nuevo componente `PermissionDeniedState`

#### 3.4 Crear componente interno `PermissionDeniedState`
- Mostrar icono 📱
- Mostrar título: "Permiso de contactos denegado"
- Mostrar mensaje explicativo claro
- Renderizar dos botones:
  - **Botón primario**: "Abrir Configuración" (si `canRequestAgain === false`)
  - **Botón secundario**: "Ingresar manualmente"

#### 3.5 Implementar handlers
- `handleOpenSettings`: llamar `openDeviceSettings()` de utils
- `handleManualEntry`: llamar `onClose()` para cerrar modal y permitir input manual

#### 3.6 Asegurar botón "Cerrar" siempre funcional
- Verificar que `handleClose` no tenga condiciones que lo bloqueen
- Asegurar que `TouchableOpacity` del botón cerrar no tenga `disabled`
- Verificar que estilos no incluyan `pointerEvents: 'none'`

---

### 4. Actualizar estilos de `ContactPicker`

#### 4.1 Agregar estilos para estado de permiso denegado
- `permissionDeniedContainer`: contenedor centrado con padding
- `permissionIcon`: estilo para emoji/icono grande
- `permissionTitle`: título en color error
- `permissionMessage`: mensaje descriptivo
- `permissionButtonPrimary`: botón para abrir settings
- `permissionButtonSecondary`: botón para entrada manual
- `permissionButtonText`: texto de botones

#### 4.2 Mantener consistencia con Theme
- Usar `Theme.colors.error` para textos de error
- Usar `Theme.spacing` para paddings
- Usar `Theme.typography` para textos

---

### 5. Actualizar `useContacts` hook

#### 5.1 Modificar estado interno
- Agregar `canAskAgain` al estado del hook
- Inicializar en `true` por defecto

#### 5.2 Actualizar `requestPermission`
- Capturar `canAskAgain` del resultado de `contactsService.requestPermission()`
- Actualizar estado `canAskAgain` con el valor recibido
- Retornar objeto con `{ granted: boolean, canAskAgain: boolean }`

#### 5.3 Actualizar `reset` function
- Resetear `canAskAgain` a `true` cuando se llame reset

#### 5.4 Actualizar return type
- Incluir `canAskAgain: boolean` en `UseContactsReturn`

---

### 6. Actualizar tests

#### 6.1 Tests de `useContacts.test.ts`
- Agregar test: "should track canAskAgain status when permission is denied"
- Agregar test: "should reset canAskAgain when reset is called"
- Modificar tests existentes para verificar `canAskAgain` en resultados

#### 6.2 Tests de `ContactPicker.test.tsx` (crear si no existe)
- Test: "should show permission denied state when permission is denied"
- Test: "should call onClose when 'Ingresar manualmente' is pressed"
- Test: "should open device settings when 'Abrir Configuración' is pressed"
- Test: "should always allow closing the modal via close button"

#### 6.3 Tests de `deviceSettings.test.ts`
- Test: "should call Linking.openSettings on iOS"
- Test: "should call Linking.openSettings on Android"
- Test: "should handle errors gracefully"

---

### 7. Validar flujo completo

#### 7.1 Escenario: Usuario niega permiso por primera vez
- Abrir modal de contactos
- Negar permiso cuando iOS/Android solicita
- Verificar que se muestra estado "Permiso denegado"
- Verificar que botón "Cerrar" funciona
- Verificar que "Ingresar manualmente" cierra modal
- Verificar que usuario puede completar transacción con input manual

#### 7.2 Escenario: Usuario niega permiso permanentemente
- Configurar permiso como "No volver a preguntar" en dispositivo
- Abrir modal de contactos
- Verificar que se muestra solo botón "Abrir Configuración"
- Verificar que al presionar se abre Settings del dispositivo

#### 7.3 Escenario: Usuario concede permiso después de denegar
- Negar permiso inicialmente
- Presionar "Abrir Configuración"
- Conceder permiso en Settings
- Volver a app
- Abrir modal de contactos nuevamente
- Verificar que ahora se cargan contactos correctamente

---

## Criterios de Aceptación

- [ ] Botón "Cerrar" siempre funciona, incluso en estado de error
- [ ] No existe loop infinito de "Reintentar"
- [ ] Usuario puede continuar transacción manualmente sin permisos
- [ ] Botón "Abrir Configuración" abre Settings del dispositivo
- [ ] Botón "Ingresar manualmente" cierra modal y permite input manual
- [ ] Mensajes son claros y empáticos
- [ ] Funciona en iOS y Android
- [ ] Tests cubren todos los casos de permiso

---

## Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| `Linking.openSettings()` no funciona en versiones antiguas | Agregar try/catch y mensaje alternativo |
| Usuario confundido por múltiples opciones | Priorizar visualmente "Ingresar manualmente" |
| Estado de permiso no se actualiza después de Settings | Agregar listener de `AppState` para refrescar al volver |

---

## Notas de Implementación

- Seguir reglas de `.ai/rules.md`
- No usar `any` en tipos
- Usar `StyleSheet.create()` para estilos
- Usar alias `@/` para imports
- Mantener separación UI/lógica
- Agregar tests para validaciones críticas
