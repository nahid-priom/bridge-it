'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { unlockBodyScroll } from '@/hooks/useBodyScrollLock';
import { useStore } from '@/store/useStore';

/**
 * Single source of truth for document vertical scroll on navigation.
 *
 * - New pathname (push/replace) → jump to top (instant)
 * - Back/Forward → restore saved Y for that pathname
 * - Query/hash-only / same-path state → no vertical jump
 * - Hash present → scroll to target section
 * - First paint / refresh → leave browser position alone (unless hash)
 */
function scrollWindow(y: number) {
  window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: 'start' });
  return true;
}

export function ScrollManager() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);
  const positionsRef = useRef<Map<string, number>>(new Map());
  const isPopRef = useRef(false);
  const isFirstPaintRef = useRef(true);

  // Manual restoration so we own back/forward; refresh still uses first-paint skip.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const onPopState = () => {
      isPopRef.current = true;
    };

    const onHashChange = () => {
      const { hash } = window.location;
      if (!hash) return;
      // In-page hash click is an intentional user action.
      requestAnimationFrame(() => {
        scrollToHash(hash, 'smooth');
      });
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // Persist scroll Y for the active pathname (for back/forward restore).
  useEffect(() => {
    const onScroll = () => {
      const key = prevPathnameRef.current ?? pathname;
      positionsRef.current.set(key, window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';

    // Soft route cleanup — pathname only (not search/query).
    useStore.getState().closeSearchModal();
    unlockBodyScroll();

    // Refresh / first hydration: do not force top; only honor hash if present.
    if (isFirstPaintRef.current) {
      isFirstPaintRef.current = false;
      prevPathnameRef.current = pathname;
      if (hash) {
        // Wait one frame so the target exists after hydration.
        requestAnimationFrame(() => {
          scrollToHash(hash, 'auto');
        });
      }
      return;
    }

    // Same pathname (query/state/re-render) → keep position.
    if (prev === pathname) {
      return;
    }

    const wasPop = isPopRef.current;
    isPopRef.current = false;

    // Remember where we left the previous page.
    if (prev) {
      positionsRef.current.set(prev, window.scrollY);
    }
    prevPathnameRef.current = pathname;

    // Defer one frame so the new route's layout is in the DOM (avoids a second jump).
    requestAnimationFrame(() => {
      if (hash) {
        if (!scrollToHash(hash, 'auto')) {
          scrollWindow(0);
        }
        return;
      }

      if (wasPop) {
        const saved = positionsRef.current.get(pathname) ?? 0;
        scrollWindow(saved);
        return;
      }

      // Fresh navigation → top, instant (no smooth travel).
      scrollWindow(0);
    });
  }, [pathname]);

  return null;
}
