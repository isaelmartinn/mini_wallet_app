import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './NoContactsState.styles';

export const NoContactsState: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No hay contactos disponibles</Text>
    </View>
  );
};
