import React from 'react';
import { View, Text } from 'react-native';
import { Send } from 'lucide-react-native';
import { styles } from './BalanceCard.styles';
import { formatCurrency } from '@/utils/currency';
import { Button } from '@/components';
import { Theme } from '@/theme';

interface BalanceCardProps {
  balance: number;
  userName?: string;
  onSendMoney?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  userName,
  onSendMoney,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {userName || 'Usuario'}</Text>
        <Text style={styles.label}>Saldo disponible</Text>
      </View>
      <Text style={styles.balance}>{formatCurrency(balance)}</Text>

      {onSendMoney && (
        <View style={styles.actions}>
          <Button
            title="Enviar dinero"
            onPress={onSendMoney}
            leftIcon={<Send size={20} color={Theme.colors.background} />}
            fullWidth
          />
        </View>
      )}
    </View>
  );
};
