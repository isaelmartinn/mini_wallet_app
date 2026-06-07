import React from 'react';
import { View, Text } from 'react-native';
import { Transaction } from '@/types';
import { styles } from './TransactionItem.styles';
import { formatCurrency } from '@/utils/currency';

interface TransactionItemProps {
  transaction: Transaction;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) {
    return 'Hace unos minutos';
  }
  if (diffInHours < 24) {
    return `Hace ${diffInHours}h`;
  }
  if (diffInHours < 48) {
    return 'Ayer';
  }

  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  const isIncoming = transaction.type === 'in';
  const isPending = transaction.status === 'pending';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          isIncoming ? styles.iconIncoming : styles.iconOutgoing,
        ]}>
        <Text style={styles.iconText}>{isIncoming ? '↓' : '↑'}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
          {isPending && <Text style={styles.pendingBadge}>Pendiente</Text>}
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            isIncoming ? styles.amountIncoming : styles.amountOutgoing,
          ]}>
          {isIncoming ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </View>
  );
};
