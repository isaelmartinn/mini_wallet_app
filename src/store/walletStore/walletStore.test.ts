import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useWalletStore } from './walletStore';
import { walletApi } from '@/api/wallet';
import { useAuthStore } from '@/store/authStore/authStore';

jest.mock('@/api/wallet');
jest.mock('@/store/authStore/authStore');

describe('walletStore', () => {
  beforeEach(() => {
    useWalletStore.setState({
      balance: 0,
      transactions: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
    });

    (useAuthStore.getState as jest.Mock) = jest.fn().mockReturnValue({
      user: { id: '1', name: 'Test User', balanceInCents: 583501 },
    });

    jest.clearAllMocks();
  });

  describe('fetchWalletData', () => {
    it('should fetch wallet data successfully', async () => {
      const mockData = {
        success: true,
        balance: 5000,
        transactions: [
          {
            id: '1',
            amount: 100,
            date: new Date().toISOString(),
            description: 'Test transaction',
            type: 'in' as const,
            status: 'completed' as const,
          },
        ],
      };

      (walletApi.getWalletData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.fetchWalletData();
      });

      await waitFor(() => {
        expect(result.current.balance).toBe(5000);
        expect(result.current.transactions).toHaveLength(1);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle API error', async () => {
      const mockError = {
        success: false,
        balance: 0,
        transactions: [],
        error: 'API Error',
      };

      (walletApi.getWalletData as jest.Mock).mockResolvedValue(mockError);

      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.fetchWalletData();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('API Error');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle network error', async () => {
      (walletApi.getWalletData as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.fetchWalletData();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(
          'Error de conexión. Intenta de nuevo.',
        );
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should not fetch if already loading', async () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        useWalletStore.setState({ isLoading: true });
      });

      await act(async () => {
        await result.current.fetchWalletData();
      });

      expect(walletApi.getWalletData).not.toHaveBeenCalled();
    });

    it('should call getWalletData with userId from authStore', async () => {
      const mockData = {
        success: true,
        balance: 5835.01,
        transactions: [],
      };

      (walletApi.getWalletData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.fetchWalletData();
      });

      expect(walletApi.getWalletData).toHaveBeenCalledWith('1');
    });
  });

  describe('refreshWalletData', () => {
    it('should refresh wallet data successfully', async () => {
      const mockData = {
        success: true,
        balance: 6000,
        transactions: [],
      };

      (walletApi.getWalletData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.refreshWalletData();
      });

      await waitFor(() => {
        expect(result.current.balance).toBe(6000);
        expect(result.current.isRefreshing).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should not refresh if already refreshing', async () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        useWalletStore.setState({ isRefreshing: true });
      });

      await act(async () => {
        await result.current.refreshWalletData();
      });

      expect(walletApi.getWalletData).not.toHaveBeenCalled();
    });

    it('should call getWalletData with userId from authStore', async () => {
      const mockData = {
        success: true,
        balance: 5835.01,
        transactions: [],
      };

      (walletApi.getWalletData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.refreshWalletData();
      });

      expect(walletApi.getWalletData).toHaveBeenCalledWith('1');
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        useWalletStore.setState({ error: 'Test error' });
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
