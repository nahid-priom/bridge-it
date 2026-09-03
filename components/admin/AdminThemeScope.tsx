'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'bridge-theme';

function restoreSiteTheme(html: HTMLElement) {
  const stored = localStorage.getItem(STORAGE_KEY) ?? 'system';
  const shouldBeDark =
    stored === 'dark' ||
    (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  html.classList.toggle('dark', shouldBeDark);
}

function isShowcaseAdmin(pathname: string) {
  return pathname.startsWith('/admin/ecommerce-projects') || pathname.startsWith('/admin/ecommerce-leads');
}

/** Keep BITP /admin on dark UI; ecommerce showcase follows the site theme switcher. */
export function AdminThemeScope({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const followSiteTheme = isShowcaseAdmin(pathname);

  useEffect(() => {
    const html = document.documentElement;
    if (followSiteTheme) {
      delete html.dataset.adminRoute;
      restoreSiteTheme(html);
      return;
    }

    html.classList.add('dark');
    html.dataset.adminRoute = 'true';

    return () => {
      delete html.dataset.adminRoute;
      restoreSiteTheme(html);
    };
  }, [followSiteTheme]);

  if (followSiteTheme) {
    return <>{children}</>;
  }

  return (
    <div className="dark min-h-screen bg-bridge-dark text-white" data-admin-route>
      {children}
    </div>
  );
}
