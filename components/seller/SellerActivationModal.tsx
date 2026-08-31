'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Store, Wallet, LayoutDashboard, X } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useSellerActivationStore } from '@/store/sellerActivationStore';
import { cn } from '@/lib/cn';
import { BRANDING } from '@/lib/config/branding';

const perks = [
  { icon: Store, label: 'Seller account approved' },
  { icon: Sparkles, label: 'Marketplace listings unlocked' },
  { icon: Wallet, label: 'Earnings & wallet enabled' },
  { icon: LayoutDashboard, label: 'Seller dashboard access enabled' },
];

export function SellerActivationModal() {
  const router = useRouter();
  const isOpen = useSellerActivationStore((s) => s.isModalOpen);
  const close = useSellerActivationStore((s) => s.closeActivationModal);
  const clearCelebration = useSellerActivationStore((s) => s.clearCelebration);

  const go = (href: string) => {
    close();
    clearCelebration();
    router.push(href);
    router.refresh();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-activation-title"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative w-full max-w-lg rounded-3xl border border-emerald-500/30',
              'bg-gradient-to-b from-white to-emerald-50/80 dark:from-slate-900 dark:to-emerald-950/40',
              'shadow-[0_32px_80px_rgba(16,185,129,0.25)] p-8 overflow-hidden'
            )}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>

            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">
              Congratulations
            </p>
            <h2
              id="seller-activation-title"
              className="text-center text-2xl sm:text-3xl font-black font-display text-text-primary"
            >
              Welcome to {BRANDING.appName} Partner Hub
            </h2>
            <p className="text-center text-sm text-text-secondary mt-3 max-w-md mx-auto">
              Your seller account is now active. You can list services, sell products, and
              manage orders from your seller dashboard.
            </p>

            <ul className="mt-6 space-y-2.5">
              {perks.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-white/70 dark:bg-white/5 border border-emerald-500/15 px-4 py-2.5"
                >
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => go(ROUTES.sellerDashboard)}
                className="flex-1 py-3 rounded-xl bg-deshi-green text-white font-bold text-sm shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:bg-deshi-green-dark transition-colors"
              >
                Go to Seller Dashboard
              </button>
              <button
                type="button"
                onClick={() => go(ROUTES.sellerDashboardServices)}
                className="flex-1 py-3 rounded-xl border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
              >
                Create First Service
              </button>
            </div>

            <p className="text-center text-xs text-text-muted mt-4">
              You can still shop as a buyer from{' '}
              <Link href={ROUTES.dashboard} className="text-deshi-green font-semibold hover:underline">
                your buyer dashboard
              </Link>
              .
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
