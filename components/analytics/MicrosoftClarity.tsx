'use client';

import { useEffect } from 'react';
import { scheduleDeferredThirdParty } from '@/lib/analytics/defer-third-party';
import { CLARITY_ID } from '@/lib/config/clarity';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

function injectClarity(projectId: string) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ms-clarity')) return;

  (function (c: Window, l: Document, a: 'clarity', r: 'script', i: string) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        (c[a]!.q = c[a]!.q || []).push(args);
      };
    const t = l.createElement(r);
    t.id = 'ms-clarity';
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}`;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId);
}

/**
 * Microsoft Clarity — deferred until idle / first interaction.
 * Does not load during initial paint or hydration.
 */
export function MicrosoftClarity() {
  useEffect(() => {
    if (!CLARITY_ID) return;
    return scheduleDeferredThirdParty(() => injectClarity(CLARITY_ID));
  }, []);

  return null;
}
