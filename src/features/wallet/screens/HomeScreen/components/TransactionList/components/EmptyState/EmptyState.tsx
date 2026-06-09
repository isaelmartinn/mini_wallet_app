import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './EmptyState.styles';

export const EmptyState: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.icon}>💳</Text>
    <Text style={styles.title}>No hay transacciones</Text>
    <Text style={styles.text}>Tus movimientos aparecerán aquí</Text>
  </View>
);
