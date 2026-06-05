import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Theme} from '../../../theme';
import {useAppStore} from '../../../store';

export const WalletScreen = () => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
});
