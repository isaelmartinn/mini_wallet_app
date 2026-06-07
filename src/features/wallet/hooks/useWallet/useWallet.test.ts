import {renderHook} from '@testing-library/react-native';
import {useWallet} from './useWallet';
import {useWalletStore} from '@/store';

jest.mock('@/store', () => ({
  useWalletStore: jest.fn(),
}));

describe('useWallet', () => {
  const mockFetchWalletData = jest.fn();
  const mockRefreshWalletData = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useWalletStore as jest.Mock).mockReturnValue({
      balance: 1000,
      transactions: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
      fetchWalletData: mockFetchWalletData,
      refreshWalletData: mockRefreshWalletData,
      clearError: mockClearError,
    });
  });

  it('should return wallet data from store', () => {
    const {result} = renderHook(() => useWallet());

    expect(result.current.balance).toBe(1000);
    expect(result.current.transactions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call refreshWalletData when handleRefresh is called', () => {
    const {result} = renderHook(() => useWallet());

    result.current.handleRefresh();

    expect(mockRefreshWalletData).toHaveBeenCalledTimes(1);
  });

  it('should call clearError and fetchWalletData when handleRetry is called', () => {
    const {result} = renderHook(() => useWallet());

    result.current.handleRetry();

    expect(mockClearError).toHaveBeenCalledTimes(1);
    expect(mockFetchWalletData).toHaveBeenCalledTimes(1);
  });
});
