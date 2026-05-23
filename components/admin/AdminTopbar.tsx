'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AdminNotification } from '@/data/adminData';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onSearchOpen: () => void;
  onQuickAction?: () => void;
  notifications: AdminNotification[];
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  title,
  subtitle,
  onMenuClick,
  onSearchOpen,
  onQuickAction,
  notifications,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/10">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-bridge-gray hover:text-white hover:bg-white/5 cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white truncate font-display">{title}</h1>
            {subtitle && (
              <p className="text-xs text-bridge-gray truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSearchOpen}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-bridge-dark-2 border border-white/10 text-bridge-gray hover:text-white hover:border-bridge-primary/30 transition-all text-sm cursor-pointer max-w-[200px] xl:max-w-xs"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="truncate">Search...</span>
            <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={onSearchOpen}
            className="sm:hidden p-2 rounded-lg text-bridge-gray hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg text-bridge-gray hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-bridge-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] glass-strong rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 hover:bg-white/5 transition-colors',
                        !n.read && 'bg-bridge-primary/5'
                      )}
                    >
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-bridge-gray mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-bridge-gray/70 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onQuickAction}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-bridge-primary hover:bg-bridge-primary-light text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">Quick Action</span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pr-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bridge-primary to-bridge-secondary flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-bridge-gray hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl border border-white/10 py-1 shadow-xl">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-bridge-gray">super@bridge.app</p>
                </div>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-bridge-gray hover:text-white hover:bg-white/5 cursor-pointer">
                  Profile Settings
                </button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-bridge-gray hover:text-white hover:bg-white/5 cursor-pointer">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
