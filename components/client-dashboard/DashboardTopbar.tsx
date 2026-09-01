'use client';

import { useState } from 'react';
import { Bell, Menu, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavbarProfileMenu } from '@/components/navbar/NavbarProfileMenu';
import type { AuthProfile } from '@/lib/auth/types';
import type { ClientNotification } from '@/types/client-dashboard';
import { cn } from '@/lib/cn';

export function DashboardTopbar({
  title,
  subtitle,
  authProfile,
  notifications,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  authProfile: AuthProfile | null;
  notifications: ClientNotification[];
  onMenuClick: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-4 lg:px-6 pt-3 pb-2">
      <div
        className={cn(
          'flex items-center gap-3 sm:gap-4 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3',
          'bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl',
          'border border-slate-200/80 dark:border-white/10',
          'shadow-[0_4px_24px_rgba(15,23,42,0.04)]'
        )}
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1 hidden sm:block">
          <h1 className="text-base sm:text-lg font-bold text-text-primary truncate">{title}</h1>
          {subtitle && <p className="text-xs text-text-muted truncate">{subtitle}</p>}
        </div>

        <div className="flex-1 sm:flex-none sm:max-w-md min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search orders, projects..."
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-sm focus:outline-none focus:border-deshi-green/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-deshi-green text-white text-xs font-semibold hover:brightness-105"
          >
            <Plus className="w-4 h-4" /> New Order
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 font-semibold text-sm">
                    Notifications
                  </div>
                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={cn(
                          'px-4 py-3 border-b border-slate-50 dark:border-white/5',
                          !n.read && 'bg-emerald-50/30 dark:bg-emerald-500/5'
                        )}
                      >
                        <p className="text-sm font-semibold">{n.title}</p>
                        <p className="text-xs text-text-muted">{n.body}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavbarProfileMenu authProfile={authProfile} compact />
        </div>
      </div>
    </header>
  );
}
