// Custom React hooks

import { useEffect, useRef } from 'react';

/**
 * Hook for cleanup of intervals and timeouts
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
 * Hook for localStorage with SSR safety
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
