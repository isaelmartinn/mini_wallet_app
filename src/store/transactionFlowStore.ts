import {create} from 'zustand';
import {TransactionFlowState, TransactionResult, TransactionErrorType} from '@/types';
import {transactionsApi} from '@/api/transactions';
import {TRANSACTION_RULES} from '@/features/transactions/constants';

const initialDraft = {
  amount: 0,
  recipient: null,
  fee: TRANSACTION_RULES.DEFAULT_FEE,
};

export const useTransactionFlowStore = create<TransactionFlowState>((set, get) => ({
  draft: initialDraft,
  isProcessing: false,
  result: null,

  setAmount: (amount: number) => {
    set(state => ({
      draft: {
        ...state.draft,
        amount,
      },
    }));
  },

  setRecipient: recipient => {
    set(state => ({
      draft: {
        ...state.draft,
        recipient,
      },
    }));
  },

  processTransaction: async (): Promise<TransactionResult> => {
    const {draft} = get();

    if (!draft.recipient) {
      const errorResult: TransactionResult = {
        success: false,
        errorType: TransactionErrorType.UNKNOWN,
        errorMessage: 'Destinatario no válido',
      };
      set({result: errorResult, isProcessing: false});
      return errorResult;
    }

    set({isProcessing: true, result: null});

    try {
      const result = await transactionsApi.sendMoney(
        draft.amount,
        draft.recipient.name,
      );

      set({result, isProcessing: false});
      return result;
    } catch (error) {
      const errorResult: TransactionResult = {
        success: false,
        errorType: TransactionErrorType.UNKNOWN,
        errorMessage: 'Error al procesar la transacción',
      };
      set({result: errorResult, isProcessing: false});
      return errorResult;
    }
  },

  reset: () => {
    set({
      draft: initialDraft,
      isProcessing: false,
      result: null,
    });
  },
}));
