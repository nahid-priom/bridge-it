'use client';

import React, { useState, useEffect } from 'react';
import { BRANDING } from '@/lib/config/branding';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminSearchModal } from './AdminSearchModal';
import { adminNavItems } from '@/lib/admin/config';
import type { AdminSection } from '@/types/admin';
import { useAdminData } from '@/components/admin/AdminDataContext';
import { useStore } from '@/store/useStore';

interface AdminDashboardLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  const { notifications: adminNotifications } = useAdminData();
  const { setNotification } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItem = adminNavItems.find((n) => n.id === activeSection);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="min-h-screen bg-bridge-dark mesh-gradient overflow-x-hidden">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="lg:pl-64 xl:pl-72 flex flex-col min-h-screen min-w-0">
        <AdminTopbar
          title={navItem?.label ?? 'Admin'}
          subtitle={`${BRANDING.adminName} — Platform Control`}
          onMenuClick={() => setMobileOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onQuickAction={() => setNotification('Quick action panel — demo mode')}
          notifications={adminNotifications}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      <AdminSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
