import {useEffect} from 'react';
import {useWalletStore} from '@/store';

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

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

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
