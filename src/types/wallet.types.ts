export type TransactionType = 'in' | 'out';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  recipient?: string;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  fetchWalletData: () => Promise<void>;
  refreshWalletData: () => Promise<void>;
  clearError: () => void;
}
