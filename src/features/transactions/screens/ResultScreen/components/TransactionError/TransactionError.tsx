import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { XCircle, WifiOff, Clock, AlertCircle } from 'lucide-react-native';
import { Button } from '@/components';
import { TransactionErrorType } from '@/types';
import { Theme } from '@/theme';
import { styles } from './TransactionError.styles';

interface TransactionErrorProps {
  errorType: TransactionErrorType;
  errorMessage: string;
  canRetry: boolean;
  isProcessing: boolean;
  onRetry: () => void;
  onGoHome: () => void;
}

export const TransactionError: React.FC<TransactionErrorProps> = ({
  errorType,
  errorMessage,
  canRetry,
  isProcessing,
  onRetry,
  onGoHome,
}) => {
  const getErrorIcon = (): JSX.Element => {
    switch (errorType) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getErrorIcon()}</View>

        <Text style={styles.title}>Transacción fallida</Text>
        <Text style={styles.message}>{errorMessage}</Text>

        <View style={styles.actions}>
          {canRetry && (
            <Button
              title={isProcessing ? 'Reintentando...' : 'Reintentar'}
              onPress={onRetry}
              disabled={isProcessing}
            />
          )}
          <Button
            title="Volver al inicio"
            onPress={onGoHome}
            variant={canRetry ? 'secondary' : 'primary'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
