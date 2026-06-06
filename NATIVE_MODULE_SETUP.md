# Configuración del Módulo Nativo de Contactos

Este documento describe los pasos necesarios para configurar el módulo nativo de contactos en iOS.

## ⚠️ Importante

El módulo nativo ya está implementado en el código, pero **requiere configuración manual en Xcode** para iOS.

## Android ✅

La configuración de Android está **completa y lista para usar**:
- ✅ Archivos Kotlin creados
- ✅ Package registrado en `MainApplication.kt`
- ✅ Permiso agregado en `AndroidManifest.xml`

No se requiere ninguna acción adicional para Android.

## iOS ⚙️

### Archivos Creados

Los siguientes archivos ya existen en el proyecto:
- `ios/MiniWalletApp/ContactsModule.h`
- `ios/MiniWalletApp/ContactsModule.m`
- Permiso agregado en `ios/MiniWalletApp/Info.plist`

### Pasos de Configuración en Xcode

1. **Abrir el proyecto en Xcode**
   ```bash
   cd ios
   open MiniWalletApp.xcodeproj
   ```

2. **Agregar archivos al proyecto**
   - En el navegador de proyectos (izquierda), haz clic derecho en la carpeta `MiniWalletApp`
   - Selecciona "Add Files to MiniWalletApp..."
   - Navega a `ios/MiniWalletApp/`
   - Selecciona ambos archivos:
     - `ContactsModule.h`
     - `ContactsModule.m`
   - Asegúrate de marcar:
     - ✅ "Copy items if needed"
     - ✅ "Create groups"
     - ✅ Target: MiniWalletApp

3. **Verificar que los archivos estén en el target**
   - Selecciona el proyecto en el navegador
   - Ve a la pestaña "Build Phases"
   - Expande "Compile Sources"
   - Verifica que `ContactsModule.m` esté en la lista
   - Si no está, haz clic en "+" y agrégalo

4. **Limpiar y reconstruir**
   ```bash
   cd ios
   rm -rf build
   pod install
   cd ..
   ```

5. **Ejecutar en simulador/dispositivo**
   ```bash
   yarn ios
   ```

### Verificación

Para verificar que el módulo está correctamente configurado:

1. Ejecuta la app en iOS
2. Navega a la pantalla de "Nueva Transacción"
3. Deberías ver el botón "📱 Seleccionar de contactos"
4. Al tocarlo, se solicitará permiso de contactos

Si el botón no aparece, revisa los logs de Metro:
```bash
# Buscar errores relacionados con ContactsModule
```

## Troubleshooting

### El botón de contactos no aparece

**Causa**: El módulo nativo no está disponible.

**Solución**:
1. Verifica que los archivos estén agregados al target en Xcode
2. Limpia el build: `cd ios && rm -rf build && cd ..`
3. Reinstala pods: `cd ios && pod install && cd ..`
4. Reconstruye: `yarn ios`

### Error: "ContactsModule is not available"

**Causa**: Los archivos no están compilados en el bundle.

**Solución**:
1. Abre Xcode
2. Ve a Build Phases > Compile Sources
3. Agrega `ContactsModule.m` si no está presente
4. Reconstruye el proyecto

### Permiso no se solicita en iOS

**Causa**: `NSContactsUsageDescription` no está en Info.plist.

**Solución**:
1. Abre `ios/MiniWalletApp/Info.plist`
2. Verifica que exista la clave `NSContactsUsageDescription`
3. Si no existe, agrégala:
   ```xml
   <key>NSContactsUsageDescription</key>
   <string>Esta app necesita acceso a tus contactos para facilitar el envío de dinero a tus conocidos.</string>
   ```

### Error de compilación en Xcode

**Causa**: Configuración incorrecta del proyecto.

**Solución**:
1. Limpia el proyecto: Product > Clean Build Folder (Cmd+Shift+K)
2. Cierra Xcode
3. Elimina DerivedData:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
4. Reinstala pods:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   ```
5. Abre Xcode y reconstruye

## Testing

### Probar en Simulador

El simulador de iOS tiene contactos de prueba por defecto. Para agregar más:

1. Abre la app "Contacts" en el simulador
2. Agrega contactos manualmente
3. Vuelve a la app y prueba el selector de contactos

### Probar en Dispositivo Real

1. Conecta un dispositivo iOS
2. Selecciona el dispositivo en Xcode
3. Ejecuta la app
4. Otorga permiso de contactos cuando se solicite
5. Tus contactos reales aparecerán en el selector

## Notas Adicionales

- El módulo limita la búsqueda a **100 contactos** para optimizar rendimiento
- Solo se muestra el **primer número de teléfono** de cada contacto
- La búsqueda es **local** (en JavaScript), no requiere llamadas nativas adicionales
- El **fallback manual** siempre está disponible si el usuario niega el permiso

## Documentación Completa

Para más detalles sobre la implementación, consulta:
- `docs/NATIVE_CONTACTS_MODULE.md` - Documentación técnica completa
- `DECISIONS.md` - Decisiones arquitectónicas
