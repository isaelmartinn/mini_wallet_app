import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './PermissionDeniedState.styles';

interface PermissionDeniedStateProps {
  canAskAgain: boolean;
  onOpenSettings: () => void;
  onManualEntry: () => void;
}

export const PermissionDeniedState: React.FC<PermissionDeniedStateProps> = ({
  canAskAgain,
  onOpenSettings,
  onManualEntry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📱</Text>
      <Text style={styles.title}>Permiso de contactos denegado</Text>
      <Text style={styles.message}>
        Para seleccionar contactos, necesitamos acceso a tu lista de contactos.
        {canAskAgain
          ? ' Puedes continuar ingresando los datos manualmente.'
          : ' Puedes habilitar el permiso en la configuración de tu dispositivo o continuar manualmente.'}
      </Text>

      {!canAskAgain && (
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={onOpenSettings}
          activeOpacity={0.8}>
          <Text style={styles.buttonTextPrimary}>Abrir Configuración</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={onManualEntry}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Ingresar manualmente</Text>
      </TouchableOpacity>
    </View>
  );
};
