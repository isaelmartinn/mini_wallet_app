import {TransactionResult, TransactionErrorType} from '@/types';

const generateId = (): string => {
  const timestamp = Date.now();
  const random1 = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  return `TXN-${timestamp}-${random1}${random2}`;
};

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const TRANSACTION_OUTCOME_PERCENTAGES = {
  SUCCESS: 60,
  INSUFFICIENT_FUNDS: 10,
  NETWORK_ERROR: 15,
  TIMEOUT: 10,
  UNKNOWN: 5,
};

const getRandomOutcome = (): {
  success: boolean;
  errorType?: TransactionErrorType;
} => {
  const random = Math.random() * 100;
  console.log('Random:', random);

  if (random < TRANSACTION_OUTCOME_PERCENTAGES.SUCCESS) {
    return {success: true};
  }

  if (random < TRANSACTION_OUTCOME_PERCENTAGES.SUCCESS + TRANSACTION_OUTCOME_PERCENTAGES.INSUFFICIENT_FUNDS) {
    return {success: false, errorType: TransactionErrorType.INSUFFICIENT_FUNDS};
  }

  if (random < TRANSACTION_OUTCOME_PERCENTAGES.SUCCESS + TRANSACTION_OUTCOME_PERCENTAGES.INSUFFICIENT_FUNDS + TRANSACTION_OUTCOME_PERCENTAGES.NETWORK_ERROR) {
    return {success: false, errorType: TransactionErrorType.NETWORK_ERROR};
  }

  if (random < TRANSACTION_OUTCOME_PERCENTAGES.SUCCESS + TRANSACTION_OUTCOME_PERCENTAGES.INSUFFICIENT_FUNDS + TRANSACTION_OUTCOME_PERCENTAGES.NETWORK_ERROR + TRANSACTION_OUTCOME_PERCENTAGES.TIMEOUT) {
    return {success: false, errorType: TransactionErrorType.TIMEOUT};
  }

  return {success: false, errorType: TransactionErrorType.UNKNOWN};
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
        transactionId: generateId(),
      };
    }

    const errorMessages: Record<TransactionErrorType, string> = {
      [TransactionErrorType.INSUFFICIENT_FUNDS]: 'No tienes saldo suficiente para completar esta transacción',
      [TransactionErrorType.NETWORK_ERROR]: 'Error de conexión. Por favor, intenta nuevamente',
      [TransactionErrorType.TIMEOUT]: 'La transacción tardó demasiado. Intenta de nuevo',
      [TransactionErrorType.UNKNOWN]: 'Ocurrió un error inesperado. Por favor, intenta más tarde',
    };

    return {
      success: false,
      errorType: outcome.errorType,
      errorMessage: errorMessages[outcome.errorType!],
    };
  },
};
