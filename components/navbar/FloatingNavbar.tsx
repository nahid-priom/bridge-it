'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useFloatingNavbar } from '@/hooks/useFloatingNavbar';
import { ROUTES } from '@/lib/routes';
import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { MAIN_NAV_LINKS } from '@/components/navbar/constants';
import { NavbarQuickActions } from '@/components/navbar/NavbarQuickActions';
import { NavbarProfileMenu } from '@/components/navbar/NavbarProfileMenu';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { MobileMarketplaceNavbar } from '@/components/navbar/mobile/MobileMarketplaceNavbar';
import { cn } from '@/lib/cn';
import { isNavActive } from '@/lib/routes';

const navEase = [0.22, 1, 0.36, 1] as const;

export function FloatingNavbar({
  categories: _categories,
  authProfile = null,
}: {
  categories: Category[];
  authProfile?: AuthProfile | null;
}) {
  void _categories;
  const openSearchModal = useStore((s) => s.openSearchModal);
  const pathname = usePathname();
  const { isHeroMode, isScrolled } = useFloatingNavbar();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearchModal]);

  useEffect(() => {
    useStore.setState({ isMenuOpen: false });
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      <div
        className={cn(
          'navbar-glow-bg w-full pt-2 lg:pt-3 transition-opacity duration-300',
          isHeroMode ? 'opacity-70' : 'opacity-100'
        )}
        aria-hidden
      />

      <div ref={navRef} className="pointer-events-auto w-full min-w-0">
        <div className="lg:hidden">
          <MobileMarketplaceNavbar
            authProfile={authProfile}
            cartCount={0}
            notificationCount={0}
            messageCount={0}
            isScrolled={isScrolled}
            isHeroMode={isHeroMode}
          />
        </div>

        <motion.nav
          layout
          transition={{ duration: 0.32, ease: navEase }}
          className={cn(
            'premium-navbar-shell relative hidden lg:block min-w-0 w-full',
            'rounded-none border-0 transition-[height,box-shadow,transform,padding] duration-300',
            isHeroMode
              ? 'py-3.5 lg:py-4 h-[84px] lg:h-[88px] shadow-md'
              : 'py-2 lg:py-2.5 h-[76px] shadow-lg',
            isScrolled && !isHeroMode && 'premium-navbar-shell--scrolled'
          )}
          aria-label="Main navigation"
        >
          <div
            className={cn(
              'container mx-auto px-4 sm:px-6 lg:px-8',
              'flex items-center w-full min-w-0 h-full',
              isHeroMode ? 'gap-3 lg:gap-5' : 'gap-2 lg:gap-3'
            )}
          >
            <div className="flex items-center gap-6 shrink-0 min-w-0">
              <Link
                href={ROUTES.home}
                className="shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-xl"
                aria-label="Bridge IT Park — home"
              >
                <BridgeLogo iconSize="nav" textVisibility="always" href={false} />
              </Link>

              <div className="flex items-center gap-1">
                {MAIN_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-xl text-sm font-semibold transition-colors',
                      isNavActive(pathname, link.href)
                        ? 'text-deshi-green bg-emerald-50/80 dark:bg-emerald-500/10'
                        : 'text-text-primary hover:text-deshi-green hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-0" aria-hidden />

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <ThemeSwitcher />
              <NavbarQuickActions
                cartCount={0}
                notificationCount={0}
                messageCount={0}
                onCartClick={() => openSearchModal()}
                onSearchClick={openSearchModal}
                hideCart
              />

              {!authProfile ? (
                <Link
                  href={ROUTES.login}
                  className={cn(
                    'inline-flex items-center rounded-xl text-sm font-semibold',
                    'text-deshi-green border border-deshi-green/35 bg-emerald-50/50 dark:bg-emerald-500/10',
                    'hover:bg-emerald-100/80 dark:hover:bg-emerald-500/15',
                    isHeroMode ? 'px-4 py-2.5' : 'px-3.5 py-2'
                  )}
                >
                  Login
                </Link>
              ) : null}

              <NavbarProfileMenu
                authProfile={authProfile}
                onNavigate={() => useStore.setState({ isMenuOpen: false })}
                compact
                className="lg:[&_button]:pr-2"
              />
            </div>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
