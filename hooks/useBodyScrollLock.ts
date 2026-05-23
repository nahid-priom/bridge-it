'use client';

import { useEffect } from 'react';

let lockCount = 0;
let savedOverflow = '';

/** Reference-counted body scroll lock — safe when multiple overlays use the same flag. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow;
      }
    };
  }, [locked]);
}

/** Call on route changes if a modal unmount race left the page non-scrollable. */
export function unlockBodyScroll() {
  lockCount = 0;
  document.body.style.overflow = savedOverflow || '';
}
