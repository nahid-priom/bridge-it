'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useFloatingNavbar } from '@/hooks/useFloatingNavbar';
import { ROUTES } from '@/lib/routes';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { DeshiFiverrLogo } from '@/components/brand/DeshiFiverrLogo';
import { ServicesMegaMenu } from '@/components/navbar/ServicesMegaMenu';
import { ProductsMegaMenu } from '@/components/navbar/ProductsMegaMenu';
import { ExploreDropdown } from '@/components/navbar/ExploreDropdown';
import { NavbarQuickActions } from '@/components/navbar/NavbarQuickActions';
import { NavbarProfileMenu } from '@/components/navbar/NavbarProfileMenu';
import { MobileMarketplaceNavbar } from '@/components/navbar/mobile/MobileMarketplaceNavbar';
import { cn } from '@/lib/cn';

type OpenMenu = 'services' | 'products' | 'explore' | null;

const navEase = [0.22, 1, 0.36, 1] as const;

export function FloatingNavbar({
  categories: _categories,
  authProfile = null,
}: {
  categories: Category[];
  authProfile?: AuthProfile | null;
}) {
  void _categories;
  const cart = useStore((s) => s.cart);
  const openSearchModal = useStore((s) => s.openSearchModal);
  const { goToCart } = useAppNavigation();
  const pathname = usePathname();
  const { isHeroMode, isScrolled } = useFloatingNavbar();

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const closeDropdowns = useCallback(() => setOpenMenu(null), []);

  const isServicesActive =
    pathname.startsWith('/search') || pathname.startsWith('/services');
  const isProductsActive = pathname.startsWith('/products');

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
    setOpenMenu(null);
    useStore.setState({ isMenuOpen: false });
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const onlyOneOpen = (id: OpenMenu) => {
    setOpenMenu((current) => (current === id ? null : id));
  };

  const showBecomeSeller = !authProfile || authProfile.role === 'buyer';

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
        {/* Mobile: compact premium marketplace header */}
        <div className="lg:hidden">
          <MobileMarketplaceNavbar
            authProfile={authProfile}
            cartCount={cart.length}
            notificationCount={3}
            messageCount={0}
            isScrolled={isScrolled}
            isHeroMode={isHeroMode}
          />
        </div>

        {/* Desktop / tablet landscape */}
        <motion.nav
          layout
          transition={{ duration: 0.32, ease: navEase }}
          className={cn(
            'premium-navbar-shell relative hidden lg:block min-w-0 w-full',
            'rounded-none border-x-0 transition-[height,box-shadow,transform,padding] duration-300',
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
          <div className="flex items-center gap-3 lg:gap-6 shrink-0 min-w-0">
            <Link
              href={ROUTES.home}
              className="shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-xl"
              aria-label="Deshi Fiverr — home"
            >
              <DeshiFiverrLogo size="nav-lg" showText />
            </Link>

            <div className="flex items-center gap-0.5 xl:gap-1">
              <ServicesMegaMenu
                open={openMenu === 'services'}
                active={isServicesActive}
                onToggle={() => onlyOneOpen('services')}
                onClose={closeDropdowns}
              />
              <ProductsMegaMenu
                open={openMenu === 'products'}
                active={isProductsActive}
                onToggle={() => onlyOneOpen('products')}
                onClose={closeDropdowns}
              />
              <ExploreDropdown
                open={openMenu === 'explore'}
                active={pathname === ROUTES.about}
                onToggle={() => onlyOneOpen('explore')}
                onClose={closeDropdowns}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0" aria-hidden />

          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 ml-auto">
            <NavbarQuickActions
              cartCount={cart.length}
              notificationCount={3}
              messageCount={0}
              onCartClick={goToCart}
              onSearchClick={openSearchModal}
            />

            {showBecomeSeller && (
              <Link
                href={becomeSellerPath(authProfile)}
                className={cn(
                  'inline-flex items-center rounded-xl text-sm font-semibold',
                  'text-deshi-green border border-deshi-green/35 bg-emerald-50/50 dark:bg-emerald-500/10',
                  'hover:bg-emerald-100/80 dark:hover:bg-emerald-500/15 hover:border-deshi-green/50',
                  'transition-all duration-200 hover:-translate-y-0.5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
                  isHeroMode ? 'px-4 py-2.5' : 'px-3.5 py-2'
                )}
              >
                Start Selling
              </Link>
            )}

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
