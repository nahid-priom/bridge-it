'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HeroDecorations } from '@/components/home/HeroDecorations';
import { heroMotion, heroTypography, sectionSpacing } from '@/lib/styles/design-tokens';
import { cn } from '@/lib/cn';

export type PageHeroVariant = 'marketing' | 'dashboard' | 'compact' | 'search';

export type PageHeroProps = {
  id?: string;
  eyebrow?: ReactNode;
  /** First line — dark ink */
  title: string;
  /** Second line — green accent */
  highlightedText?: string;
  /** Third line — purple script accent */
  accentLine?: string;
  subtitle?: string;
  variant?: PageHeroVariant;
  alignment?: 'center' | 'left';
  showDecorations?: boolean;
  showUnderline?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  breadcrumbs?: ReactNode;
};

function HeroUnderline() {
  return (
    <svg
      className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-[min(100%,320px)] h-3 sm:h-4 text-[#6D35F5] dark:text-violet-400"
      viewBox="0 0 280 14"
      preserveAspectRatio="none"
      aria-hidden
    >
      <motion.path
        d="M6 10 C 70 2, 140 8, 210 4 S 270 6, 274 8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: heroMotion.ease }}
      />
    </svg>
  );
}

export function PageHero({
  id = 'page-hero-heading',
  eyebrow,
  title,
  highlightedText,
  accentLine,
  subtitle,
  variant = 'marketing',
  alignment = 'center',
  showDecorations = true,
  showUnderline = true,
  actions,
  children,
  className,
  breadcrumbs,
}: PageHeroProps) {
  const isCenter = alignment === 'center';
  const isSearch = variant === 'search';
  const isCompact = variant === 'compact';
  const isDashboard = variant === 'dashboard';
  const isInteriorHero = isDashboard || isCompact;
  const decorations = showDecorations && variant === 'marketing';

  return (
    <section
      className={cn(
        'relative w-full overflow-x-hidden',
        'marketplace-hero-bg',
        variant === 'marketing' && sectionSpacing.hero,
        variant === 'dashboard' && sectionSpacing.dashboardHero,
        variant === 'compact' && sectionSpacing.heroCompact,
        variant === 'search' && sectionSpacing.searchHero,
        className
      )}
      aria-labelledby={id}
    >
      {decorations && <HeroDecorations />}

      {(isInteriorHero || isSearch) && showDecorations && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-60"
          aria-hidden
        >
          <div className="absolute -left-20 top-0 w-48 h-48 rounded-full bg-teal-200/30 dark:bg-teal-500/10 blur-3xl" />
          <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-violet-100/40 dark:bg-violet-900/15 blur-2xl" />
        </div>
      )}

      <div
        className={cn(
          'relative z-[1] w-full',
          isSearch && 'container mx-auto px-4 sm:px-6 lg:px-8',
          isCenter && !isSearch && 'mx-auto max-w-[900px] text-center',
          isCenter && isSearch && 'text-center'
        )}
      >
        {breadcrumbs && (
          <div
            className={cn(
              isSearch ? 'mb-2' : 'mb-4',
              isCenter && 'flex justify-center'
            )}
          >
            {breadcrumbs}
          </div>
        )}

        {eyebrow && (
          <motion.div {...heroMotion.fadeDown} className={cn('mb-5 md:mb-6', isCenter && 'flex justify-center')}>
            {typeof eyebrow === 'string' ? (
              <span className={heroTypography.eyebrow}>{eyebrow}</span>
            ) : (
              eyebrow
            )}
          </motion.div>
        )}

        <motion.h1
          id={id}
          className={cn(
            !isSearch &&
              (isCompact
                ? heroTypography.compactHeading
                : isDashboard
                  ? heroTypography.dashboardHeading
                  : 'font-display font-black tracking-tight leading-[1.12]'),
            isSearch ? 'mb-3' : 'mb-4 md:mb-5',
            isCenter && 'text-center'
          )}
          {...heroMotion.fadeUp(0.08)}
        >
          {isSearch ? (
            <>
              <span className={cn('block', heroTypography.searchHeading, heroTypography.h1Ink)}>
                {title}
              </span>
              {highlightedText && (
                <span
                  className={cn(
                    'block',
                    heroTypography.searchHeading,
                    heroTypography.h1Accent,
                    'mt-0.5 break-words'
                  )}
                >
                  {highlightedText}
                </span>
              )}
              {accentLine && accentLine !== '.' && (
                <span className={cn('relative inline-block mt-1 max-w-full', isCenter && 'px-1')}>
                  <span
                    className={cn(
                      heroTypography.h1Script,
                      'text-xl sm:text-2xl md:text-[1.75rem]',
                      isCenter && 'inline-block'
                    )}
                  >
                    {accentLine}
                  </span>
                  {showUnderline && <HeroUnderline />}
                </span>
              )}
            </>
          ) : isInteriorHero ? (
            <>
              <span
                className={cn(
                  'block',
                  isCompact ? heroTypography.compactHeading : heroTypography.dashboardHeading,
                  heroTypography.h1Ink
                )}
              >
                {title}
              </span>
              {highlightedText && (
                <span
                  className={cn(
                    'block',
                    isCompact ? heroTypography.compactHeading : heroTypography.dashboardHeading,
                    heroTypography.h1Accent,
                    'mt-0.5'
                  )}
                >
                  {highlightedText}
                </span>
              )}
              {accentLine && accentLine !== '.' && (
                <span className={cn('relative inline-block mt-1 max-w-full', isCenter && 'px-2')}>
                  <span className={cn(heroTypography.h1Script, 'text-2xl md:text-3xl', isCenter && 'inline-block')}>
                    {accentLine}
                  </span>
                  {showUnderline && <HeroUnderline />}
                </span>
              )}
            </>
          ) : (
            <>
              <span className={cn(heroTypography.h1Line, heroTypography.h1Ink)}>{title}</span>
              {highlightedText && (
                <span className={cn(heroTypography.h1Line, heroTypography.h1Accent, 'mt-0.5 md:mt-1')}>
                  {highlightedText}
                </span>
              )}
              {accentLine && (
                <span className="relative inline-block mt-2 md:mt-3 max-w-full">
                  <span className={cn(heroTypography.h1Script, 'px-2')}>{accentLine}</span>
                  {showUnderline && <HeroUnderline />}
                </span>
              )}
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            className={cn(
              heroTypography.subtitle,
              isSearch && 'text-sm sm:text-base mb-4 max-w-xl',
              isCompact && 'text-sm sm:text-base mb-4 md:mb-5',
              !isSearch && !isCompact && 'mb-6 md:mb-8',
              !isCenter && 'mx-0 max-w-2xl',
              'px-1'
            )}
            {...heroMotion.fadeUp(0.18)}
          >
            {subtitle}
          </motion.p>
        )}

        {actions && (
          <motion.div {...heroMotion.fadeUp(0.28)} className={cn(isCenter && 'flex flex-col items-center')}>
            {actions}
          </motion.div>
        )}

        {children}
      </div>
    </section>
  );
}
