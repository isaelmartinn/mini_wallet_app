import React from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { Transaction } from '@/types';
import { TransactionItem } from '../TransactionItem';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { styles } from './TransactionList.styles';
import { Theme } from '@/theme';

interface TransactionListProps {
  transactions: Transaction[];
  isRefreshing: boolean;
  onRefresh: () => void;
  hasError: boolean;
  onRetry: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isRefreshing,
  onRefresh,
  hasError,
  onRetry,
}) => {
  if (hasError && transactions.length === 0) {
    return <ErrorState onRetry={onRetry} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movimientos recientes</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Theme.colors.primary}
            colors={[Theme.colors.primary]}
          />
        }
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          transactions.length === 0 ? styles.emptyList : undefined
        }
      />
    </View>
  );
};
