import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components';
import { styles } from './ErrorState.styles';

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>⚠️</Text>
    <Text style={styles.title}>Error al cargar transacciones</Text>
    <Text style={styles.text}>No pudimos cargar tus movimientos</Text>
    <Button title="Reintentar" onPress={onRetry} variant="outline" />
  </View>
);
