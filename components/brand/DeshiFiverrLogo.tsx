import { cn } from '@/lib/cn';

type DeshiFiverrLogoProps = {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'nav' | 'nav-lg' | 'mobile';
};

export function DeshiFiverrLogo({
  className,
  showText = true,
  size = 'md',
}: DeshiFiverrLogoProps) {
  const iconSize =
    size === 'nav-lg'
      ? 'w-11 h-11'
      : size === 'nav'
        ? 'w-10 h-10'
        : size === 'mobile'
          ? 'w-9 h-9'
          : size === 'sm'
            ? 'w-8 h-8'
            : 'w-9 h-9';
  const textSize =
    size === 'nav-lg'
      ? 'text-xl'
      : size === 'nav'
        ? 'text-lg'
        : size === 'mobile'
          ? 'text-[15px]'
          : 'text-base';

  return (
    <div
      className={cn(
        'flex items-center min-w-0 group/logo',
        size === 'mobile' ? 'gap-2' : 'gap-3',
        className
      )}
    >
      <div
        className={cn(
          iconSize,
          'rounded-full bg-gradient-to-br from-deshi-green via-emerald-500 to-teal-500',
          'flex items-center justify-center shrink-0',
          'shadow-[0_4px_18px_rgba(16,185,129,0.45)]',
          'transition-transform duration-300 group-hover/logo:scale-105 group-hover/logo:shadow-[0_6px_24px_rgba(16,185,129,0.5)]'
        )}
        aria-hidden
      >
        <span
          className={cn(
            'text-white font-black leading-none font-display',
            size === 'mobile' ? 'text-base' : 'text-lg'
          )}
        >
          D
        </span>
      </div>
      {showText && (
        <span
          className={cn(
            'min-w-0 font-black font-display text-deshi-navy dark:text-white tracking-tight whitespace-nowrap leading-tight',
            textSize
          )}
        >
          Deshi <span className="text-deshi-green">Fiverr</span>
        </span>
      )}
    </div>
  );
}
