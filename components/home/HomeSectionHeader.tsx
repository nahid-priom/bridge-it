import { cn } from '@/lib/cn';

type HomeSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
  headingId?: string;
};

export function HomeSectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  className,
  align = 'left',
  headingId,
}: HomeSectionHeaderProps) {
  const centered = align === 'center';

  return (
    <header className={cn(centered && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-bridge-primary mb-2">
          {eyebrow}
        </p>
      )}
      <h2
        id={headingId}
        className={cn(
          'text-2xl sm:text-3xl md:text-4xl font-black font-display text-text-primary leading-tight',
          centered && 'mx-auto'
        )}
      >
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span className="gradient-text">{titleHighlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-2 text-sm md:text-base text-text-secondary leading-relaxed max-w-xl',
            centered && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
