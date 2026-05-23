'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, Store, X } from 'lucide-react';
import { ROUTES, isNavActive } from '@/lib/routes';
import { DeshiFiverrLogo } from '@/components/brand/DeshiFiverrLogo';
import {
  NAV_PRODUCT_ITEMS,
  NAV_SERVICE_ITEMS,
  productCategoryHref,
  serviceCategoryHref,
} from '@/components/navbar/constants';
import { EXPLORE_MOBILE_LINKS } from '@/components/navbar/exploreLinks';
import { MobileQuickActions } from '@/components/navbar/mobile/MobileQuickActions';
import type { AuthProfile } from '@/lib/auth/types';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import { useAuthProfile } from '@/components/auth/AuthProfileContext';
import { resolveDashboardHref } from '@/lib/auth/dashboard-routes';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { cn } from '@/lib/cn';

type MobileDrawerMenuProps = {
  open: boolean;
  onClose: () => void;
  authProfile: AuthProfile | null;
  cartCount?: number;
  notificationCount?: number;
  messageCount?: number;
};

function AccordionSection({
  title,
  open,
  onToggle,
  children,
  active,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <div className="border-b border-slate-100/90 dark:border-white/[0.08] last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'w-full flex items-center justify-between py-3 text-[15px] font-semibold',
          active ? 'text-deshi-green' : 'text-text-primary'
        )}
      >
        {title}
        <ChevronDown
          className={cn('w-4 h-4 text-text-muted transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-2.5 pl-0.5 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileDrawerMenu({
  open,
  onClose,
  authProfile,
  cartCount = 0,
  notificationCount = 3,
  messageCount = 0,
}: MobileDrawerMenuProps) {
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);
  const [servicesOpen, setServicesOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  const contextProfile = useAuthProfile();
  const profile = contextProfile ?? authProfile;
  const mode = useDashboardModeStore((s) => s.mode);
  const isLoggedIn = Boolean(profile);
  const dashboardHref = resolveDashboardHref(profile?.role, mode);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const closeAndNavigate = () => onClose();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            className={cn(
              'absolute top-0 left-0 bottom-0 w-[min(100vw-2.5rem,340px)]',
              'flex flex-col overflow-hidden',
              'rounded-r-[1.75rem]',
              'bg-white/92 dark:bg-deshi-navy/94 backdrop-blur-2xl',
              'border-r border-slate-200/70 dark:border-white/10',
              'shadow-[8px_0_48px_rgba(15,23,42,0.16)]'
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/90 dark:border-white/10">
              <Link href={ROUTES.home} onClick={closeAndNavigate}>
                <DeshiFiverrLogo size="mobile" showText />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-slate-100/90 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <nav aria-label="Marketplace navigation">
                <AccordionSection
                  title="Services"
                  open={servicesOpen}
                  onToggle={() => setServicesOpen((v) => !v)}
                  active={isActive(ROUTES.search)}
                >
                  <Link
                    href={ROUTES.search}
                    onClick={closeAndNavigate}
                    className="block py-2 text-sm font-medium text-deshi-green"
                  >
                    All services
                  </Link>
                  {NAV_SERVICE_ITEMS.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={serviceCategoryHref(cat.slug)}
                      onClick={closeAndNavigate}
                      className="flex items-center gap-2 py-2 text-sm text-text-secondary hover:text-deshi-green"
                    >
                      <span aria-hidden>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                </AccordionSection>

                <AccordionSection
                  title="Products"
                  open={productsOpen}
                  onToggle={() => setProductsOpen((v) => !v)}
                  active={isActive(ROUTES.products)}
                >
                  <Link
                    href={ROUTES.products}
                    onClick={closeAndNavigate}
                    className="block py-2 text-sm font-medium text-sky-600 dark:text-sky-400"
                  >
                    All products
                  </Link>
                  {NAV_PRODUCT_ITEMS.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={productCategoryHref(cat.slug)}
                      onClick={closeAndNavigate}
                      className="flex items-center gap-2 py-2 text-sm text-text-secondary hover:text-deshi-green"
                    >
                      <span aria-hidden>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                </AccordionSection>

                <AccordionSection
                  title="Explore"
                  open={exploreOpen}
                  onToggle={() => setExploreOpen((v) => !v)}
                >
                  {EXPLORE_MOBILE_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeAndNavigate}
                      className="block py-2 text-sm text-text-secondary hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </AccordionSection>
              </nav>

              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-5 mb-2">
                Quick actions
              </p>
              <MobileQuickActions
                cartCount={cartCount}
                notificationCount={notificationCount}
                messageCount={messageCount}
                onNavigate={closeAndNavigate}
              />

              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-5 mb-2">
                Account
              </p>
              {isLoggedIn ? (
                <Link
                  href={dashboardHref}
                  onClick={closeAndNavigate}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-deshi-green" aria-hidden />
                  {authProfile?.role === 'seller' ? 'Seller dashboard' : 'My dashboard'}
                </Link>
              ) : (
                <Link
                  href={ROUTES.login}
                  onClick={closeAndNavigate}
                  className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10"
                >
                  Sign in
                </Link>
              )}

              {(!authProfile || authProfile.role === 'buyer') && (
                <Link
                  href={becomeSellerPath(profile)}
                  onClick={closeAndNavigate}
                  className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-deshi-green border border-deshi-green/35 bg-emerald-50/80 dark:bg-emerald-500/10"
                >
                  <Store className="w-4 h-4" aria-hidden />
                  Start Selling
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
