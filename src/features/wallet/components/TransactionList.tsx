import React from 'react';
import {FlatList, RefreshControl, View, Text} from 'react-native';
import {Transaction} from '@/types';
import {TransactionItem} from './TransactionItem';
import {Button} from '@/components';
import {styles} from './TransactionList.styles';
import {Theme} from '@/theme';

interface TransactionListProps {
  transactions: Transaction[];
  isRefreshing: boolean;
  onRefresh: () => void;
  hasError: boolean;
  onRetry: () => void;
}

const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>💳</Text>
    <Text style={styles.emptyTitle}>No hay transacciones</Text>
    <Text style={styles.emptyText}>Tus movimientos aparecerán aquí</Text>
  </View>
);

const ErrorState: React.FC<{onRetry: () => void}> = ({onRetry}) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Error al cargar transacciones</Text>
    <Text style={styles.errorText}>No pudimos cargar tus movimientos</Text>
    <Button title="Reintentar" onPress={onRetry} variant="outline" />
  </View>
);

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
        renderItem={({item}) => <TransactionItem transaction={item} />}
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
        contentContainerStyle={transactions.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
};
