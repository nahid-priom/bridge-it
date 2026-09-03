'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, MessageSquare, Plus } from 'lucide-react';
import { BridgeLogo } from '@/components/brand/BridgeLogo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { BRANDING } from '@/lib/config/branding';
import { cn } from '@/lib/cn';
import type { AuthProfile } from '@/lib/auth/types';
import { isShowcaseEditorRole } from '../config/roles';

const LINKS = [
  { href: '/admin/ecommerce-projects', label: 'Projects', icon: LayoutGrid },
  { href: '/admin/ecommerce-leads', label: 'Leads', icon: MessageSquare },
];

export function ShowcaseAdminShell({
  profile,
  children,
}: {
  profile: AuthProfile;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const canEdit = isShowcaseEditorRole(profile.role);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 xl:w-72 border-r border-border-subtle bg-surface">
        <div className="p-5 border-b border-border-subtle flex items-center gap-3">
          <BridgeLogo variant="mark" href={false} className="shrink-0" />
          <div>
            <p className="text-sm font-bold font-display">{BRANDING.adminName}</p>
            <p className="text-[10px] text-text-muted">E-commerce Showcase</p>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {LINKS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  active
                    ? 'bg-emerald-500/15 text-text-primary border border-emerald-500/30'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          {canEdit ? (
            <Link
              href="/admin/ecommerce-projects/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              <Plus className="w-4 h-4" />
              Add project
            </Link>
          ) : null}
        </nav>
        <div className="p-4 border-t border-border-subtle space-y-3">
          <ThemeSwitcher />
          {profile.role === 'admin' || profile.role === 'super_admin' ? (
            <Link href="/admin" className="block text-sm text-text-muted hover:text-text-primary">
              BITP Control Center
            </Link>
          ) : null}
          <Link href="/" className="block text-sm text-text-muted hover:text-text-primary">
            View public site
          </Link>
        </div>
      </aside>
      <div className="lg:pl-64 xl:pl-72">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <p className="font-display font-bold">Showcase Admin</p>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link href="/admin/ecommerce-projects" className="text-sm text-emerald-600">
              Projects
            </Link>
          </div>
        </header>
        <main className="px-4 sm:px-6 lg:px-8 py-6 w-[min(100%,95vw)] max-w-[1600px] mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
