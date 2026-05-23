'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/client-dashboard/DashboardSidebar';
import { DashboardTopbar } from '@/components/client-dashboard/DashboardTopbar';
import { DashboardMobileNav } from '@/components/client-dashboard/DashboardMobileNav';
import { ActivityTimeline } from '@/components/client-dashboard/ActivityTimeline';
import { getClientNavItem } from '@/lib/client-dashboard/config';
import { demoActivities, demoNotifications } from '@/lib/client-dashboard/demo-data';
import type { AuthProfile } from '@/lib/auth/types';
import { cn } from '@/lib/cn';

export function ClientDashboardLayout({
  children,
  authProfile,
}: {
  children: React.ReactNode;
  authProfile: AuthProfile | null;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = getClientNavItem(pathname);
  const showActivityPanel =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/projects');

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

      <DashboardSidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen min-w-0 transition-[padding] duration-300',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64 xl:pl-72',
          'pb-20 lg:pb-0'
        )}
      >
        <DashboardTopbar
          title={nav?.label ?? 'Client Dashboard'}
          subtitle="Deshi Fiverr — Your workspace"
          authProfile={authProfile}
          notifications={demoNotifications}
          onMenuClick={() => setMobileOpen(true)}
        />

        <div className="flex-1 flex min-w-0 px-3 sm:px-4 lg:px-6 gap-4 lg:gap-6 max-w-[1800px] w-full mx-auto">
          <main className="flex-1 min-w-0 py-2 lg:py-4 pb-8">{children}</main>

          {showActivityPanel && (
            <aside className="hidden xl:block w-80 shrink-0 py-4">
              <ActivityTimeline activities={demoActivities} compact />
            </aside>
          )}
        </div>
      </div>

      <DashboardMobileNav onMenuOpen={() => setMobileOpen(true)} />
    </div>
  );
}
