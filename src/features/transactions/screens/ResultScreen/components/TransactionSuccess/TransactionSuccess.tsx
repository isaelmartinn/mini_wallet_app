import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Button } from '@/components';
import { formatAmount } from '@/utils/currency';
import { Theme } from '@/theme';
import { styles } from './TransactionSuccess.styles';

interface TransactionSuccessProps {
  transactionId: string;
  recipientName: string;
  amount: number;
  onGoHome: () => void;
  onNewTransaction: () => void;
}

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
  transactionId,
  recipientName,
  amount,
  onGoHome,
  onNewTransaction,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Theme.colors.success} />
        </View>

        <Text style={styles.title}>¡Transacción exitosa!</Text>
        <Text style={styles.message}>
          Tu dinero ha sido enviado correctamente
        </Text>

        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>ID de transacción</Text>
            <Text style={styles.receiptValue}>{transactionId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Destinatario</Text>
            <Text style={styles.receiptValue}>{recipientName}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Monto enviado</Text>
            <Text style={[styles.receiptValue, styles.amountValue]}>
              ${formatAmount(amount)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Volver al inicio" onPress={onGoHome} />
          <Button
            title="Nueva transacción"
            onPress={onNewTransaction}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
