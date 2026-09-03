'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

export const WEBSITE_SEARCH_TERMS = [
  'Fashion',
  'Electronics',
  'Grocery',
  'Beauty',
  'Furniture',
  'Sports',
] as const;

export const WEBSITE_SEARCH_FALLBACK = 'Search Fashion, Electronics, Grocery...';

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useWebsiteSearchPlaceholder(active: boolean) {
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const animate = active && !focused && !reducedMotion;
  const typed = useTypewriter(WEBSITE_SEARCH_TERMS, {
    enabled: animate,
    typingMs: 72,
    deletingMs: 38,
    pauseAfterTypeMs: 1600,
    pauseAfterDeleteMs: 280,
  });

  const placeholder = reducedMotion || !animate ? WEBSITE_SEARCH_FALLBACK : `Search ${typed}...`;

  return {
    placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}
