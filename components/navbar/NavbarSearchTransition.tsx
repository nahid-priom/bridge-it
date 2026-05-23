'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { NavbarSmartSearchBar } from '@/components/navbar/NavbarSmartSearchBar';
import { cn } from '@/lib/cn';

const ease = [0.22, 1, 0.36, 1] as const;

type NavbarSearchTransitionProps = {
  visible: boolean;
  compact?: boolean;
  scrolled?: boolean;
  onOpenCommandPalette?: () => void;
  className?: string;
};

export function NavbarSearchTransition({
  visible,
  compact = true,
  scrolled = true,
  onOpenCommandPalette,
  className,
}: NavbarSearchTransitionProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {visible && (
        <motion.div
          key="navbar-search-slot"
          layout
          initial={{ opacity: 0, y: -10, width: 0, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            width: '100%',
            scale: 1,
            transition: { duration: 0.34, ease },
          }}
          exit={{
            opacity: 0,
            y: -8,
            width: 0,
            scale: 0.98,
            transition: { duration: 0.28, ease },
          }}
          className={cn(
            'hidden md:flex flex-1 justify-center min-w-0 overflow-hidden',
            'max-w-[min(100%,400px)] lg:max-w-[min(100%,520px)]',
            className
          )}
        >
          <motion.div layout className="w-full rounded-full">
            <NavbarSmartSearchBar
              compact={compact}
              scrolled={scrolled}
              onOpenCommandPalette={onOpenCommandPalette}
              className="w-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
