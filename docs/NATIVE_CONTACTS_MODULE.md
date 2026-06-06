# Módulo Nativo de Contactos

## Descripción

Implementación de un módulo nativo personalizado para acceder a los contactos del dispositivo en iOS y Android. Este módulo permite a la aplicación obtener la lista de contactos del usuario para facilitar el envío de dinero.

## Arquitectura

### Decisión Técnica: Legacy Bridge

Se eligió la arquitectura **Legacy Bridge** en lugar de TurboModules por las siguientes razones:

1. **Compatibilidad**: React Native 0.76.5 soporta ambas arquitecturas, pero el Legacy Bridge es más estable y ampliamente probado.
2. **Simplicidad**: Para un módulo de demostración, el Legacy Bridge ofrece una implementación más directa.
3. **Documentación**: Mayor cantidad de recursos y ejemplos disponibles.
4. **Debugging**: Herramientas de debugging más maduras y conocidas.

## Componentes

### 1. Capa Nativa

#### Android (Kotlin)
- **Ubicación**: `android/app/src/main/java/com/miniwalletapp/contacts/`
- **Archivos**:
  - `ContactsModule.kt`: Implementación del módulo nativo
  - `ContactsPackage.kt`: Package para registrar el módulo

**Funcionalidades**:
- Solicitud de permisos `READ_CONTACTS`
- Lectura de contactos usando `ContentResolver`
- Limitación a 100 contactos para optimizar rendimiento
- Manejo de permisos runtime (Android 6.0+)

#### iOS (Objective-C)
- **Ubicación**: `ios/MiniWalletApp/`
- **Archivos**:
  - `ContactsModule.h`: Header del módulo
  - `ContactsModule.m`: Implementación del módulo

**Funcionalidades**:
- Solicitud de permisos usando `CNContactStore`
- Lectura de contactos con `CNContactFetchRequest`
- Limitación a 100 contactos
- Descripción de privacidad en `Info.plist`

### 2. Capa TypeScript

#### Tipos
- **Ubicación**: `src/types/contacts.ts`
- **Interfaces**:
  - `Contact`: Representa un contacto con id, nombre y teléfono
  - `ContactsPermissionStatus`: Estado del permiso
  - `ContactsModuleInterface`: Contrato del módulo nativo

#### Servicio
- **Ubicación**: `src/services/ContactsService.ts`
- **Responsabilidades**:
  - Abstracción del módulo nativo
  - Manejo de errores
  - Validación de disponibilidad del módulo

#### Hook
- **Ubicación**: `src/hooks/useContacts.ts`
- **Funcionalidades**:
  - Gestión de estado (contactos, loading, error)
  - Solicitud de permisos
  - Obtención de contactos
  - Reset de estado

### 3. Componente UI

#### ContactPicker
- **Ubicación**: `src/components/ContactPicker/`
- **Características**:
  - Modal fullscreen
  - Búsqueda en tiempo real
  - Lista optimizada con FlatList
  - Estados: loading, error, empty
  - Avatar con inicial del nombre

## Flujo de Uso

1. Usuario abre pantalla de destinatario
2. Si el módulo está disponible, se muestra botón "Seleccionar de contactos"
3. Usuario toca el botón
4. Se abre el ContactPicker modal
5. Se solicita permiso si no está otorgado
6. Se cargan los contactos
7. Usuario puede buscar y seleccionar un contacto
8. Los datos del contacto se auto-completan en el formulario

## Manejo de Permisos

### Android
- Permiso declarado en `AndroidManifest.xml`
- Solicitud runtime con `PermissionAwareActivity`
- Manejo de denegación con fallback manual

### iOS
- Descripción en `Info.plist`: `NSContactsUsageDescription`
- Solicitud con `CNContactStore.requestAccess`
- Manejo de estados: authorized, denied, restricted

## Fallback Manual

Si el usuario **niega el permiso** o el **módulo no está disponible**:
- El botón de contactos no se muestra
- El formulario manual sigue completamente funcional
- No hay bloqueo del flujo de transacción

## Optimizaciones

1. **Límite de contactos**: Máximo 100 contactos para evitar problemas de rendimiento
2. **Deduplicación**: Se evitan contactos duplicados por ID
3. **Búsqueda local**: Filtrado en memoria sin llamadas nativas adicionales
4. **Lazy loading**: Los contactos solo se cargan cuando se abre el modal

## Testing

### Unit Tests
- **ContactsService**: Mock del NativeModule
- **useContacts**: Testing de estados y flujos
- **Cobertura**: Casos de éxito, error y edge cases

### Comandos
```bash
# Ejecutar tests
yarn test

# Tests específicos del módulo
yarn test ContactsService
yarn test useContacts
```

## Instalación y Configuración

### Android
1. Los archivos Kotlin ya están en su lugar
2. El package está registrado en `MainApplication.kt`
3. El permiso está en `AndroidManifest.xml`

### iOS
1. Los archivos Objective-C están en el proyecto
2. Agregar archivos al proyecto Xcode:
   - Abrir `ios/MiniWalletApp.xcodeproj`
   - Agregar `ContactsModule.h` y `ContactsModule.m` al target
3. El permiso está en `Info.plist`

### Rebuild Nativo
```bash
# Android
yarn android

# iOS
cd ios && pod install && cd ..
yarn ios
```

## Limitaciones Conocidas

1. **Límite de 100 contactos**: Para evitar problemas de rendimiento en dispositivos con muchos contactos
2. **Un número por contacto**: Solo se toma el primer número de teléfono
3. **Sin fotos**: No se cargan las fotos de los contactos para optimizar memoria
4. **Sin sincronización**: Los contactos se cargan cada vez que se abre el modal

## Mejoras Futuras

1. **Paginación**: Cargar contactos en lotes
2. **Caché**: Guardar contactos en memoria durante la sesión
3. **Múltiples números**: Permitir seleccionar entre varios números del mismo contacto
4. **Fotos**: Cargar avatares reales de los contactos
5. **TurboModules**: Migrar a la nueva arquitectura cuando sea estable
6. **Sincronización**: Detectar cambios en contactos y actualizar automáticamente

## Referencias

- [React Native Native Modules (Android)](https://reactnative.dev/docs/native-modules-android)
- [React Native Native Modules (iOS)](https://reactnative.dev/docs/native-modules-ios)
- [Android Contacts Provider](https://developer.android.com/guide/topics/providers/contacts-provider)
- [iOS Contacts Framework](https://developer.apple.com/documentation/contacts)
