import { renderHook, act } from '@testing-library/react-native';
import { useTransactionFlowStore } from './transactionFlowStore';
import { TransactionErrorType } from '@/types';

jest.mock('@/api/transactions', () => ({
  transactionsApi: {
    sendMoney: jest.fn(),
  },
}));

import { transactionsApi } from '@/api/transactions';

describe('useTransactionFlowStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useTransactionFlowStore());
    act(() => {
      result.current.reset();
    });
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTransactionFlowStore());

    expect(result.current.draft.amount).toBe(0);
    expect(result.current.draft.recipient).toBeNull();
    expect(result.current.draft.fee).toBe(0);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.result).toBeNull();
  });

  it('should set amount correctly', () => {
    const { result } = renderHook(() => useTransactionFlowStore());

    act(() => {
      result.current.setAmount(150);
    });

    expect(result.current.draft.amount).toBe(150);
  });

  it('should set recipient correctly', () => {
    const { result } = renderHook(() => useTransactionFlowStore());
    const recipient = {
      name: 'Juan Pérez',
      accountOrPhone: '1234567890',
    };

    act(() => {
      result.current.setRecipient(recipient);
    });

    expect(result.current.draft.recipient).toEqual(recipient);
  });

  it('should process successful transaction', async () => {
    const mockResult = {
      success: true,
      transactionId: 'TXN-123',
    };
    (transactionsApi.sendMoney as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useTransactionFlowStore());

    act(() => {
      result.current.setAmount(100);
      result.current.setRecipient({
        name: 'Juan Pérez',
        accountOrPhone: '1234567890',
      });
    });

    let transactionResult;
    await act(async () => {
      transactionResult = await result.current.processTransaction();
    });

    expect(transactionResult).toEqual(mockResult);
    expect(result.current.result).toEqual(mockResult);
    expect(result.current.isProcessing).toBe(false);
  });

  it('should handle transaction error', async () => {
    const mockError = {
      success: false,
      errorType: TransactionErrorType.NETWORK_ERROR,
      errorMessage: 'Error de conexión',
    };
    (transactionsApi.sendMoney as jest.Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() => useTransactionFlowStore());

    act(() => {
      result.current.setAmount(100);
      result.current.setRecipient({
        name: 'Juan Pérez',
        accountOrPhone: '1234567890',
      });
    });

    await act(async () => {
      await result.current.processTransaction();
    });

    expect(result.current.result?.success).toBe(false);
    expect(result.current.result?.errorType).toBe(
      TransactionErrorType.NETWORK_ERROR,
    );
    expect(result.current.isProcessing).toBe(false);
  });

  it('should reset store to initial state', () => {
    const { result } = renderHook(() => useTransactionFlowStore());

    act(() => {
      result.current.setAmount(100);
      result.current.setRecipient({
        name: 'Juan Pérez',
        accountOrPhone: '1234567890',
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.draft.amount).toBe(0);
    expect(result.current.draft.recipient).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.isProcessing).toBe(false);
  });

  it('should handle missing recipient on process', async () => {
    const { result } = renderHook(() => useTransactionFlowStore());

    act(() => {
      result.current.setAmount(100);
    });

    await act(async () => {
      await result.current.processTransaction();
    });

    expect(result.current.result?.success).toBe(false);
    expect(result.current.result?.errorType).toBe(TransactionErrorType.UNKNOWN);
  });
});
