'use client';

import { createContext, useContext } from 'react';
import type { AdminDashboardData } from '@/types/admin';

const AdminDataContext = createContext<AdminDashboardData | null>(null);

export function AdminDataProvider({
  data,
  children,
}: {
  data: AdminDashboardData;
  children: React.ReactNode;
}) {
  return <AdminDataContext.Provider value={data}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDashboardData {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return ctx;
}
