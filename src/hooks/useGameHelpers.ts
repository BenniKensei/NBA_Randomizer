// Custom React hooks for timer cleanup and SSR-safe local state access.

import { useEffect, useRef } from 'react';

/**
 * Tracks timers so a component can cancel every interval and timeout on
 * unmount. This prevents orphaned animations and delayed callbacks from
 * mutating state after the UI has moved on.
 */
export const useCleanup = () => {
  const timersRef = useRef<{
    intervals: NodeJS.Timeout[];
    timeouts: NodeJS.Timeout[];
  }>({
    intervals: [],
    timeouts: []
  });

  const addInterval = (interval: NodeJS.Timeout) => {
    timersRef.current.intervals.push(interval);
    return interval;
  };

  const addTimeout = (timeout: NodeJS.Timeout) => {
    timersRef.current.timeouts.push(timeout);
    return timeout;
  };

  useEffect(() => {
    return () => {
      timersRef.current.intervals.forEach(clearInterval);
      timersRef.current.timeouts.forEach(clearTimeout);
    };
  }, []);

  return { addInterval, addTimeout };
};

/**
 * Reads and writes a localStorage value without touching `window` during SSR.
 * The hook returns the last known value immediately, then hydrates from the
 * browser storage once the component mounts.
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const storedValueRef = useRef(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        storedValueRef.current = JSON.parse(item);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      storedValueRef.current = value;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValueRef.current, setValue];
};
