import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionSuccess } from './TransactionSuccess';

describe('TransactionSuccess', () => {
  const mockProps = {
    transactionId: 'TXN123456',
    recipientName: 'Juan Pérez',
    amount: 1500.5,
    onGoHome: jest.fn(),
    onNewTransaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(<TransactionSuccess {...mockProps} />);

    expect(getByText('¡Transacción exitosa!')).toBeTruthy();
    expect(getByText('Tu dinero ha sido enviado correctamente')).toBeTruthy();
    expect(getByText('TXN123456')).toBeTruthy();
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('$1,500.50')).toBeTruthy();
  });

  it('calls onGoHome when "Volver al inicio" button is pressed', () => {
    const { getByText } = render(<TransactionSuccess {...mockProps} />);

    fireEvent.press(getByText('Volver al inicio'));
    expect(mockProps.onGoHome).toHaveBeenCalledTimes(1);
  });

  it('calls onNewTransaction when "Nueva transacción" button is pressed', () => {
    const { getByText } = render(<TransactionSuccess {...mockProps} />);

    fireEvent.press(getByText('Nueva transacción'));
    expect(mockProps.onNewTransaction).toHaveBeenCalledTimes(1);
  });

  it('displays formatted amount correctly', () => {
    const { getByText } = render(
      <TransactionSuccess {...mockProps} amount={999.99} />,
    );

    expect(getByText('$999.99')).toBeTruthy();
  });
});
