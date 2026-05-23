'use client';

import { useRef, useState } from 'react';
import {
  Bell,
  Globe,
  Heart,
  HelpCircle,
  MessageCircle,
  MoreHorizontal,
  ShoppingCart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/lib/routes';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';
import { useClickOutside, NavDropdownSection, NavDropdownItem } from '@/components/navbar/navShared';
import { cn } from '@/lib/cn';

type NavbarActionsDropdownProps = {
  cartCount: number;
  notificationCount?: number;
  messageCount?: number;
  onCartClick: () => void;
  onNavigate?: () => void;
  className?: string;
};

export function NavbarActionsDropdown({
  cartCount,
  notificationCount = 3,
  messageCount = 0,
  onCartClick,
  onNavigate,
  className,
}: NavbarActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const totalBadge = notificationCount + messageCount + cartCount;

  useClickOutside(ref, () => setOpen(false), open);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          totalBadge > 0 ? `Actions menu, ${totalBadge} updates` : 'Actions menu'
        }
        className={cn(
          'relative inline-flex items-center justify-center w-9 h-9 rounded-full',
          'border border-slate-200/80 dark:border-white/10',
          'bg-slate-50/80 dark:bg-white/5 text-slate-600 dark:text-slate-300',
          'hover:bg-slate-100 dark:hover:bg-white/10 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40',
          open && 'bg-slate-100 dark:bg-white/10 text-text-primary'
        )}
      >
        <MoreHorizontal className="w-[18px] h-[18px]" aria-hidden />
        {totalBadge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-deshi-green text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {totalBadge > 9 ? '9+' : totalBadge}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute right-0 top-[calc(100%+8px)] z-50 w-64',
              'rounded-2xl border border-slate-200/90 dark:border-white/10',
              'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
              'shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
              'p-2 overflow-hidden'
            )}
          >
            <NavDropdownSection title="Activity">
              <NavDropdownItem
                href={ROUTES.messages}
                onClick={close}
                icon={<MessageCircle className="w-4 h-4 text-sky-500" />}
                label="Messages"
                description="Chat with sellers"
                badge={messageCount}
              />
              <NavDropdownItem
                onClick={() => {
                  close();
                }}
                icon={<Bell className="w-4 h-4 text-violet-500" />}
                label="Notifications"
                description="Updates & alerts"
                badge={notificationCount}
              />
            </NavDropdownSection>

            <div className="h-px bg-slate-100 dark:bg-white/10 mx-2" />

            <NavDropdownSection title="Shopping">
              <NavDropdownItem
                href={ROUTES.products}
                onClick={close}
                icon={<Heart className="w-4 h-4 text-rose-500" />}
                label="Wishlist"
                description="Saved items"
              />
              <NavDropdownItem
                onClick={() => {
                  onCartClick();
                  close();
                }}
                icon={<ShoppingCart className="w-4 h-4 text-deshi-green" />}
                label="Cart"
                description={cartCount ? `${cartCount} item${cartCount !== 1 ? 's' : ''}` : 'Your cart'}
                badge={cartCount}
              />
            </NavDropdownSection>

            <div className="h-px bg-slate-100 dark:bg-white/10 mx-2" />

            <NavDropdownSection title="Preferences">
              <div className="px-3 py-2">
                <label htmlFor="nav-actions-lang" className="sr-only">
                  Language
                </label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-text-muted shrink-0" aria-hidden />
                  <select
                    id="nav-actions-lang"
                    defaultValue="en"
                    className="flex-1 bg-transparent text-sm font-medium text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
                    aria-label="Select language"
                  >
                    <option value="en">English</option>
                    <option value="bn" disabled>
                      বাংলা (soon)
                    </option>
                  </select>
                </div>
              </div>
              <NavDropdownItem
                href={NAV_HOW_IT_WORKS_HREF}
                onClick={close}
                icon={<HelpCircle className="w-4 h-4 text-slate-500" />}
                label="Help Center"
                description="Guides & support"
              />
            </NavDropdownSection>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
