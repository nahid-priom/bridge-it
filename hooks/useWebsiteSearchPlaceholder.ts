'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

/** Mixed 2–3 word phrases across websites, software, and creative marketing. */
export const ECOSYSTEM_SEARCH_TERMS = [
  'Fashion Store Website',
  'Beauty Shop Design',
  'Electronics Hub Store',
  'Garments ERP System',
  'Retail POS Software',
  'Clinic Management System',
  'HR Payroll Software',
  'Social Media Design',
  'Brand Identity Pack',
  'Facebook Ads Setup',
] as const;

/** @deprecated Prefer ECOSYSTEM_SEARCH_TERMS */
export const WEBSITE_SEARCH_TERMS = ECOSYSTEM_SEARCH_TERMS;

export const WEBSITE_SEARCH_FALLBACK = 'Search Fashion Store Website, Garments ERP...';

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
  const typed = useTypewriter(ECOSYSTEM_SEARCH_TERMS, {
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
