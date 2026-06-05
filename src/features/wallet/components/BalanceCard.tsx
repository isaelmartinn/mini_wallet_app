import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './BalanceCard.styles';
import {formatCurrency} from '@/utils/currency';

interface BalanceCardProps {
  balance: number;
  userName?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({balance, userName}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {userName || 'Usuario'}</Text>
        <Text style={styles.label}>Saldo disponible</Text>
      </View>
      <Text style={styles.balance}>{formatCurrency(balance)}</Text>
    </View>
  );
};
