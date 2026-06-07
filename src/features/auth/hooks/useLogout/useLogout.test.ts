import {renderHook, act} from '@testing-library/react-native';
import {useLogout} from './useLogout';
import {useAuthStore} from '@/store/authStore';
import {useWalletStore} from '@/store/walletStore';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';

jest.mock('@/store/authStore');
jest.mock('@/store/walletStore');
jest.mock('@/store/transactionFlowStore');

describe('useLogout', () => {
  const mockAuthLogout = jest.fn();
  const mockWalletReset = jest.fn();
  const mockTransactionReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation(selector =>
      selector({logout: mockAuthLogout}),
    );
    (useWalletStore as unknown as jest.Mock).mockImplementation(selector =>
      selector({reset: mockWalletReset}),
    );
    (useTransactionFlowStore as unknown as jest.Mock).mockImplementation(
      selector => selector({reset: mockTransactionReset}),
    );
  });

  it('debe retornar la función logout', () => {
    const {result} = renderHook(() => useLogout());

    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });

  it('debe llamar a todos los resets en el orden correcto al hacer logout', () => {
    const {result} = renderHook(() => useLogout());

    act(() => {
      result.current.logout();
    });

    expect(mockWalletReset).toHaveBeenCalledTimes(1);
    expect(mockTransactionReset).toHaveBeenCalledTimes(1);
    expect(mockAuthLogout).toHaveBeenCalledTimes(1);

    const walletResetOrder = mockWalletReset.mock.invocationCallOrder[0];
    const transactionResetOrder = mockTransactionReset.mock.invocationCallOrder[0];
    const authLogoutOrder = mockAuthLogout.mock.invocationCallOrder[0];

    expect(walletResetOrder).toBeLessThan(authLogoutOrder);
    expect(transactionResetOrder).toBeLessThan(authLogoutOrder);
  });

  it('debe mantener la misma referencia de logout entre renders', () => {
    const {result, rerender} = renderHook(() => useLogout());

    const firstLogout = result.current.logout;

    rerender({});

    const secondLogout = result.current.logout;

    expect(firstLogout).toBe(secondLogout);
  });

  it('debe llamar a logout múltiples veces sin errores', () => {
    const {result} = renderHook(() => useLogout());

    act(() => {
      result.current.logout();
      result.current.logout();
      result.current.logout();
    });

    expect(mockWalletReset).toHaveBeenCalledTimes(3);
    expect(mockTransactionReset).toHaveBeenCalledTimes(3);
    expect(mockAuthLogout).toHaveBeenCalledTimes(3);
  });
});
