'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { Notification } from '@/components/Notification';
import { SiteBreadcrumb } from '@/components/layout/SiteBreadcrumb';
import { SiteAtmosphere } from '@/components/layout/SiteAtmosphere';
import { ScrollManager } from '@/components/layout/ScrollManager';
import { AuthProfileProvider } from '@/components/auth/AuthProfileContext';
import { SellerActivationListener } from '@/components/seller/SellerActivationListener';

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
  // Catalog pages render their own CatalogBreadcrumb (avoid duplicates)
  '/software',
  '/websites',
  '/marketing',
  '/creative-marketing',
  '/explore',
  '/portfolio',
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
  const isHome = pathname === '/';
  const hideBreadcrumb = NO_BREADCRUMB_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      {/* Mount once for the whole app — never remount across public/dashboard shells. */}
      <ScrollManager />

      {hideShell ? (
        <>
          {children}
          <Notification />
        </>
      ) : (
        <AuthProfileProvider profile={authProfile}>
          <SellerActivationListener />
          <div className="site-atmosphere-bg relative isolate min-h-screen text-text-primary">
            <SiteAtmosphere />
            <div className="relative z-[1]">
              <Navbar categories={categories} authProfile={authProfile} />
              <main
                id="main-content"
                className={
                  isHome
                    ? 'min-h-[calc(100dvh-var(--header-offset))]'
                    : hideBreadcrumb
                      ? 'min-h-[calc(100dvh-var(--header-offset))]'
                      : 'page-content page-content--with-breadcrumb min-h-[calc(100dvh-var(--header-offset))]'
                }
              >
                {!hideBreadcrumb && <SiteBreadcrumb />}
                {children}
              </main>
              <Footer />
              <GlobalSearchModal />
              <Notification />
            </div>
          </div>
        </AuthProfileProvider>
      )}
    </>
  );
}
