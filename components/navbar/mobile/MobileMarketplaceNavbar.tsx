'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ROUTES } from '@/lib/routes';
import type { AuthProfile } from '@/lib/auth/types';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { MobileDrawerMenu } from '@/components/navbar/mobile/MobileDrawerMenu';
import { MobileProfileSheet } from '@/components/navbar/mobile/MobileProfileSheet';
import { MobileSearchOverlay } from '@/components/navbar/mobile/MobileSearchOverlay';
import { cn } from '@/lib/cn';

const tapEase = [0.22, 1, 0.36, 1] as const;

type MobileMarketplaceNavbarProps = {
  authProfile: AuthProfile | null;
  cartCount?: number;
  messageCount?: number;
  isScrolled?: boolean;
  isHeroMode?: boolean;
};

function GhostIconButton({
  label,
  onClick,
  pressed,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15, ease: tapEase }}
      className={cn(
        'inline-flex items-center justify-center w-11 h-11 rounded-full shrink-0',
        'text-slate-600 dark:text-slate-300',
        'bg-slate-100/60 dark:bg-white/[0.06]',
        'hover:bg-slate-100 dark:hover:bg-white/10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
        pressed && 'bg-slate-200/80 dark:bg-white/12',
        className
      )}
    >
      {children}
    </motion.button>
  );
}

function NavIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.94 }}
      className={cn(
        'relative inline-flex items-center justify-center w-11 h-11 rounded-full shrink-0',
        'text-slate-600 dark:text-slate-300',
        'hover:bg-slate-100/90 dark:hover:bg-white/10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40'
      )}
    >
      {children}
    </motion.button>
  );
}

export function MobileMarketplaceNavbar({
  authProfile,
  cartCount = 0,
  messageCount = 0,
  isScrolled = false,
  isHeroMode = false,
}: MobileMarketplaceNavbarProps) {
  const isMenuOpen = useStore((s) => s.isMenuOpen);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    useStore.setState({ isMenuOpen: false });
  }, []);

  const toggleDrawer = useCallback(() => {
    useStore.setState((s) => ({
      isMenuOpen: !s.isMenuOpen,
      isSearchModalOpen: false,
    }));
    setProfileOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    useStore.setState({ isSearchModalOpen: true, isMenuOpen: false });
    setProfileOpen(false);
  }, []);

  const openProfile = useCallback(() => {
    setProfileOpen(true);
    useStore.setState({ isMenuOpen: false, isSearchModalOpen: false });
  }, []);

  const name = authProfile?.full_name ?? authProfile?.email?.split('@')[0] ?? 'Guest';
  const isLoggedIn = Boolean(authProfile);

  return (
    <>
      <motion.nav
        layout
        transition={{ duration: 0.28, ease: tapEase }}
        className={cn(
          'mobile-premium-navbar-shell relative min-w-0 w-full',
          'rounded-none border-0 py-2 min-h-[64px] max-h-[68px]',
          'transition-[box-shadow,backdrop-filter,transform] duration-300',
          isScrolled && 'mobile-premium-navbar-shell--scrolled',
          isHeroMode && 'mobile-premium-navbar-shell--hero'
        )}
        aria-label="Mobile navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 w-full min-w-0 h-full">
          <Link
            href={ROUTES.home}
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
            aria-label="Bridge IT Park — home"
          >
            <BridgeLogo iconSize="sm" textVisibility="always" href={false} />
          </Link>

          <div className="flex-1 min-w-0" aria-hidden />

          <div className="ml-auto flex items-center gap-0.5 shrink-0">
            <NavIconButton label="Search services" onClick={openSearch}>
              <Search className="w-[19px] h-[19px]" strokeWidth={1.75} aria-hidden />
            </NavIconButton>
            <motion.button
              type="button"
              onClick={openProfile}
              aria-label="Account menu"
              whileTap={{ scale: 0.94 }}
              className={cn(
                'relative inline-flex items-center justify-center w-11 h-11 rounded-full p-0.5',
                'ring-2 ring-slate-200/80 dark:ring-white/15',
                'hover:ring-deshi-green/40 transition-shadow',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50'
              )}
            >
              <SellerAvatar name={name} size="sm" hue={isLoggedIn ? undefined : 200} />
              {isLoggedIn && (
                <span
                  className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-[1.5px] ring-white dark:ring-deshi-navy"
                  aria-hidden
                />
              )}
            </motion.button>
            <GhostIconButton label={isMenuOpen ? 'Close menu' : 'Open menu'} onClick={toggleDrawer} pressed={isMenuOpen}>
              <motion.span
                key={isMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                )}
              </motion.span>
            </GhostIconButton>
          </div>
        </div>
      </motion.nav>

      <MobileDrawerMenu
        open={isMenuOpen}
        onClose={closeDrawer}
        authProfile={authProfile}
        cartCount={cartCount}
        messageCount={messageCount}
      />

      <MobileSearchOverlay />

      <MobileProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        authProfile={authProfile}
        cartCount={cartCount}
        messageCount={messageCount}
      />
    </>
  );
}
