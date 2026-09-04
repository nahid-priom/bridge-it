'use client';

import { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { Notification } from '@/components/Notification';
import { SiteBreadcrumb } from '@/components/layout/SiteBreadcrumb';
import { AuthProfileProvider } from '@/components/auth/AuthProfileContext';
import { SellerActivationListener } from '@/components/seller/SellerActivationListener';
import { unlockBodyScroll } from '@/hooks/useBodyScrollLock';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/cn';

const GlobalSearchModal = dynamic(
  () =>
    import('@/components/GlobalSearchModal').then((mod) => mod.GlobalSearchModal),
  { ssr: false }
);

/** Public chrome hidden; admin keeps its own dark UI (see app/admin/layout.tsx). */
const NO_SHELL_PREFIXES = ['/admin', '/dashboard'];
const NO_BREADCRUMB_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
  '/search',
  '/seller',
];

function scrollWindowToTop() {
  if (typeof window === 'undefined') return;
  if (window.location.hash) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
}

function RouteScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';

  useEffect(() => {
    useStore.getState().closeSearchModal();
    unlockBodyScroll();
    scrollWindowToTop();
  }, [pathname, search]);

  return null;
}

export function AppShell({
  children,
  categories,
  authProfile = null,
}: {
  children: React.ReactNode;
  categories: Category[];
  authProfile?: AuthProfile | null;
}) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PREFIXES.some((p) => pathname.startsWith(p));

  const scrollWatcher = (
    <Suspense fallback={null}>
      <RouteScrollToTop />
    </Suspense>
  );

  if (hideShell) {
    return (
      <>
        {scrollWatcher}
        {children}
      </>
    );
  }

  const isHome = pathname === '/';
  const hideBreadcrumb = NO_BREADCRUMB_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <AuthProfileProvider profile={authProfile}>
    <SellerActivationListener />
    {scrollWatcher}
    <div className={cn('min-h-screen text-text-primary', isHome ? 'bg-transparent' : 'bg-background')}>
      <Navbar categories={categories} authProfile={authProfile} />
      <main
        id="main-content"
        className={
          isHome || hideBreadcrumb ? '' : 'page-content page-content--with-breadcrumb'
        }
      >
        {!hideBreadcrumb && <SiteBreadcrumb />}
        {children}
      </main>
      <Footer />
      <GlobalSearchModal />
      <Notification />
    </div>
    </AuthProfileProvider>
  );
}
