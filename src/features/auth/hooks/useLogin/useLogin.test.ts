import { renderHook, act } from '@testing-library/react-native';
import { useLogin } from './useLogin';
import { useAuthStore } from '@/store/authStore';
import { validateIdentifier } from '@/utils/validation';

jest.mock('@/store/authStore');
jest.mock('@/utils/validation');

describe('useLogin', () => {
  const mockLogin = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  it('debe inicializar con valores por defecto', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.identifier).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('debe actualizar el identifier cuando cambia el texto', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleIdentifierChange('test@example.com');
    });

    expect(result.current.identifier).toBe('test@example.com');
    expect(mockClearError).toHaveBeenCalled();
  });

  it('debe limpiar errores de validación al cambiar el identifier', () => {
    (validateIdentifier as jest.Mock).mockReturnValue({
      isValid: false,
      error: 'Error de validación',
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleLogin();
    });

    expect(result.current.error).toBe('Error de validación');

    act(() => {
      result.current.handleIdentifierChange('nuevo@example.com');
    });

    expect(result.current.identifier).toBe('nuevo@example.com');
  });

  it('debe mostrar error de validación cuando el identifier es inválido', async () => {
    (validateIdentifier as jest.Mock).mockReturnValue({
      isValid: false,
      error: 'Identificador inválido',
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleIdentifierChange('invalid');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Identificador inválido');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('debe llamar a login cuando el identifier es válido', async () => {
    (validateIdentifier as jest.Mock).mockReturnValue({
      isValid: true,
      error: null,
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleIdentifierChange('valid@example.com');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockLogin).toHaveBeenCalledWith({ identifier: 'valid@example.com' });
  });

  it('debe mostrar error de autenticación del store', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Error de autenticación',
      clearError: mockClearError,
    });

    const { result } = renderHook(() => useLogin());

    expect(result.current.error).toBe('Error de autenticación');
  });

  it('debe priorizar error de validación sobre error de auth', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Error de auth',
      clearError: mockClearError,
    });

    (validateIdentifier as jest.Mock).mockReturnValue({
      isValid: false,
      error: 'Error de validación',
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Error de validación');
  });

  it('debe reflejar el estado de loading del store', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    });

    const { result } = renderHook(() => useLogin());

    expect(result.current.isLoading).toBe(true);
  });
});
