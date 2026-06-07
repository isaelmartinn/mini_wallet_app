import React from 'react';
import {SafeAreaView, View, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Menu} from 'lucide-react-native';
import {useAuthStore} from '@/store/authStore';
import {BalanceCard, TransactionList} from '../components';
import {useWallet} from '../hooks';
import {styles} from './HomeScreen.styles';
import {Theme} from '@/theme';
import {AppStackParamList} from '@/navigation/types';

type HomeScreenProps = {
  navigation: DrawerNavigationProp<AppStackParamList, 'Home'>;
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Billetera</Text>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
          activeOpacity={0.7}>
          <Menu size={24} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

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
