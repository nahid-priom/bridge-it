import { cn } from '@/lib/cn';

interface BridgeLogoProps {
  showText?: boolean;
  /** When to show Bridge + Smart IT Park labels (`always` = including mobile) */
  textVisibility?: 'always' | 'sm';
  className?: string;
  iconSize?: 'sm' | 'md';
}

export function BridgeLogo({
  showText = true,
  textVisibility = 'sm',
  className,
  iconSize = 'md',
}: BridgeLogoProps) {
  const iconBox =
    iconSize === 'sm'
      ? 'w-9 h-9'
      : 'w-9 h-9 md:w-10 md:h-10';
  const letterSize = iconSize === 'sm' ? 'text-lg' : 'text-lg md:text-xl';

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      <div className={cn('relative shrink-0', iconBox)}>
        <div className="absolute inset-0 bg-gradient-to-br from-bridge-primary to-bridge-secondary rounded-xl rotate-6 transition-transform duration-300 group-hover:rotate-12" />
        <div className="absolute inset-0 bg-white dark:bg-background rounded-xl flex items-center justify-center border border-border-subtle">
          <span className={cn('font-black gradient-text font-display', letterSize)}>B</span>
        </div>
      </div>
      {showText && (
        <div
          className={cn(
            'text-left min-w-0',
            textVisibility === 'always' ? 'block' : 'hidden sm:block'
          )}
        >
          <span className="text-sm sm:text-base md:text-lg font-black font-display gradient-text leading-none block">
            Bridge
          </span>
          <span className="text-[8px] sm:text-[9px] md:text-[10px] text-text-muted tracking-[0.18em] sm:tracking-[0.2em] uppercase block whitespace-nowrap">
            Smart IT Park
          </span>
        </div>
      )}
    </div>
  );
}
