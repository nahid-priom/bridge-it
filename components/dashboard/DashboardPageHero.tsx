'use client';

import { PageHero } from '@/components/ui/PageHero';
import type { PageHeroProps } from '@/components/ui/PageHero';

type DashboardPageHeroProps = Omit<PageHeroProps, 'variant' | 'showDecorations'> & {
  compact?: boolean;
};

export function DashboardPageHero({
  compact = false,
  showDecorations = true,
  alignment = 'left',
  ...props
}: DashboardPageHeroProps & { showDecorations?: boolean }) {
  return (
    <PageHero
      variant={compact ? 'compact' : 'dashboard'}
      alignment={alignment}
      showDecorations={showDecorations}
      showUnderline={Boolean(props.accentLine)}
      className="!pt-0 !pb-4 md:!pb-6"
      {...props}
    />
  );
}
