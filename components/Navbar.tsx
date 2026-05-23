'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ROUTES } from '@/lib/routes';
import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { DesktopNav } from '@/components/navbar/DesktopNav';
import { NavbarSearch } from '@/components/navbar/NavbarSearch';
import { NavActionButtons } from '@/components/navbar/NavActionButtons';
import { AuthActions } from '@/components/navbar/AuthActions';
import { MobileDrawer } from '@/components/navbar/MobileDrawer';
import { NavIconButton } from '@/components/navbar/NavIconButton';
import { NAVBAR_SHELL_CLASS } from '@/components/navbar/constants';
import { cn } from '@/lib/cn';

type DropdownId = 'categories' | null;

export const Navbar: React.FC<{
  categories: Category[];
  authProfile?: AuthProfile | null;
}> = ({ categories: _categories, authProfile = null }) => {
  void _categories;
  const cart = useStore((s) => s.cart);
  const isMenuOpen = useStore((s) => s.isMenuOpen);
  const toggleMenu = useStore((s) => s.toggleMenu);
  const openSearchModal = useStore((s) => s.openSearchModal);
  const { goToCart } = useAppNavigation();
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    useStore.setState({ isMenuOpen: false });
  }, []);

  const openDrawer = useCallback(() => {
    useStore.setState({ isMenuOpen: true });
  }, []);

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
    setOpenDropdown(null);
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const categoriesOpen = openDropdown === 'categories';
  const showMenuButton = true;

  const shellClass = cn(
    NAVBAR_SHELL_CLASS,
    'flex items-center gap-3 lg:gap-4 xl:gap-5',
    'h-[72px] lg:h-[76px]',
    'rounded-[22px] lg:rounded-[24px]',
    'px-4 lg:px-5 xl:px-6',
    'min-w-0'
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      <div ref={navRef} className="pointer-events-auto max-w-[1680px] mx-auto w-full min-w-0">
        <nav className={shellClass} aria-label="Main navigation">
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40 rounded-xl"
            aria-label="Bridge Smart IT Park — go to home"
          >
            <BridgeLogo
              textVisibility="never"
              iconSize="nav"
              className="lg:hidden"
            />
            <BridgeLogo
              textVisibility="always"
              iconSize="nav"
              className="hidden lg:flex"
            />
          </Link>

          {/* Desktop nav — xl+ */}
          <DesktopNav
            categoriesOpen={categoriesOpen}
            onCategoriesOpen={() => setOpenDropdown('categories')}
            onCategoriesToggle={() =>
              setOpenDropdown((d) => (d === 'categories' ? null : 'categories'))
            }
            onCategoriesClose={() => setOpenDropdown(null)}
          />

          {/* Search — lg+ (tablet + desktop) */}
          <div className="hidden lg:flex flex-1 justify-end xl:justify-center min-w-0 max-w-none xl:max-w-[460px] mx-0 xl:mx-2">
            <NavbarSearch className="w-full min-w-[200px] md:min-w-[280px] lg:w-[320px] xl:w-[360px] 2xl:w-[460px]" />
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
            {/* Mobile: search opens drawer */}
            <NavIconButton
              label="Open search and menu"
              onClick={openDrawer}
              size="lg"
              className="lg:hidden"
            >
              <Search className="w-5 h-5" aria-hidden />
            </NavIconButton>

            {/* Tablet/desktop icons */}
            <NavActionButtons
              cartCount={cart.length}
              onCartClick={goToCart}
              authProfile={authProfile}
              className="hidden lg:flex"
            />

            {/* Mobile cart only */}
            <NavActionButtons
              cartCount={cart.length}
              onCartClick={goToCart}
              authProfile={authProfile}
              iconSize="lg"
              cartOnly
              className="lg:hidden"
            />

            <div
              className="hidden lg:block w-px h-8 bg-slate-200 dark:bg-white/10 mx-1 shrink-0"
              aria-hidden
            />

            <AuthActions authProfile={authProfile} onNavigate={closeMenu} />

            {/* Menu: mobile + tablet (< xl) */}
            {showMenuButton && (
              <NavIconButton
                label={isMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMenu}
                size="lg"
                className="xl:hidden"
              >
                <Menu className="w-5 h-5" aria-hidden />
              </NavIconButton>
            )}
          </div>
        </nav>

        <MobileDrawer
          open={isMenuOpen}
          onClose={closeMenu}
          authProfile={authProfile}
          cartCount={cart.length}
        />
      </div>
    </header>
  );
};
