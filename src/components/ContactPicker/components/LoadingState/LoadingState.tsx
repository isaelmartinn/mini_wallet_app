import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from './LoadingState.styles';

export const LoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.text}>Cargando contactos...</Text>
    </View>
  );
};
