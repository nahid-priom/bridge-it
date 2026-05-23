'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { Notification } from '@/components/Notification';
import { SiteBreadcrumb } from '@/components/layout/SiteBreadcrumb';

/** Public chrome hidden; admin keeps its own dark UI (see app/admin/layout.tsx). */
const NO_SHELL_PREFIXES = ['/admin'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  if (hideShell) {
    return <>{children}</>;
  }

  const isHome = pathname === '/';

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main id="main-content" className={isHome ? '' : 'page-content page-content--with-breadcrumb'}>
        <SiteBreadcrumb />
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <GlobalSearchModal />
      <Notification />
    </div>
  );
}
