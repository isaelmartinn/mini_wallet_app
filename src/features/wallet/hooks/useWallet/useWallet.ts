import { useWalletStore } from '@/store/walletStore';

export const useWallet = () => {
  const {
    balance,
    transactions,
    isLoading,
    isRefreshing,
    error,
    fetchWalletData,
    refreshWalletData,
    clearError,
  } = useWalletStore();

  const handleRefresh = () => {
    refreshWalletData();
  };

  const handleRetry = () => {
    clearError();
    fetchWalletData();
  };

  return {
    balance,
    transactions,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
    handleRetry,
  };
};
