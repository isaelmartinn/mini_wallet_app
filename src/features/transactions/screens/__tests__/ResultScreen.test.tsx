import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ResultScreen} from '../ResultScreen';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';
import {useWalletStore} from '@/store/walletStore';
import {TransactionErrorType} from '@/types';

jest.mock('@/store/transactionFlowStore');
jest.mock('@/store/walletStore');

const mockNavigation = {
  navigate: jest.fn(),
  reset: jest.fn(),
} as unknown as StackNavigationProp<Record<string, object | undefined>>;

describe('ResultScreen', () => {
  const mockReset = jest.fn();
  const mockProcessTransaction = jest.fn();
  const mockAddTransaction = jest.fn();
  const mockUpdateBalance = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useWalletStore as unknown as jest.Mock).mockReturnValue({
      addTransaction: mockAddTransaction,
      updateBalance: mockUpdateBalance,
    });
  });

  describe('Successful transaction', () => {
    beforeEach(() => {
      (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
        result: {
          success: true,
          transactionId: 'TXN-123-abc',
        },
        draft: {
          amount: 5000,
          recipient: {
            name: 'Juan Pérez',
            accountOrPhone: '1234567890',
          },
          fee: 10,
        },
        reset: mockReset,
        processTransaction: mockProcessTransaction,
        isProcessing: false,
      });
    });

    it('should render success screen', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('¡Transacción exitosa!')).toBeTruthy();
      expect(getByText('Tu dinero ha sido enviado correctamente')).toBeTruthy();
    });

    it('should display transaction details with formatted amount', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('TXN-123-abc')).toBeTruthy();
      expect(getByText('Juan Pérez')).toBeTruthy();
      expect(getByText('$5,000.00')).toBeTruthy();
    });

    it('should add transaction to wallet store only once', () => {
      render(<ResultScreen navigation={mockNavigation} />);

      expect(mockAddTransaction).toHaveBeenCalledTimes(1);
      expect(mockAddTransaction).toHaveBeenCalledWith({
        id: 'TXN-123-abc',
        amount: 5000,
        date: expect.any(String),
        description: 'Transferencia a Juan Pérez',
        type: 'out',
        status: 'completed',
        recipient: 'Juan Pérez',
      });
    });

    it('should update balance only once', () => {
      render(<ResultScreen navigation={mockNavigation} />);

      expect(mockUpdateBalance).toHaveBeenCalledTimes(1);
      expect(mockUpdateBalance).toHaveBeenCalledWith(5000);
    });

    it('should not add duplicate transaction on re-render', () => {
      const {rerender} = render(
        <ResultScreen navigation={mockNavigation} />,
      );

      expect(mockAddTransaction).toHaveBeenCalledTimes(1);

      rerender(<ResultScreen navigation={mockNavigation} />);

      expect(mockAddTransaction).toHaveBeenCalledTimes(1);
    });

    it('should navigate to Home when "Volver al inicio" is pressed', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      const button = getByText('Volver al inicio');
      fireEvent.press(button);

      expect(mockReset).toHaveBeenCalled();
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{name: 'Home'}],
      });
    });

    it('should navigate to Amount screen when "Nueva transacción" is pressed', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      const button = getByText('Nueva transacción');
      fireEvent.press(button);

      expect(mockReset).toHaveBeenCalled();
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 1,
        routes: [
          {name: 'Home'},
          {name: 'Amount'},
        ],
      });
    });
  });

  describe('Failed transaction - Network Error', () => {
    beforeEach(() => {
      (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
        result: {
          success: false,
          errorType: TransactionErrorType.NETWORK_ERROR,
          errorMessage: 'Error de conexión. Por favor, intenta nuevamente',
        },
        draft: {
          amount: 5000,
          recipient: {
            name: 'Juan Pérez',
            accountOrPhone: '1234567890',
          },
          fee: 10,
        },
        reset: mockReset,
        processTransaction: mockProcessTransaction,
        isProcessing: false,
      });
    });

    it('should render error screen', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('Transacción fallida')).toBeTruthy();
      expect(
        getByText('Error de conexión. Por favor, intenta nuevamente'),
      ).toBeTruthy();
    });

    it('should show retry button for network error', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('Reintentar')).toBeTruthy();
    });

    it('should not add transaction to wallet store on error', () => {
      render(<ResultScreen navigation={mockNavigation} />);

      expect(mockAddTransaction).not.toHaveBeenCalled();
      expect(mockUpdateBalance).not.toHaveBeenCalled();
    });

    it('should call processTransaction when retry is pressed', async () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      const retryButton = getByText('Reintentar');
      fireEvent.press(retryButton);

      await waitFor(() => {
        expect(mockProcessTransaction).toHaveBeenCalled();
      });
    });

    it('should reset transaction ref when retry is pressed to allow new transaction', async () => {
      const {getByText, rerender} = render(
        <ResultScreen navigation={mockNavigation} />,
      );

      const retryButton = getByText('Reintentar');
      fireEvent.press(retryButton);

      (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
        result: {
          success: true,
          transactionId: 'TXN-456-def',
        },
        draft: {
          amount: 5000,
          recipient: {
            name: 'Juan Pérez',
            accountOrPhone: '1234567890',
          },
          fee: 10,
        },
        reset: mockReset,
        processTransaction: mockProcessTransaction,
        isProcessing: false,
      });

      rerender(<ResultScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockAddTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'TXN-456-def',
          }),
        );
      });
    });
  });

  describe('Failed transaction - Timeout', () => {
    beforeEach(() => {
      (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
        result: {
          success: false,
          errorType: TransactionErrorType.TIMEOUT,
          errorMessage: 'La transacción tardó demasiado. Intenta de nuevo',
        },
        draft: {
          amount: 5000,
          recipient: {
            name: 'Juan Pérez',
            accountOrPhone: '1234567890',
          },
          fee: 10,
        },
        reset: mockReset,
        processTransaction: mockProcessTransaction,
        isProcessing: false,
      });
    });

    it('should show retry button for timeout error', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('Reintentar')).toBeTruthy();
    });
  });

  describe('Failed transaction - Insufficient Funds', () => {
    beforeEach(() => {
      (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
        result: {
          success: false,
          errorType: TransactionErrorType.INSUFFICIENT_FUNDS,
          errorMessage:
            'No tienes saldo suficiente para completar esta transacción',
        },
        draft: {
          amount: 5000,
          recipient: {
            name: 'Juan Pérez',
            accountOrPhone: '1234567890',
          },
          fee: 10,
        },
        reset: mockReset,
        processTransaction: mockProcessTransaction,
        isProcessing: false,
      });
    });

    it('should not show retry button for insufficient funds', () => {
      const {queryByText} = render(
        <ResultScreen navigation={mockNavigation} />,
      );

      expect(queryByText('Reintentar')).toBeNull();
    });

    it('should show only "Volver al inicio" button', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('Volver al inicio')).toBeTruthy();
    });
  });

  describe('Processing state', () => {
    beforeEach(() => {
      (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
        result: {
          success: false,
          errorType: TransactionErrorType.NETWORK_ERROR,
          errorMessage: 'Error de conexión. Por favor, intenta nuevamente',
        },
        draft: {
          amount: 5000,
          recipient: {
            name: 'Juan Pérez',
            accountOrPhone: '1234567890',
          },
          fee: 10,
        },
        reset: mockReset,
        processTransaction: mockProcessTransaction,
        isProcessing: true,
      });
    });

    it('should show processing text on retry button', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      expect(getByText('Reintentando...')).toBeTruthy();
    });

    it('should not call processTransaction again while processing', () => {
      const {getByText} = render(<ResultScreen navigation={mockNavigation} />);

      const button = getByText('Reintentando...');
      fireEvent.press(button);

      expect(mockProcessTransaction).not.toHaveBeenCalled();
    });
  });
});
