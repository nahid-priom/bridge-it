'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useTypewriter } from '@/hooks/useTypewriter';
import {
  HERO_SEARCH_PLACEHOLDER,
  HERO_SEARCH_TYPE_PREFIX,
  HERO_SEARCH_TYPEWRITER_PHRASES,
} from '@/data/homeContent';
import { cn } from '@/lib/cn';

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HeroSearchInput() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const [focused, setFocused] = useState(false);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const typed = useTypewriter(HERO_SEARCH_TYPEWRITER_PHRASES, {
    enabled: !reducedMotion && !focused && searchQuery.length === 0,
  });

  const showTypewriter = !focused && searchQuery.length === 0;
  const staticPhrase = reducedMotion ? HERO_SEARCH_TYPEWRITER_PHRASES[0] : typed;

  return (
    <div className="relative flex w-full min-w-0 h-14 sm:h-[52px] items-center">
      <label htmlFor="hero-search" className="sr-only">
        {HERO_SEARCH_PLACEHOLDER}
      </label>

      <AnimatePresence>
        {showTypewriter && (
          <motion.div
            key="typewriter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center px-12 sm:px-16 pointer-events-none select-none overflow-hidden text-center"
            aria-hidden
          >
            <span className="text-sm sm:text-lg truncate">
              <span className="text-slate-400 dark:text-slate-500 font-normal">
                {HERO_SEARCH_TYPE_PREFIX}
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {staticPhrase}
              </span>
              {!reducedMotion && (
                <span
                  className={cn(
                    'inline-block w-[2px] h-[1.05em] align-[-0.12em] ml-0.5 rounded-full',
                    'bg-deshi-green shadow-[0_0_8px_rgba(16,185,129,0.55)]',
                    'animate-[hero-cursor_1s_ease-in-out_infinite]'
                  )}
                />
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        id="hero-search"
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={showTypewriter ? '' : HERO_SEARCH_PLACEHOLDER}
        className={cn(
          'hero-search-field relative z-[1] w-full min-w-0 px-12 sm:px-16 py-0 m-0',
          'bg-transparent border-0 text-center',
          'text-[#080B16] dark:text-text-primary text-sm sm:text-lg leading-normal',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none'
        )}
        autoComplete="off"
      />
    </div>
  );
}
