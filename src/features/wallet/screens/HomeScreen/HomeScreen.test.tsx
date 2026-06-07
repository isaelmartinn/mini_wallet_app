import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {HomeScreen} from './HomeScreen';
import {useAuthStore} from '@/store/authStore';
import {useWallet} from '../../hooks';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {AppStackParamList} from '@/navigation/types';

jest.mock('@/store/authStore');
jest.mock('../../hooks');
jest.mock('./components', () => ({
  BalanceCard: jest.fn(({onSendMoney}) => {
    const {View, Text, TouchableOpacity} = require('react-native');
    return (
      <View testID="balance-card">
        <Text>Balance Card</Text>
        <TouchableOpacity testID="send-money-button" onPress={onSendMoney}>
          <Text>Enviar</Text>
        </TouchableOpacity>
      </View>
    );
  }),
  TransactionList: jest.fn(({onRefresh, onRetry, hasError}) => {
    const {View, Text, TouchableOpacity} = require('react-native');
    return (
      <View testID="transaction-list">
        <Text>Transaction List</Text>
        {hasError && (
          <TouchableOpacity testID="retry-button" onPress={onRetry}>
            <Text>Reintentar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity testID="refresh-button" onPress={onRefresh}>
          <Text>Refrescar</Text>
        </TouchableOpacity>
      </View>
    );
  }),
}));

type MockNavigation = Partial<DrawerNavigationProp<AppStackParamList, 'Home'>>;

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockOpenDrawer = jest.fn();
  const mockHandleRefresh = jest.fn();
  const mockHandleRetry = jest.fn();

  const mockNavigation: MockNavigation = {
    navigate: mockNavigate,
    openDrawer: mockOpenDrawer,
  };

  const mockUser = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
  };

  const mockTransactions = [
    {
      id: '1',
      amount: 500,
      date: new Date().toISOString(),
      description: 'Pago recibido',
      type: 'in' as const,
      status: 'completed' as const,
    },
    {
      id: '2',
      amount: 250,
      date: new Date().toISOString(),
      description: 'Pago enviado',
      type: 'out' as const,
      status: 'completed' as const,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    (useWallet as jest.Mock).mockReturnValue({
      balance: 1000,
      transactions: mockTransactions,
      isLoading: false,
      isRefreshing: false,
      error: null,
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });
  });

  it('should render loading state when isLoading is true and no transactions', () => {
    (useWallet as jest.Mock).mockReturnValue({
      balance: 0,
      transactions: [],
      isLoading: true,
      isRefreshing: false,
      error: null,
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });

    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should not render loading state when isLoading is true but has transactions', () => {
    (useWallet as jest.Mock).mockReturnValue({
      balance: 1000,
      transactions: mockTransactions,
      isLoading: true,
      isRefreshing: false,
      error: null,
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });

    const {queryByTestId, getByText} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(queryByTestId('activity-indicator')).toBeNull();
    expect(getByText('Mi Billetera')).toBeTruthy();
  });

  it('should render header with title and menu button', () => {
    const {getByText, getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByText('Mi Billetera')).toBeTruthy();
    expect(getByTestId('menu-button')).toBeTruthy();
  });

  it('should open drawer when menu button is pressed', () => {
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    const menuButton = getByTestId('menu-button');
    fireEvent.press(menuButton);

    expect(mockOpenDrawer).toHaveBeenCalledTimes(1);
  });

  it('should render BalanceCard with correct props', () => {
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByTestId('balance-card')).toBeTruthy();
  });

  it('should navigate to Amount screen when send money is triggered', () => {
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    const sendMoneyButton = getByTestId('send-money-button');
    fireEvent.press(sendMoneyButton);

    expect(mockNavigate).toHaveBeenCalledWith('Amount');
  });

  it('should render TransactionList with correct props', () => {
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByTestId('transaction-list')).toBeTruthy();
  });

  it('should call handleRefresh when refresh is triggered', () => {
    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    const refreshButton = getByTestId('refresh-button');
    fireEvent.press(refreshButton);

    expect(mockHandleRefresh).toHaveBeenCalledTimes(1);
  });

  it('should call handleRetry when retry is triggered', () => {
    (useWallet as jest.Mock).mockReturnValue({
      balance: 1000,
      transactions: mockTransactions,
      isLoading: false,
      isRefreshing: false,
      error: 'Error al cargar datos',
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });

    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    const retryButton = getByTestId('retry-button');
    fireEvent.press(retryButton);

    expect(mockHandleRetry).toHaveBeenCalledTimes(1);
  });

  it('should pass error state to TransactionList', () => {
    (useWallet as jest.Mock).mockReturnValue({
      balance: 1000,
      transactions: mockTransactions,
      isLoading: false,
      isRefreshing: false,
      error: 'Error al cargar datos',
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });

    const {getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByTestId('retry-button')).toBeTruthy();
  });

  it('should render correctly when user is null', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    });

    const {getByText, getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByText('Mi Billetera')).toBeTruthy();
    expect(getByTestId('balance-card')).toBeTruthy();
  });

  it('should render correctly with empty transactions', () => {
    (useWallet as jest.Mock).mockReturnValue({
      balance: 0,
      transactions: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });

    const {getByText, getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByText('Mi Billetera')).toBeTruthy();
    expect(getByTestId('transaction-list')).toBeTruthy();
  });

  it('should render correctly with isRefreshing state', () => {
    (useWallet as jest.Mock).mockReturnValue({
      balance: 1000,
      transactions: mockTransactions,
      isLoading: false,
      isRefreshing: true,
      error: null,
      handleRefresh: mockHandleRefresh,
      handleRetry: mockHandleRetry,
    });

    const {getByText, getByTestId} = render(
      <HomeScreen navigation={mockNavigation as DrawerNavigationProp<AppStackParamList, 'Home'>} />,
    );

    expect(getByText('Mi Billetera')).toBeTruthy();
    expect(getByTestId('transaction-list')).toBeTruthy();
  });
});
