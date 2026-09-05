'use client';

import { cn } from '@/lib/cn';

export type PublicAtmosphereVariant = 'default' | 'consultation' | 'marketing';
export type PublicAtmosphereIntensity = 'subtle' | 'medium';

type PublicPageAtmosphereProps = {
  variant?: PublicAtmosphereVariant;
  intensity?: PublicAtmosphereIntensity;
  /** Fixed full-viewport layers for the public shell. Absolute when nested in a section. */
  mode?: 'fixed' | 'absolute';
  className?: string;
};

/**
 * Lightweight public-page atmosphere — center-focused teal/blue depth.
 * No left/right edge color noise. Theme-safe for light + dark.
 */
export function PublicPageAtmosphere({
  variant = 'default',
  intensity = 'subtle',
  mode = 'fixed',
  className,
}: PublicPageAtmosphereProps) {
  const strong = intensity === 'medium' || variant === 'consultation';

  return (
    <div
      className={cn(
        'public-atmosphere pointer-events-none overflow-hidden select-none',
        mode === 'fixed' ? 'fixed inset-0 z-0' : 'absolute inset-0',
        strong && 'public-atmosphere--medium',
        variant === 'consultation' && 'public-atmosphere--consultation',
        variant === 'marketing' && 'public-atmosphere--marketing',
        className
      )}
      aria-hidden
    >
      <div className="public-atmosphere__hero" />
      <div className="public-atmosphere__mid" />
      <div className="public-atmosphere__cta" />
      {variant === 'consultation' ? (
        <div className="public-atmosphere__ring" aria-hidden>
          <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
            <circle
              cx="200"
              cy="200"
              r="160"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5 12"
              className="text-[#60a5fa]/35 dark:text-[#60a5fa]/25"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
}
