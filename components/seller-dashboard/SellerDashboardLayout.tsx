'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SellerSidebar } from '@/components/seller-dashboard/SellerSidebar';
import { SellerTopbar } from '@/components/seller-dashboard/SellerTopbar';
import { getSellerNavItem } from '@/lib/seller-dashboard/config';
import type { AuthProfile } from '@/lib/auth/types';
import { cn } from '@/lib/cn';

export function SellerDashboardLayout({
  children,
  authProfile,
}: {
  children: React.ReactNode;
  authProfile: AuthProfile | null;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = getSellerNavItem(pathname);

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0a0f1a]">
      <div
        className="pointer-events-none fixed inset-0 opacity-60 dark:opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 0% 0%, rgba(16,185,129,0.08), transparent 50%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(108,60,225,0.08), transparent 45%)',
        }}
      />

      <SellerSidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen min-w-0 transition-[padding] duration-300',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64 xl:pl-72'
        )}
      >
        <SellerTopbar
          title={nav?.label ?? 'Seller Hub'}
          subtitle="Deshi Fiverr — Seller workspace"
          authProfile={authProfile}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 min-w-0 px-3 sm:px-4 lg:px-6 py-2 lg:py-4 pb-12 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
