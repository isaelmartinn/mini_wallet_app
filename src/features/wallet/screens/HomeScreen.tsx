import React from 'react';
import {SafeAreaView, View, ActivityIndicator} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAuthStore} from '@/store/authStore';
import {BalanceCard, TransactionList} from '../components';
import {useWallet} from '../hooks';
import {styles} from './HomeScreen.styles';
import {Theme} from '@/theme';
import {AppStackParamList} from '@/navigation/types';

type HomeScreenProps = {
  navigation: StackNavigationProp<AppStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {user} = useAuthStore();
  const {balance, transactions, isLoading, isRefreshing, error, handleRefresh, handleRetry} = useWallet();

  const handleSendMoney = (): void => {
    navigation.navigate('Amount');
  };

  if (isLoading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BalanceCard
        balance={balance}
        userName={user?.name}
        onSendMoney={handleSendMoney}
      />

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
