import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Theme} from '@/theme';
import {styles} from './SplashScreen.styles';

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini Wallet</Text>
      <ActivityIndicator
        size="large"
        color={Theme.colors.primary}
        style={styles.loader}
      />
    </View>
  );
};
