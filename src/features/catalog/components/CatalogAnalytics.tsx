'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export type CatalogAnalyticsPayload = {
  event: string;
  category_root?: string;
  industry?: string;
  product?: string;
  [key: string]: unknown;
};

/** Fires a dataLayer view event once on mount. */
export function CatalogAnalytics({ payload }: { payload: CatalogAnalyticsPayload }) {
  const fired = useRef(false);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ...payloadRef.current });
  }, []);

  return null;
}
