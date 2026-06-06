export interface Recipient {
  name: string;
  accountOrPhone: string;
}

export interface TransactionDraft {
  amount: number;
  recipient: Recipient | null;
  fee: number;
}

export type TransactionErrorType = 
  | 'insufficient_funds'
  | 'network_error'
  | 'timeout'
  | 'unknown';

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  errorType?: TransactionErrorType;
  errorMessage?: string;
}

export interface TransactionFlowState {
  draft: TransactionDraft;
  isProcessing: boolean;
  result: TransactionResult | null;
  
  setAmount: (amount: number) => void;
  setRecipient: (recipient: Recipient) => void;
  processTransaction: () => Promise<TransactionResult>;
  reset: () => void;
}

export interface AmountValidation {
  isValid: boolean;
  error?: string;
}

export interface RecipientValidation {
  isValid: boolean;
  errors: {
    name?: string;
    accountOrPhone?: string;
  };
}
