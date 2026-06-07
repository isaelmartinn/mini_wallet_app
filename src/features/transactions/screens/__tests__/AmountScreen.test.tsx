import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AmountScreen} from '../AmountScreen';
import {useWalletStore} from '@/store/walletStore';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {useInactivityTimeout} from '@/features/transactions/hooks/useInactivityTimeout';

jest.mock('@/store/walletStore');
jest.mock('@/store/transactionFlowStore');
jest.mock('@/features/transactions/hooks/useInactivityTimeout');

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
} as unknown as StackNavigationProp<Record<string, object | undefined>>;

describe('AmountScreen', () => {
  const mockSetAmount = jest.fn();
  const mockResetTimer = jest.fn();
  let mockOnTimeout: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    (useWalletStore as unknown as jest.Mock).mockReturnValue({
      balance: 10000,
    });
    (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
      setAmount: mockSetAmount,
    });
    (useInactivityTimeout as jest.Mock).mockImplementation(({onTimeout}) => {
      mockOnTimeout = onTimeout;
      return {
        resetTimer: mockResetTimer,
        remainingTime: 60000,
        isActive: true,
      };
    });
  });

  it('should render correctly', () => {
    const {getByText, getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    expect(getByText('¿Cuánto quieres enviar?')).toBeTruthy();
    expect(getByText('Saldo disponible')).toBeTruthy();
    expect(getByPlaceholderText('0.00')).toBeTruthy();
  });

  it('should format balance with currency format', () => {
    const {getByText} = render(<AmountScreen navigation={mockNavigation} />);

    expect(getByText(/10,000\.00/)).toBeTruthy();
  });

  it('should handle multiple leading zeros by keeping only one', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '000');

    expect(input.props.value).toBe('0');
  });

  it('should remove leading zeros from numbers', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '00123');

    expect(input.props.value).toBe('123');
  });

  it('should allow decimal values with leading zero', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '0.50');

    expect(input.props.value).toBe('0.50');
  });

  it('should limit decimal places to 2 digits', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '123.999');

    expect(input.props.value).toBe('123.99');
  });

  it('should prevent multiple decimal points', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '1.2.3');

    expect(input.props.value).toBe('1.23');
  });

  it('should format input with thousand separators', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '5000');

    expect(input.props.value).toBe('5,000');
  });

  it('should format input with thousand separators and decimals', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, '5000.50');

    expect(input.props.value).toBe('5,000.50');
  });

  it('should only accept numeric characters and decimal point', () => {
    const {getByPlaceholderText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');

    fireEvent.changeText(input, 'abc123.45def');

    expect(input.props.value).toBe('123.45');
  });

  it('should not navigate when input is empty', () => {
    const {getByText} = render(<AmountScreen navigation={mockNavigation} />);

    const button = getByText('Continuar');
    fireEvent.press(button);

    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate when amount is zero', () => {
    const {getByPlaceholderText, getByText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '0');

    const button = getByText('Continuar');
    fireEvent.press(button);

    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('should navigate when valid amount is entered', () => {
    const {getByPlaceholderText, getByText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '100');

    const button = getByText('Continuar');
    fireEvent.press(button);

    expect(mockSetAmount).toHaveBeenCalledWith(100);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Recipient');
  });

  it('should show error when amount exceeds balance', () => {
    const {getByPlaceholderText, getByText, getAllByText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '15000');

    const button = getByText('Continuar');
    fireEvent.press(button);

    const errorTexts = getAllByText(/saldo/i);
    expect(errorTexts.length).toBeGreaterThan(1);
  });

  it('should navigate to Recipient screen when valid amount is submitted', () => {
    const {getByPlaceholderText, getByText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '500');

    const button = getByText('Continuar');
    fireEvent.press(button);

    expect(mockSetAmount).toHaveBeenCalledWith(500);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Recipient');
  });

  it('should clear error when user starts typing again', () => {
    const {getByPlaceholderText, getByText, queryAllByText} = render(
      <AmountScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '15000');

    const button = getByText('Continuar');
    fireEvent.press(button);

    let errorTexts = queryAllByText(/saldo/i);
    expect(errorTexts.length).toBeGreaterThan(1);

    fireEvent.changeText(input, '500');

    errorTexts = queryAllByText(/saldo/i);
    expect(errorTexts.length).toBe(1);
  });

  describe('Integración con Hook de Timeout', () => {
    it('should initialize timeout hook on mount', () => {
      render(<AmountScreen navigation={mockNavigation} />);

      expect(useInactivityTimeout).toHaveBeenCalledWith({
        timeoutMs: 60000,
        onTimeout: expect.any(Function),
        enabled: true,
      });
    });

    it('should call resetTimer when user types in input', () => {
      const {getByPlaceholderText} = render(
        <AmountScreen navigation={mockNavigation} />,
      );

      const input = getByPlaceholderText('0.00');
      fireEvent.changeText(input, '100');

      expect(mockResetTimer).toHaveBeenCalled();
    });

    it('should call resetTimer when continue button is pressed', () => {
      const {getByPlaceholderText, getByText} = render(
        <AmountScreen navigation={mockNavigation} />,
      );

      const input = getByPlaceholderText('0.00');
      fireEvent.changeText(input, '100');

      const button = getByText('Continuar');
      fireEvent.press(button);

      expect(mockResetTimer).toHaveBeenCalledTimes(2);
    });

    it('should navigate to Timeout screen when timeout occurs', () => {
      render(<AmountScreen navigation={mockNavigation} />);

      mockOnTimeout();

      expect(mockNavigation.replace).toHaveBeenCalledWith('Timeout');
    });
  });
});
