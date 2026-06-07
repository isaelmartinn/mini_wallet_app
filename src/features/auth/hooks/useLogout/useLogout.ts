import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { useTransactionFlowStore } from '@/store/transactionFlowStore';

export const useLogout = () => {
  const authLogout = useAuthStore(state => state.logout);
  const walletReset = useWalletStore(state => state.reset);
  const transactionReset = useTransactionFlowStore(state => state.reset);

  const logout = useCallback(() => {
    walletReset();
    transactionReset();
    authLogout();
  }, [authLogout, walletReset, transactionReset]);

  return { logout };
};
