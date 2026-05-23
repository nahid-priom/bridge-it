'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useScrollThreshold } from '@/hooks/useScrollThreshold';

const SCROLL_THRESHOLD = 140;

export type FloatingNavbarState = {
  /** Home (hero) page at top — minimal navbar, no search */
  isHeroMode: boolean;
  /** Past scroll threshold — compact, solid navbar */
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
  const isHeroMode = isHomeHeroRoute && !isPastThreshold;
  const showNavbarSearch = !isHeroMode;

  useEffect(() => {
    document.documentElement.dataset.navScrolled = isScrolled ? 'true' : 'false';
    document.documentElement.dataset.navHeroMode = isHeroMode ? 'true' : 'false';
    return () => {
      delete document.documentElement.dataset.navScrolled;
      delete document.documentElement.dataset.navHeroMode;
    };
  }, [isScrolled, isHeroMode]);

  return {
    isHeroMode,
    isScrolled,
    showNavbarSearch,
    scrollY,
    isPastThreshold,
  };
}
