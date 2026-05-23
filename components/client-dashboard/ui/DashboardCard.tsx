'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export function DashboardCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-white/10',
        'bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl',
        'shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.25)]',
        hover && 'transition-shadow hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
