import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Theme} from '../../../theme';

export const SplashScreen = () => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xl,
  },
  loader: {
    marginTop: Theme.spacing.md,
  },
});
