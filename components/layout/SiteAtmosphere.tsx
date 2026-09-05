'use client';

import { usePathname } from 'next/navigation';
import { PublicPageAtmosphere } from '@/components/layout/PublicPageAtmosphere';

/**
 * Site-wide public atmosphere mounted in AppShell.
 * Canvas fill is `.site-atmosphere-bg` on the shell; this adds depth layers only.
 */
export function SiteAtmosphere() {
  const pathname = usePathname();
  const isConsultation = pathname === '/consultation' || pathname.startsWith('/consultation/');

  return (
    <PublicPageAtmosphere
      variant={isConsultation ? 'consultation' : 'default'}
      intensity={isConsultation ? 'medium' : 'subtle'}
      mode="fixed"
    />
  );
}
