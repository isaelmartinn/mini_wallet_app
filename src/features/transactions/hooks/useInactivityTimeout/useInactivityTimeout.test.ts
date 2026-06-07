import {renderHook, act} from '@testing-library/react-native';
import {useInactivityTimeout} from './useInactivityTimeout';

jest.useFakeTimers();

describe('useInactivityTimeout', () => {
  const mockOnTimeout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Inicialización', () => {
    it('should initialize with correct default values', () => {
      const {result} = renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      expect(result.current.isActive).toBe(true);
      expect(result.current.remainingTime).toBe(5000);
    });

    it('should not start timer when enabled is false', () => {
      renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: false,
        })
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnTimeout).not.toHaveBeenCalled();
    });
  });

  describe('Funcionalidad del Timer', () => {
    it('should call onTimeout after specified time', () => {
      renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnTimeout).toHaveBeenCalledTimes(1);
    });

    it('should not call onTimeout before timeout expires', () => {
      renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      act(() => {
        jest.advanceTimersByTime(4000);
      });

      expect(mockOnTimeout).not.toHaveBeenCalled();
    });
  });

  describe('Reset Timer', () => {
    it('should reset timer when resetTimer is called', () => {
      const {result} = renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      act(() => {
        result.current.resetTimer();
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockOnTimeout).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockOnTimeout).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple resetTimer calls', () => {
      const {result} = renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      act(() => {
        result.current.resetTimer();
        result.current.resetTimer();
        result.current.resetTimer();
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnTimeout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup timer on unmount', () => {
      const {unmount} = renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      unmount();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnTimeout).not.toHaveBeenCalled();
    });

    it('should cleanup previous timer when resetTimer is called', () => {
      const {result} = renderHook(() =>
        useInactivityTimeout({
          timeoutMs: 5000,
          onTimeout: mockOnTimeout,
          enabled: true,
        })
      );

      act(() => {
        result.current.resetTimer();
      });

      const pendingTimers = jest.getTimerCount();
      expect(pendingTimers).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle enabled changing from true to false', () => {
      const {rerender} = renderHook(
        ({enabled}: {enabled: boolean}) =>
          useInactivityTimeout({
            timeoutMs: 5000,
            onTimeout: mockOnTimeout,
            enabled,
          }),
        {
          initialProps: {enabled: true},
        }
      );

      rerender({enabled: false});

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnTimeout).not.toHaveBeenCalled();
    });
  });
});
