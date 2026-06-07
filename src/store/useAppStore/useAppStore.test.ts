import {renderHook, act} from '@testing-library/react-native';
import {useAppStore} from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const {result} = renderHook(() => useAppStore());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should not affect error state when setting loading', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('Test error');
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('Something went wrong');
      });

      expect(result.current.error).toBe('Something went wrong');
    });

    it('should update error message', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('First error');
      });

      expect(result.current.error).toBe('First error');

      act(() => {
        result.current.setError('Second error');
      });

      expect(result.current.error).toBe('Second error');
    });

    it('should set error to null', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('Error message');
      });

      expect(result.current.error).toBe('Error message');

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });

    it('should not affect loading state when setting error', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('Error to clear');
      });

      expect(result.current.error).toBe('Error to clear');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should not affect loading state when clearing error', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
        result.current.setError('Test error');
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle clearing error when no error exists', () => {
      const {result} = renderHook(() => useAppStore());

      expect(result.current.error).toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('combined operations', () => {
    it('should handle multiple state changes', () => {
      const {result} = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();

      act(() => {
        result.current.setError('Operation failed');
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('Operation failed');

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Operation failed');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
