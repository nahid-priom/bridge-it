'use client';

import { useEffect, useState } from 'react';

const DEFAULT_THRESHOLD = 140;

/**
 * Scroll position with rAF-throttled updates for smooth 60fps-friendly listeners.
 */
export function useScrollThreshold(threshold = DEFAULT_THRESHOLD) {
  const [scrollY, setScrollY] = useState(0);
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let lastY = -1;

    const measure = () => {
      rafId = 0;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      setScrollY(y);
      setIsPastThreshold(y > threshold);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return {
    scrollY,
    isPastThreshold,
    /** Alias aligned with navbar scrolled styling */
    isScrolled: isPastThreshold,
  };
}
