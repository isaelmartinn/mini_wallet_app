import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInactivityTimeoutParams {
  timeoutMs: number;
  onTimeout: () => void;
  enabled?: boolean;
}

interface UseInactivityTimeoutReturn {
  resetTimer: () => void;
  remainingTime: number;
  isActive: boolean;
}

export const useInactivityTimeout = ({
  timeoutMs,
  onTimeout,
  enabled = true,
}: UseInactivityTimeoutParams): UseInactivityTimeoutReturn => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimedOutRef = useRef<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(timeoutMs);
  const [isActive, setIsActive] = useState<boolean>(enabled);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((): void => {
    clearTimer();

    if (!enabled || hasTimedOutRef.current) {
      return;
    }

    setRemainingTime(timeoutMs);
    setIsActive(true);

    timerRef.current = setTimeout(() => {
      setIsActive(false);
      hasTimedOutRef.current = true;
      onTimeout();
    }, timeoutMs);
  }, [timeoutMs, onTimeout, enabled, clearTimer]);

  const resetTimer = useCallback((): void => {
    if (!hasTimedOutRef.current) {
      startTimer();
    }
  }, [startTimer]);

  useEffect(() => {
    if (enabled && !hasTimedOutRef.current) {
      startTimer();
    } else {
      clearTimer();
      setIsActive(false);
    }

    return () => {
      clearTimer();
    };
  }, [enabled, startTimer, clearTimer]);

  return {
    resetTimer,
    remainingTime,
    isActive,
  };
};
