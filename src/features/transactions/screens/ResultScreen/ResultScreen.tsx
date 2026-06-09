import React, { useEffect, useRef } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTransactionFlowStore } from '@/store/transactionFlowStore';
import { useWalletStore } from '@/store/walletStore';
import { TransactionErrorType } from '@/types';
import { AppStackParamList } from '@/navigation/types';
import { TransactionSuccess } from './components/TransactionSuccess';
import { TransactionError } from './components/TransactionError';
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
  }, [
    result?.success,
    result?.transactionId,
    draft.amount,
    draft.recipient,
    addTransaction,
    updateBalance,
  ]);

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
      <TransactionSuccess
        transactionId={result.transactionId || ''}
        recipientName={draft.recipient?.name || ''}
        amount={draft.amount}
        onGoHome={handleGoHome}
        onNewTransaction={handleNewTransaction}
      />
    );
  }

  const canRetry =
    result.errorType === TransactionErrorType.NETWORK_ERROR ||
    result.errorType === TransactionErrorType.TIMEOUT;

  return (
    <TransactionError
      errorType={result.errorType || TransactionErrorType.UNKNOWN}
      errorMessage={result.errorMessage || 'Error desconocido'}
      canRetry={canRetry}
      isProcessing={isProcessing}
      onRetry={handleRetry}
      onGoHome={handleGoHome}
    />
  );
};
