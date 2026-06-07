export interface Recipient {
  name: string;
  accountOrPhone: string;
}

export interface TransactionDraft {
  amount: number;
  recipient: Recipient | null;
  fee: number;
}

export enum TransactionErrorType {
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

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

export interface InactivityTimeoutConfig {
  timeoutMs: number;
  enabled: boolean;
}

export type TimeoutReason = 'inactivity' | 'session_expired';
