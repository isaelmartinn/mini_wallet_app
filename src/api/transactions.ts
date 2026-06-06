import {TransactionResult, TransactionErrorType} from '@/types';

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const getRandomOutcome = (): {
  success: boolean;
  errorType?: TransactionErrorType;
} => {
  const random = Math.random();

  if (random < 0.6) {
    return {success: true};
  }

  if (random < 0.7) {
    return {success: false, errorType: 'insufficient_funds'};
  }

  if (random < 0.85) {
    return {success: false, errorType: 'network_error'};
  }

  if (random < 0.95) {
    return {success: false, errorType: 'timeout'};
  }

  return {success: false, errorType: 'unknown'};
};

export const transactionsApi = {
  sendMoney: async (
    amount: number,
    recipientName: string,
  ): Promise<TransactionResult> => {
    await delay(2000);

    const outcome = getRandomOutcome();

    if (outcome.success) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
    }

    const errorMessages: Record<TransactionErrorType, string> = {
      insufficient_funds: 'No tienes saldo suficiente para completar esta transacción',
      network_error: 'Error de conexión. Por favor, intenta nuevamente',
      timeout: 'La transacción tardó demasiado. Intenta de nuevo',
      unknown: 'Ocurrió un error inesperado. Por favor, intenta más tarde',
    };

    return {
      success: false,
      errorType: outcome.errorType,
      errorMessage: errorMessages[outcome.errorType!],
    };
  },
};
