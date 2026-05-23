'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { ChatWidget } from '@/components/ChatWidget';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { Notification } from '@/components/Notification';
import { SiteBreadcrumb } from '@/components/layout/SiteBreadcrumb';
import { AuthProfileProvider } from '@/components/auth/AuthProfileContext';
import { SellerActivationListener } from '@/components/seller/SellerActivationListener';
import { unlockBodyScroll } from '@/hooks/useBodyScrollLock';
import { useStore } from '@/store/useStore';

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

  useEffect(() => {
    useStore.getState().closeSearchModal();
    unlockBodyScroll();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  if (hideShell) {
    return <>{children}</>;
  }

  const isHome = pathname === '/';
  const hideBreadcrumb = NO_BREADCRUMB_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <AuthProfileProvider profile={authProfile}>
    <SellerActivationListener />
    <div className="min-h-screen bg-background text-text-primary">
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
      <ChatWidget />
      <GlobalSearchModal />
      <Notification />
    </div>
    </AuthProfileProvider>
  );
}
