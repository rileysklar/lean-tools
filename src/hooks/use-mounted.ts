import { useState, useEffect } from 'react';

/**
 * Hook to track if a component has mounted on the client side
 * Useful for preventing hydration mismatches and ensuring client-only code runs
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
