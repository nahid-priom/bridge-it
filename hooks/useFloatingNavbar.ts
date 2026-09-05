'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useScrollThreshold } from '@/hooks/useScrollThreshold';

const SCROLL_THRESHOLD = 24;

export type FloatingNavbarState = {
  /** Home page at top — compact chrome (e.g. delayed search reveal) */
  isHeroMode: boolean;
  /** At page top — transparent shell so nav aligns with hero atmosphere */
  isTransparent: boolean;
  /** Past scroll threshold — sticky frosted surface */
  isScrolled: boolean;
  /** Reveal navbar search (desktop bar + mobile trigger) */
  showNavbarSearch: boolean;
  scrollY: number;
  isPastThreshold: boolean;
};

export function useFloatingNavbar(
  options: { threshold?: number; heroPath?: string } = {}
): FloatingNavbarState {
  const threshold = options.threshold ?? SCROLL_THRESHOLD;
  const heroPath = options.heroPath ?? ROUTES.home;
  const pathname = usePathname();
  const { scrollY, isPastThreshold, isScrolled } = useScrollThreshold(threshold);

  const isHomeHeroRoute =
    pathname === heroPath || pathname === `${heroPath}/` || pathname === '';
  const isTransparent = !isPastThreshold;
  const isHeroMode = isHomeHeroRoute && isTransparent;
  const showNavbarSearch = !isHeroMode;

  useEffect(() => {
    document.documentElement.dataset.navScrolled = isScrolled ? 'true' : 'false';
    document.documentElement.dataset.navTransparent = isTransparent ? 'true' : 'false';
    document.documentElement.dataset.navHeroMode = isHeroMode ? 'true' : 'false';
    return () => {
      delete document.documentElement.dataset.navScrolled;
      delete document.documentElement.dataset.navTransparent;
      delete document.documentElement.dataset.navHeroMode;
    };
  }, [isScrolled, isTransparent, isHeroMode]);

  return {
    isHeroMode,
    isTransparent,
    isScrolled,
    showNavbarSearch,
    scrollY,
    isPastThreshold,
  };
}
