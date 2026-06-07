import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './WalletScreen.styles';
import {useAppStore} from '@/store/useAppStore';

export const WalletScreen: React.FC = () => {
  const {isLoading} = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.subtitle}>
        {isLoading ? 'Loading...' : 'Your wallet is ready'}
      </Text>
    </View>
  );
};
