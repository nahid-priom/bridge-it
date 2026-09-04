'use client';

import { useEffect, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Code2,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  X,
} from 'lucide-react';
import { ROUTES, isNavActive } from '@/lib/routes';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { MAIN_NAV_LINKS } from '@/components/navbar/constants';
import {
  isCategoryNavPath,
  NAV_CATEGORY_PILLARS,
  type NavCategoryPillarId,
} from '@/components/navbar/categoryNav';
import { softwareNavIcon } from '@/components/navbar/softwareNavIcons';
import { MobileQuickActions } from '@/components/navbar/mobile/MobileQuickActions';
import type { AuthProfile } from '@/lib/auth/types';
import { useAuthProfile } from '@/components/auth/AuthProfileContext';
import { resolveDashboardHref } from '@/lib/auth/dashboard-routes';
import { useDashboardModeStore } from '@/store/dashboardModeStore';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { cn } from '@/lib/cn';

const PILLAR_ICONS = {
  websites: LayoutTemplate,
  software: Code2,
  marketing: Megaphone,
} as const;

type MobileDrawerMenuProps = {
  open: boolean;
  onClose: () => void;
  authProfile: AuthProfile | null;
  cartCount?: number;
  messageCount?: number;
};

export function MobileDrawerMenu({
  open,
  onClose,
  authProfile,
  cartCount = 0,
  messageCount = 0,
}: MobileDrawerMenuProps) {
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [openPillar, setOpenPillar] = useState<NavCategoryPillarId | null>(null);

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

  useEffect(() => {
    if (!open) {
      setCategoriesOpen(false);
      setOpenPillar(null);
    }
  }, [open]);

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            className={cn(
              'absolute top-0 right-0 bottom-0 w-[min(100vw-2.5rem,340px)]',
              'flex flex-col overflow-hidden',
              'rounded-l-[1.75rem]',
              'bg-white/92 dark:bg-deshi-navy/94 backdrop-blur-2xl',
              'border-l border-slate-200/70 dark:border-white/10',
              'shadow-[-8px_0_48px_rgba(15,23,42,0.16)]'
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/90 dark:border-white/10">
              <Link href={ROUTES.home} onClick={closeAndNavigate}>
                <BridgeLogo variant="navSm" href={false} />
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
              <nav aria-label="Main navigation">
                {MAIN_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAndNavigate}
                    className={cn(
                      'block py-3 text-[15px] font-semibold border-b border-slate-100/90 dark:border-white/[0.08]',
                      isActive(link.href) ? 'text-deshi-green' : 'text-text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-b border-slate-100/90 dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((v) => !v)}
                    aria-expanded={categoriesOpen}
                    className={cn(
                      'flex w-full items-center justify-between py-3 text-left text-[15px] font-semibold',
                      isCategoryNavPath(pathname) || categoriesOpen
                        ? 'text-deshi-green'
                        : 'text-text-primary'
                    )}
                  >
                    Browse by category
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 opacity-70 transition-transform',
                        categoriesOpen && 'rotate-180'
                      )}
                      aria-hidden
                    />
                  </button>

                  {categoriesOpen ? (
                    <div className="pb-3 pl-1">
                      {NAV_CATEGORY_PILLARS.map((pillar) => {
                        const Icon = PILLAR_ICONS[pillar.id];
                        const expanded = openPillar === pillar.id;
                        return (
                          <div key={pillar.id} className="mb-1">
                            <div className="flex items-center gap-1">
                              <Link
                                href={pillar.href}
                                onClick={closeAndNavigate}
                                className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-text-primary hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                              >
                                <Icon className="h-4 w-4 shrink-0 text-[#2563eb]" aria-hidden />
                                <span className="truncate">{pillar.label}</span>
                              </Link>
                              <button
                                type="button"
                                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${pillar.label}`}
                                aria-expanded={expanded}
                                onClick={() =>
                                  setOpenPillar((current) => (current === pillar.id ? null : pillar.id))
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
                              >
                                <ChevronDown
                                  className={cn(
                                    'h-4 w-4 opacity-70 transition-transform',
                                    expanded && 'rotate-180'
                                  )}
                                  aria-hidden
                                />
                              </button>
                            </div>
                            {expanded ? (
                              pillar.id === 'software' ? (
                                <div className="mb-2 ml-2 space-y-2">
                                  <ul className="grid grid-cols-2 gap-1">
                                    {pillar.children.map((child) => {
                                      const ChildIcon = softwareNavIcon(child.id);
                                      return (
                                        <li key={child.id}>
                                          <Link
                                            href={child.href}
                                            onClick={closeAndNavigate}
                                            className="flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-medium text-text-secondary hover:bg-[#2563eb]/06 hover:text-text-primary dark:hover:bg-[#2563eb]/12"
                                          >
                                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:bg-[#2563eb]/20 dark:text-[#60a5fa]">
                                              <ChildIcon className="h-3.5 w-3.5" aria-hidden />
                                            </span>
                                            <span className="truncate">{child.label}</span>
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                  {pillar.moreChildren && pillar.moreChildren.length > 0 ? (
                                    <>
                                      <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                        More
                                      </p>
                                      <ul className="grid grid-cols-2 gap-1">
                                        {pillar.moreChildren.map((child) => {
                                          const ChildIcon = softwareNavIcon(child.id);
                                          return (
                                            <li key={child.id}>
                                              <Link
                                                href={child.href}
                                                onClick={closeAndNavigate}
                                                className="flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-medium text-text-secondary hover:bg-[#2563eb]/06 hover:text-text-primary dark:hover:bg-[#2563eb]/12"
                                              >
                                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:bg-[#2563eb]/20 dark:text-[#60a5fa]">
                                                  <ChildIcon className="h-3.5 w-3.5" aria-hidden />
                                                </span>
                                                <span className="truncate">{child.label}</span>
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </>
                                  ) : null}
                                </div>
                              ) : (
                                <ul className="mb-2 ml-6 space-y-0.5 border-l border-slate-100 pl-3 dark:border-white/10">
                                  {pillar.children.map((child) => (
                                    <li key={child.id}>
                                      <Link
                                        href={child.href}
                                        onClick={closeAndNavigate}
                                        className="block py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary"
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                  {pillar.moreChildren?.map((child) => (
                                    <li key={child.id}>
                                      <Link
                                        href={child.href}
                                        onClick={closeAndNavigate}
                                        className="block py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary"
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </nav>

              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-5 mb-2">
                Quick actions
              </p>
              <MobileQuickActions
                cartCount={cartCount}
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

              <div className="mt-6 pb-4">
                <ThemeSwitcher variant="mobile" />
              </div>

              <div className="mt-2 border-t border-slate-100/90 pb-6 pt-4 dark:border-white/[0.08]">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Follow Us
                </p>
                <SocialLinks variant="light" size="sm" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
