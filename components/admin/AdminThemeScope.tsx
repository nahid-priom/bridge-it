'use client';

import { useEffect, type ReactNode } from 'react';

const STORAGE_KEY = 'bridge-theme';

function restoreSiteTheme(html: HTMLElement) {
  const stored = localStorage.getItem(STORAGE_KEY) ?? 'system';
  const shouldBeDark =
    stored === 'dark' ||
    (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  html.classList.toggle('dark', shouldBeDark);
}

/** Keep /admin on dark UI regardless of site-wide Light/Dark/System preference. */
export function AdminThemeScope({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('dark');
    html.dataset.adminRoute = 'true';

    return () => {
      delete html.dataset.adminRoute;
      restoreSiteTheme(html);
    };
  }, []);

  return (
    <div className="dark min-h-screen bg-bridge-dark text-white" data-admin-route>
      {children}
    </div>
  );
}
