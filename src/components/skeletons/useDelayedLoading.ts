'use client';

import { useEffect, useState } from 'react';

/**
 * Delays showing a loading UI so very fast queries don't flash skeletons (~150ms).
 * Does not delay rendering of actual data — only the skeleton visibility.
 */
export function useDelayedLoading(isLoading: boolean, delayMs = 150): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }
    const id = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(id);
  }, [isLoading, delayMs]);

  return show;
}
