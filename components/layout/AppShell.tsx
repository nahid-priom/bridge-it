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

/** Public chrome hidden; admin keeps its own dark UI (see app/admin/layout.tsx). */
const NO_SHELL_PREFIXES = ['/admin'];
const NO_BREADCRUMB_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  if (hideShell) {
    return <>{children}</>;
  }

  const isHome = pathname === '/';
  const hideBreadcrumb = NO_BREADCRUMB_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <AuthProfileProvider profile={authProfile}>
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
      <Footer categories={categories} />
      <ChatWidget />
      <GlobalSearchModal />
      <Notification />
    </div>
    </AuthProfileProvider>
  );
}
