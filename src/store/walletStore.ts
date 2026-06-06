import {create} from 'zustand';
import {WalletState} from '@/types';
import {walletApi} from '@/api/wallet';

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  isRefreshing: false,
  error: null,

  fetchWalletData: async () => {
    if (get().isLoading) {
      return;
    }

    set({isLoading: true, error: null});

    try {
      const response = await walletApi.getWalletData();

      if (response.success) {
        set({
          balance: response.balance,
          transactions: response.transactions,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Error al cargar los datos',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: 'Error de conexión. Intenta de nuevo.',
        isLoading: false,
      });
    }
  },

  refreshWalletData: async () => {
    if (get().isRefreshing) {
      return;
    }

    set({isRefreshing: true, error: null});

    try {
      const response = await walletApi.getWalletData();

      if (response.success) {
        set({
          balance: response.balance,
          transactions: response.transactions,
          isRefreshing: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Error al actualizar los datos',
          isRefreshing: false,
        });
      }
    } catch (error) {
      set({
        error: 'Error de conexión. Intenta de nuevo.',
        isRefreshing: false,
      });
    }
  },

  addTransaction: transaction => {
    set(state => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  updateBalance: amount => {
    set(state => ({
      balance: state.balance - amount,
    }));
  },

  clearError: () => {
    set({error: null});
  },
}));
