import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuthStore } from './authStore';
import { authApi } from '@/api/auth';

jest.mock('@/api/auth');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const mockResponse = {
        success: true,
        user: mockUser,
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({ identifier: 'john@example.com' });
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle login failure with error message', async () => {
      const mockResponse = {
        success: false,
        error: 'Credenciales inválidas',
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({ identifier: 'wrong@example.com' });
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Credenciales inválidas');
      });
    });

    it('should handle login failure without error message', async () => {
      const mockResponse = {
        success: false,
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({ identifier: 'test@example.com' });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al iniciar sesión');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle network error during login', async () => {
      (authApi.login as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({ identifier: 'test@example.com' });
      });

      await waitFor(() => {
        expect(result.current.error).toBe(
          'Error de conexión. Intenta de nuevo.',
        );
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
      });
    });

    it('should set loading state during login', async () => {
      const mockResponse = {
        success: true,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      };

      (authApi.login as jest.Mock).mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(mockResponse), 100);
        });
      });

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login({ identifier: 'test@example.com' });
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          isAuthenticated: true,
          error: 'Some error',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle logout when already logged out', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({ error: 'Test error message' });
      });

      expect(result.current.error).toBe('Test error message');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should not affect other state when clearing error', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };

      act(() => {
        useAuthStore.setState({
          user: mockUser,
          isAuthenticated: true,
          error: 'Test error',
        });
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
