import type { ReactNode } from 'react';
import { AdminThemeScope } from '@/components/admin/AdminThemeScope';

/** Admin routes stay dark; excluded from public site theme switching. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminThemeScope>{children}</AdminThemeScope>;
}
