import React from 'react';
import {SafeAreaView, View, ActivityIndicator} from 'react-native';
import {useAuthStore} from '@/store/authStore';
import {BalanceCard, TransactionList} from '../components';
import {useWallet} from '../hooks';
import {styles} from './HomeScreen.styles';
import {Theme} from '@/theme';

export const HomeScreen: React.FC = () => {
  const {user} = useAuthStore();
  const {balance, transactions, isLoading, isRefreshing, error, handleRefresh, handleRetry} = useWallet();

  if (isLoading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BalanceCard balance={balance} userName={user?.name} />

      <TransactionList
        transactions={transactions}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        hasError={!!error}
        onRetry={handleRetry}
      />
    </SafeAreaView>
  );
};
