'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigateToSearch } from '@/hooks/useNavigateToSearch';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import Link from 'next/link';
import { ROUTES, productsUrl } from '@/lib/routes';
import { categories } from '@/data/categories';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Package,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { BridgeLogo } from '@/components/brand/BridgeLogo';

type DropdownId = 'categories' | 'dashboard' | null;

function NavLink({
  label,
  active,
  onClick,
  hasChevron,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  hasChevron?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-1 px-2 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-lg ${
        active
          ? 'text-bridge-primary dark:text-violet-300 dark:font-semibold'
          : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
      {hasChevron && (
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 ${active ? 'opacity-80 dark:opacity-100' : 'opacity-60'}`}
          aria-hidden
        />
      )}
      {active && (
        <span
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-bridge-primary dark:bg-violet-300"
          aria-hidden
        />
      )}
    </button>
  );
}

export const Navbar: React.FC = () => {
  const cart = useStore((s) => s.cart);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const setCategory = useStore((s) => s.setCategory);
  const toggleMenu = useStore((s) => s.toggleMenu);
  const isMenuOpen = useStore((s) => s.isMenuOpen);
  const openSearchModal = useStore((s) => s.openSearchModal);
  const { goToSearch } = useNavigateToSearch();
  const {
    navigate,
    isActive,
    goHome,
    goToCart,
    goToDashboard,
    goToAdmin,
    goToCategories,
    goToProducts,
  } = useAppNavigation();

  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch();
  };

  const categoryPreview = categories.slice(0, 8);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 px-3 sm:px-4 pointer-events-none">
      <div ref={navRef} className="pointer-events-auto container  mx-auto">
        <nav
          className="navbar-shell rounded-[28px] backdrop-blur-xl border px-3 sm:px-4 md:px-5"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between w-full gap-4 lg:gap-6 h-14 md:h-[4.25rem]">
            {/* Logo */}
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                goHome();
              }}
              className="shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-xl"
              aria-label="Bridge Smart IT Park — go to home"
            >
              <BridgeLogo textVisibility="always" />
            </button>

            {/* Search — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex shrink-0 w-full min-w-[12rem] max-w-sm 2xl:max-w-md"
              role="search"
            >
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, sellers, products..."
                  aria-label="Search marketplace"
                  className="w-full pl-4 pr-12 py-2.5 rounded-full bg-background-soft border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border-subtle text-bridge-primary hover:bg-bridge-primary/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Nav links */}
            <div className="hidden lg:flex items-center gap-6 shrink-0">
              <NavLink label="Home" active={isActive(ROUTES.home)} onClick={goHome} />

              <div className="relative">
                <NavLink
                  label="Categories"
                  active={isActive(ROUTES.categories)}
                  onClick={() =>
                    setOpenDropdown(openDropdown === 'categories' ? null : 'categories')
                  }
                  hasChevron
                />
                {openDropdown === 'categories' && (
                  <div className="absolute top-full left-0 mt-2 w-56 py-2 rounded-2xl bg-surface border border-border-subtle shadow-xl z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        goToCategories();
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-bridge-primary hover:bg-background-soft cursor-pointer"
                    >
                      All Categories
                    </button>
                    {categoryPreview.map((cat) => (
                      <Link
                        key={cat.id}
                        href={productsUrl(cat.id)}
                        onClick={() => setOpenDropdown(null)}
                        className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-background-soft hover:text-text-primary flex items-center gap-2"
                      >
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                label="Products"
                active={isActive(ROUTES.products)}
                onClick={() => navigate(ROUTES.products)}
              />
            </div>

            {/* Right: utility icons & account */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  openSearchModal();
                  setShowMobileSearch(true);
                }}
                className="xl:hidden p-2 text-text-muted hover:text-text-primary rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              <ThemeSwitcher variant="navbar" />

              <button
                type="button"
                className="hidden sm:flex p-2 text-text-muted hover:text-text-primary rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={goToCart}
                className="relative p-2 text-text-muted hover:text-text-primary rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label={`Cart${cart.length ? `, ${cart.length} items` : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-bridge-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === 'dashboard' ? null : 'dashboard')
                  }
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-background-soft transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  aria-label="Account menu"
                  aria-expanded={openDropdown === 'dashboard'}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bridge-primary to-bridge-secondary flex items-center justify-center text-white text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-text-primary">
                    Dashboard
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted hidden lg:block" />
                </button>
                {openDropdown === 'dashboard' && (
                  <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-2xl bg-surface border border-border-subtle shadow-xl z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        goToDashboard();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-background-soft cursor-pointer flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-bridge-primary" /> Seller Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        goToAdmin();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-background-soft cursor-pointer"
                    >
                      Admin Control Center
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleMenu}
                className="lg:hidden p-2 text-text-muted rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {showMobileSearch && (
            <form onSubmit={handleSearch} className="xl:hidden pb-3 lg:hidden" role="search">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, sellers, products..."
                  aria-label="Search marketplace"
                  className="w-full pl-4 pr-12 py-2.5 rounded-full bg-background-soft border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-bridge-primary"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden mt-2 rounded-2xl glass backdrop-blur-xl border border-border-subtle shadow-lg p-4 space-y-1 animate-slide-up">
            <ThemeSwitcher variant="mobile" />
            <button
              type="button"
              onClick={goHome}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                isActive(ROUTES.home)
                  ? 'text-bridge-primary dark:text-violet-300 bg-bridge-primary/10 dark:bg-violet-500/15 font-semibold'
                  : 'text-text-secondary'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={goToCategories}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                isActive(ROUTES.categories)
                  ? 'text-bridge-primary dark:text-violet-300 bg-bridge-primary/10 dark:bg-violet-500/15 font-semibold'
                  : 'text-text-secondary'
              }`}
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.products)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                isActive(ROUTES.products)
                  ? 'text-bridge-primary dark:text-violet-300 bg-bridge-primary/10 dark:bg-violet-500/15 font-semibold'
                  : 'text-text-secondary'
              }`}
            >
              <Package className="w-4 h-4" aria-hidden /> Products
            </button>
            <button type="button" onClick={goToDashboard} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-bridge-primary to-bridge-primary-light">
              Dashboard
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
