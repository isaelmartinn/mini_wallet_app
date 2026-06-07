import React from 'react';
import {render} from '@testing-library/react-native';
import {WalletScreen} from './WalletScreen';
import {useAppStore} from '@/store/useAppStore';

jest.mock('@/store/useAppStore', () => ({
  useAppStore: jest.fn(),
}));

describe('WalletScreen', () => {
  const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title correctly', () => {
    mockUseAppStore.mockReturnValue({
      isLoading: false,
      error: null,
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const {getByText} = render(<WalletScreen />);

    expect(getByText('Wallet')).toBeTruthy();
  });

  it('should show loading message when isLoading is true', () => {
    mockUseAppStore.mockReturnValue({
      isLoading: true,
      error: null,
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const {getByText} = render(<WalletScreen />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should show ready message when isLoading is false', () => {
    mockUseAppStore.mockReturnValue({
      isLoading: false,
      error: null,
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const {getByText} = render(<WalletScreen />);

    expect(getByText('Your wallet is ready')).toBeTruthy();
  });

  it('should not show loading message when isLoading is false', () => {
    mockUseAppStore.mockReturnValue({
      isLoading: false,
      error: null,
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const {queryByText} = render(<WalletScreen />);

    expect(queryByText('Loading...')).toBeNull();
  });

  it('should not show ready message when isLoading is true', () => {
    mockUseAppStore.mockReturnValue({
      isLoading: true,
      error: null,
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const {queryByText} = render(<WalletScreen />);

    expect(queryByText('Your wallet is ready')).toBeNull();
  });

  it('should render container with correct structure', () => {
    mockUseAppStore.mockReturnValue({
      isLoading: false,
      error: null,
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const {getByText} = render(<WalletScreen />);

    const title = getByText('Wallet');
    const subtitle = getByText('Your wallet is ready');

    expect(title).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });
});
