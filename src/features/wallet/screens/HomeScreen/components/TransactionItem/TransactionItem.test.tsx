import React from 'react';
import {render} from '@testing-library/react-native';
import {TransactionItem} from './TransactionItem';
import {Transaction} from '@/types';

jest.mock('@/utils/currency', () => ({
  formatCurrency: jest.fn((amount: number) => `$${amount.toFixed(2)}`),
}));

describe('TransactionItem', () => {
  const mockIncomingTransaction: Transaction = {
    id: '1',
    amount: 500,
    date: new Date().toISOString(),
    description: 'Pago recibido',
    type: 'in',
    status: 'completed',
  };

  const mockOutgoingTransaction: Transaction = {
    id: '2',
    amount: 250,
    date: new Date().toISOString(),
    description: 'Pago enviado',
    type: 'out',
    status: 'completed',
  };

  const mockPendingTransaction: Transaction = {
    id: '3',
    amount: 100,
    date: new Date().toISOString(),
    description: 'Pago pendiente',
    type: 'out',
    status: 'pending',
  };

  it('should render incoming transaction correctly', () => {
    const {getByText} = render(<TransactionItem transaction={mockIncomingTransaction} />);

    expect(getByText('Pago recibido')).toBeTruthy();
    expect(getByText('+$500.00')).toBeTruthy();
    expect(getByText('↓')).toBeTruthy();
  });

  it('should render outgoing transaction correctly', () => {
    const {getByText} = render(<TransactionItem transaction={mockOutgoingTransaction} />);

    expect(getByText('Pago enviado')).toBeTruthy();
    expect(getByText('-$250.00')).toBeTruthy();
    expect(getByText('↑')).toBeTruthy();
  });

  it('should render pending badge for pending transactions', () => {
    const {getByText} = render(<TransactionItem transaction={mockPendingTransaction} />);

    expect(getByText('Pendiente')).toBeTruthy();
  });

  it('should not render pending badge for completed transactions', () => {
    const {queryByText} = render(<TransactionItem transaction={mockIncomingTransaction} />);

    expect(queryByText('Pendiente')).toBeNull();
  });

  it('should format date as "Hace unos minutos" for recent transactions', () => {
    const recentTransaction: Transaction = {
      ...mockIncomingTransaction,
      date: new Date().toISOString(),
    };

    const {getByText} = render(<TransactionItem transaction={recentTransaction} />);

    expect(getByText('Hace unos minutos')).toBeTruthy();
  });

  it('should format date as "Hace Xh" for transactions within 24 hours', () => {
    const date = new Date();
    date.setHours(date.getHours() - 5);

    const transaction: Transaction = {
      ...mockIncomingTransaction,
      date: date.toISOString(),
    };

    const {getByText} = render(<TransactionItem transaction={transaction} />);

    expect(getByText('Hace 5h')).toBeTruthy();
  });

  it('should format date as "Ayer" for transactions within 48 hours', () => {
    const date = new Date();
    date.setHours(date.getHours() - 30);

    const transaction: Transaction = {
      ...mockIncomingTransaction,
      date: date.toISOString(),
    };

    const {getByText} = render(<TransactionItem transaction={transaction} />);

    expect(getByText('Ayer')).toBeTruthy();
  });

  it('should format date as "DD MMM" for older transactions', () => {
    const date = new Date();
    date.setDate(date.getDate() - 5);

    const transaction: Transaction = {
      ...mockIncomingTransaction,
      date: date.toISOString(),
    };

    const {getByText} = render(<TransactionItem transaction={transaction} />);

    const expectedDate = date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
    });

    expect(getByText(expectedDate)).toBeTruthy();
  });

  it('should render transaction description', () => {
    const {getByText} = render(<TransactionItem transaction={mockIncomingTransaction} />);

    expect(getByText('Pago recibido')).toBeTruthy();
  });

  it('should render zero amount correctly', () => {
    const zeroTransaction: Transaction = {
      ...mockIncomingTransaction,
      amount: 0,
    };

    const {getByText} = render(<TransactionItem transaction={zeroTransaction} />);

    expect(getByText('+$0.00')).toBeTruthy();
  });

  it('should render large amount correctly', () => {
    const largeTransaction: Transaction = {
      ...mockIncomingTransaction,
      amount: 1234567.89,
    };

    const {getByText} = render(<TransactionItem transaction={largeTransaction} />);

    expect(getByText('+$1234567.89')).toBeTruthy();
  });
});
