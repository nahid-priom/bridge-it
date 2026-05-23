import { cn } from '@/lib/cn';

interface BridgeLogoProps {
  showText?: boolean;
  /** When to show Bridge + Smart IT Park labels (`always` = including mobile) */
  textVisibility?: 'always' | 'sm' | 'never';
  className?: string;
  iconSize?: 'sm' | 'md' | 'nav';
}

export function BridgeLogo({
  showText = true,
  textVisibility = 'sm',
  className,
  iconSize = 'md',
}: BridgeLogoProps) {
  const iconBox =
    iconSize === 'nav'
      ? 'w-12 h-12'
      : iconSize === 'sm'
        ? 'w-9 h-9'
        : 'w-9 h-9 md:w-10 md:h-10';
  const iconRadius = iconSize === 'nav' ? 'rounded-2xl' : 'rounded-xl';
  const letterSize =
    iconSize === 'nav' ? 'text-xl' : iconSize === 'sm' ? 'text-lg' : 'text-lg md:text-xl';

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      <div className={cn('relative shrink-0', iconBox)}>
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-bridge-primary to-bridge-secondary rotate-6 transition-transform duration-300 group-hover:rotate-12',
            iconRadius
          )}
        />
        <div
          className={cn(
            'absolute inset-0 bg-white dark:bg-background flex items-center justify-center border border-border-subtle',
            iconRadius
          )}
        >
          <span className={cn('font-black gradient-text font-display', letterSize)}>B</span>
        </div>
      </div>
      {showText && (
        <div
          className={cn(
            'text-left min-w-0',
            textVisibility === 'always'
              ? 'block'
              : textVisibility === 'never'
                ? 'hidden'
                : 'hidden sm:block'
          )}
        >
          <span className="text-sm sm:text-base md:text-lg font-black font-display gradient-text dark:text-white dark:[background-image:none] dark:[-webkit-text-fill-color:currentColor] leading-none block">
            Bridge
          </span>
          <span className="text-[9px] md:text-[10px] text-slate-500 dark:text-white/70 tracking-[0.22em] uppercase block whitespace-nowrap font-semibold">
            Smart IT Park
          </span>
        </div>
      )}
    </div>
  );
}
