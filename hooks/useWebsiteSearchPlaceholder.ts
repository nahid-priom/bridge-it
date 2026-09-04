'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

/** Exactly 3-word keywords across Website / Software / Business. */
export const ECOSYSTEM_SEARCH_TERMS = [
  'Fashion Store Website',
  'Garments ERP System',
  'Retail POS Software',
  'Clinic Management System',
  'HR Payroll Software',
  'Social Media Design',
  'Brand Identity Pack',
  'Facebook Ads Campaign',
  'Beauty Shop Website',
  'Wholesale Trading ERP',
] as const;

/** @deprecated Prefer ECOSYSTEM_SEARCH_TERMS */
export const WEBSITE_SEARCH_TERMS = ECOSYSTEM_SEARCH_TERMS;

/** Full static line — kept short so it fits mobile without clipping. */
export const WEBSITE_SEARCH_FALLBACK = 'Search Website, Software, Business';

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
    typingMs: 78,
    deletingMs: 42,
    pauseAfterTypeMs: 1600,
    pauseAfterDeleteMs: 340,
  });

  const keyword = animate && typed ? typed : null;
  const placeholder =
    reducedMotion || !animate
      ? WEBSITE_SEARCH_FALLBACK
      : keyword
        ? `Search ${keyword}`
        : WEBSITE_SEARCH_FALLBACK;

  return {
    placeholder,
    keyword,
    animating: animate,
    focused,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}
