import React, { useEffect, useRef } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  CheckCircle,
  XCircle,
  WifiOff,
  Clock,
  AlertCircle,
} from 'lucide-react-native';
import { useTransactionFlowStore } from '@/store/transactionFlowStore';
import { useWalletStore } from '@/store/walletStore';
import { TransactionErrorType } from '@/types';
import { Button } from '@/components';
import { formatAmount } from '@/utils/currency';
import { AppStackParamList } from '@/navigation/types';
import { Theme } from '@/theme';
import { styles } from './ResultScreen.styles';

type ResultScreenProps = {
  navigation: StackNavigationProp<AppStackParamList, 'Result'>;
};

export const ResultScreen: React.FC<ResultScreenProps> = ({ navigation }) => {
  const { result, draft, reset, processTransaction, isProcessing } =
    useTransactionFlowStore();
  const { addTransaction, updateBalance } = useWalletStore();
  const processedTransactionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      result?.success &&
      result.transactionId &&
      draft.recipient &&
      processedTransactionIdRef.current !== result.transactionId
    ) {
      const newTransaction = {
        id: result.transactionId,
        amount: draft.amount,
        date: new Date().toISOString(),
        description: `Transferencia a ${draft.recipient.name}`,
        type: 'out' as const,
        status: 'completed' as const,
        recipient: draft.recipient.name,
      };

      addTransaction(newTransaction);
      updateBalance(draft.amount);
      processedTransactionIdRef.current = result.transactionId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.success, result?.transactionId]);

  const handleRetry = async (): Promise<void> => {
    await processTransaction();
  };

  const handleGoHome = (): void => {
    reset();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleNewTransaction = (): void => {
    reset();
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Amount' }],
    });
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (result.success) {
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
              <Text style={styles.receiptValue}>{result.transactionId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Destinatario</Text>
              <Text style={styles.receiptValue}>{draft.recipient?.name}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Monto enviado</Text>
              <Text style={[styles.receiptValue, styles.amountValue]}>
                ${formatAmount(draft.amount)}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button title="Volver al inicio" onPress={handleGoHome} />
            <Button
              title="Nueva transacción"
              onPress={handleNewTransaction}
              variant="secondary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const getErrorIcon = (): JSX.Element => {
    switch (result.errorType) {
      case TransactionErrorType.INSUFFICIENT_FUNDS:
        return <AlertCircle size={80} color={Theme.colors.error} />;
      case TransactionErrorType.NETWORK_ERROR:
        return <WifiOff size={80} color={Theme.colors.error} />;
      case TransactionErrorType.TIMEOUT:
        return <Clock size={80} color={Theme.colors.warning} />;
      default:
        return <XCircle size={80} color={Theme.colors.error} />;
    }
  };

  const canRetry =
    result.errorType === TransactionErrorType.NETWORK_ERROR ||
    result.errorType === TransactionErrorType.TIMEOUT;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getErrorIcon()}</View>

        <Text style={styles.title}>Transacción fallida</Text>
        <Text style={styles.message}>{result.errorMessage}</Text>

        <View style={styles.actions}>
          {canRetry && (
            <Button
              title={isProcessing ? 'Reintentando...' : 'Reintentar'}
              onPress={handleRetry}
              disabled={isProcessing}
            />
          )}
          <Button
            title="Volver al inicio"
            onPress={handleGoHome}
            variant={canRetry ? 'secondary' : 'primary'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
