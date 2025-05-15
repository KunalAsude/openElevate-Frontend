'use client';

import { useState, useEffect } from 'react';

/**
 * A hook that returns a debounced value that only updates after the specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {[any]} - The debounced value
 */
export function useDebounceValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [debouncedValue];
}

/**
 * A hook that returns a debounced function that only calls the provided function after the specified delay
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function useDebounceCallback(callback, delay) {
  const [timeoutId, setTimeoutId] = useState(null);

  function debouncedCallback(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
}
