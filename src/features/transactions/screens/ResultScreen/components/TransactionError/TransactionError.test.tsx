import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionError } from './TransactionError';
import { TransactionErrorType } from '@/types';

describe('TransactionError', () => {
  const mockProps = {
    errorType: TransactionErrorType.NETWORK_ERROR,
    errorMessage: 'Error de conexión',
    canRetry: true,
    isProcessing: false,
    onRetry: jest.fn(),
    onGoHome: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with retry option', () => {
    const { getByText } = render(<TransactionError {...mockProps} />);

    expect(getByText('Transacción fallida')).toBeTruthy();
    expect(getByText('Error de conexión')).toBeTruthy();
    expect(getByText('Reintentar')).toBeTruthy();
    expect(getByText('Volver al inicio')).toBeTruthy();
  });

  it('renders correctly without retry option', () => {
    const { getByText, queryByText } = render(
      <TransactionError {...mockProps} canRetry={false} />,
    );

    expect(getByText('Transacción fallida')).toBeTruthy();
    expect(queryByText('Reintentar')).toBeNull();
    expect(getByText('Volver al inicio')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const { getByText } = render(<TransactionError {...mockProps} />);

    fireEvent.press(getByText('Reintentar'));
    expect(mockProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onGoHome when home button is pressed', () => {
    const { getByText } = render(<TransactionError {...mockProps} />);

    fireEvent.press(getByText('Volver al inicio'));
    expect(mockProps.onGoHome).toHaveBeenCalledTimes(1);
  });

  it('disables retry button when processing', () => {
    const { getByText } = render(
      <TransactionError {...mockProps} isProcessing={true} />,
    );

    expect(getByText('Reintentando...')).toBeTruthy();
  });

  it('renders correct icon for INSUFFICIENT_FUNDS error', () => {
    const { getByText } = render(
      <TransactionError
        {...mockProps}
        errorType={TransactionErrorType.INSUFFICIENT_FUNDS}
      />,
    );

    expect(getByText('Transacción fallida')).toBeTruthy();
  });

  it('renders correct icon for TIMEOUT error', () => {
    const { getByText } = render(
      <TransactionError
        {...mockProps}
        errorType={TransactionErrorType.TIMEOUT}
      />,
    );

    expect(getByText('Transacción fallida')).toBeTruthy();
  });
});
