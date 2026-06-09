import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './NoResultsState.styles';

export const NoResultsState: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No se encontraron contactos</Text>
    </View>
  );
};
