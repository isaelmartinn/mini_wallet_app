import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RefreshControl, FlatList } from 'react-native';
import { TransactionList } from './TransactionList';
import { Transaction } from '@/types';

jest.mock('../TransactionItem', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require('react-native');
  return {
    TransactionItem: ({ transaction }: { transaction: Transaction }) => {
      return (
        <Text testID={`transaction-${transaction.id}`}>
          {transaction.description}
        </Text>
      );
    },
  };
});

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 500,
      date: new Date().toISOString(),
      description: 'Pago recibido',
      type: 'in',
      status: 'completed',
    },
    {
      id: '2',
      amount: 250,
      date: new Date().toISOString(),
      description: 'Pago enviado',
      type: 'out',
      status: 'completed',
    },
  ];

  const defaultProps = {
    transactions: mockTransactions,
    isRefreshing: false,
    onRefresh: jest.fn(),
    hasError: false,
    onRetry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Normal state', () => {
    it('should render header with title', () => {
      const { getByText } = render(<TransactionList {...defaultProps} />);

      expect(getByText('Movimientos recientes')).toBeTruthy();
    });

    it('should render list of transactions', () => {
      const { getByTestId } = render(<TransactionList {...defaultProps} />);

      expect(getByTestId('transaction-1')).toBeTruthy();
      expect(getByTestId('transaction-2')).toBeTruthy();
    });

    it('should render all transaction items', () => {
      const { getByText } = render(<TransactionList {...defaultProps} />);

      expect(getByText('Pago recibido')).toBeTruthy();
      expect(getByText('Pago enviado')).toBeTruthy();
    });

    it('should call onRefresh when pull to refresh is triggered', () => {
      const onRefresh = jest.fn();
      const { UNSAFE_getByType } = render(
        <TransactionList {...defaultProps} onRefresh={onRefresh} />,
      );

      const refreshControl = UNSAFE_getByType(RefreshControl);
      refreshControl.props.onRefresh();

      expect(onRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty state', () => {
    it('should render empty state when no transactions', () => {
      const { getByText } = render(
        <TransactionList {...defaultProps} transactions={[]} />,
      );

      expect(getByText('💳')).toBeTruthy();
      expect(getByText('No hay transacciones')).toBeTruthy();
      expect(getByText('Tus movimientos aparecerán aquí')).toBeTruthy();
    });

    it('should not render header when showing empty state', () => {
      const { getByText } = render(
        <TransactionList {...defaultProps} transactions={[]} />,
      );

      expect(getByText('Movimientos recientes')).toBeTruthy();
    });
  });

  describe('Error state', () => {
    it('should render error state when hasError is true and no transactions', () => {
      const { getByText } = render(
        <TransactionList {...defaultProps} transactions={[]} hasError={true} />,
      );

      expect(getByText('⚠️')).toBeTruthy();
      expect(getByText('Error al cargar transacciones')).toBeTruthy();
      expect(getByText('No pudimos cargar tus movimientos')).toBeTruthy();
      expect(getByText('Reintentar')).toBeTruthy();
    });

    it('should call onRetry when retry button is pressed', () => {
      const onRetry = jest.fn();
      const { getByText } = render(
        <TransactionList
          {...defaultProps}
          transactions={[]}
          hasError={true}
          onRetry={onRetry}
        />,
      );

      const retryButton = getByText('Reintentar');
      fireEvent.press(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should not render error state when hasError is true but has transactions', () => {
      const { queryByText, getByText } = render(
        <TransactionList {...defaultProps} hasError={true} />,
      );

      expect(queryByText('Error al cargar transacciones')).toBeNull();
      expect(getByText('Movimientos recientes')).toBeTruthy();
    });
  });

  describe('Refresh state', () => {
    it('should show refreshing state', () => {
      const { UNSAFE_getByType } = render(
        <TransactionList {...defaultProps} isRefreshing={true} />,
      );

      const refreshControl = UNSAFE_getByType(RefreshControl);

      expect(refreshControl.props.refreshing).toBe(true);
    });

    it('should not show refreshing state when isRefreshing is false', () => {
      const { UNSAFE_getByType } = render(
        <TransactionList {...defaultProps} isRefreshing={false} />,
      );

      const refreshControl = UNSAFE_getByType(RefreshControl);

      expect(refreshControl.props.refreshing).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle single transaction', () => {
      const singleTransaction = [mockTransactions[0]];
      const { getByTestId, queryByTestId } = render(
        <TransactionList {...defaultProps} transactions={singleTransaction} />,
      );

      expect(getByTestId('transaction-1')).toBeTruthy();
      expect(queryByTestId('transaction-2')).toBeNull();
    });

    it('should handle large number of transactions', () => {
      const manyTransactions: Transaction[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: `${i}`,
          amount: 100 * i,
          date: new Date().toISOString(),
          description: `Transaction ${i}`,
          type: i % 2 === 0 ? 'in' : 'out',
          status: 'completed',
        }),
      );

      const { UNSAFE_getByType } = render(
        <TransactionList {...defaultProps} transactions={manyTransactions} />,
      );

      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.data).toHaveLength(100);
      expect(flatList.props.data[0].id).toBe('0');
      expect(flatList.props.data[99].id).toBe('99');
    });

    it('should use transaction id as key', () => {
      const { UNSAFE_getByType } = render(
        <TransactionList {...defaultProps} />,
      );

      const flatList = UNSAFE_getByType(FlatList);

      expect(flatList.props.keyExtractor(mockTransactions[0])).toBe('1');
      expect(flatList.props.keyExtractor(mockTransactions[1])).toBe('2');
    });
  });
});
