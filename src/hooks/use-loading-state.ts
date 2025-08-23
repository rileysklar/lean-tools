import { useState, useCallback } from 'react';

/**
 * Hook for managing loading states with error handling
 * Provides consistent loading state management across components
 */
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = useCallback((err: string) => {
    setError(err);
    setIsLoading(false);
  }, []);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    resetState
  };
}
