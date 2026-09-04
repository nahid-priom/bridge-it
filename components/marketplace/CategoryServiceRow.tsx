'use client';

import { useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import type { MarketplaceHomeRowConfig, MarketplaceService } from '@/types/marketplace';
import { MarketplaceServiceCard } from '@/components/marketplace/MarketplaceServiceCard';
import { cn } from '@/lib/cn';

type CategoryServiceRowProps = {
  config: MarketplaceHomeRowConfig;
  services: MarketplaceService[];
};

export function CategoryServiceRow({ config, services }: CategoryServiceRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-card]') as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 272) + 16), behavior: 'smooth' });
  }, []);

  const sectionId = useMemo(
    () => `marketplace-row-${config.rowGroup.replace(/_/g, '-')}`,
    [config.rowGroup]
  );

  if (services.length === 0) return null;

  const isHighlight = Boolean(config.highlight);

  const inner = (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
        <div className="max-w-2xl">
          {config.containerBadge && (
            <span className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-deshi-green/15 text-deshi-green border border-deshi-green/25">
              <Sparkles className="w-3 h-3" aria-hidden />
              {config.containerBadge}
            </span>
          )}
          {config.sectionBadge && (
            <p className="text-xs font-semibold text-deshi-purple dark:text-blue-300 mb-1">
              {config.sectionBadge}
            </p>
          )}
          <h2
            id={sectionId}
            className={cn(
              'font-black font-display text-text-primary',
              isHighlight ? 'text-2xl md:text-[2rem] leading-tight' : 'text-xl md:text-2xl'
            )}
          >
            {config.title}
          </h2>
          <p className="text-sm text-text-secondary mt-1">{config.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="hidden md:flex w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-surface items-center justify-center hover:border-deshi-green/40 transition-colors"
            aria-label={`Previous ${config.title} services`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="hidden md:flex w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-surface items-center justify-center hover:border-deshi-green/40 transition-colors"
            aria-label={`Next ${config.title} services`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            href={config.viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-deshi-green hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-none -mx-1 px-1"
        role="list"
      >
        {services.map((service) => (
          <div
            key={service.id}
            data-carousel-card
            role="listitem"
            className="snap-start shrink-0 w-[min(100%,260px)] sm:w-[272px]"
          >
            <MarketplaceServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isHighlight) {
    return (
      <section
        className="py-4 md:py-8"
        aria-labelledby={sectionId}
      >
        <div className="mx-4 sm:mx-6 lg:mx-8 rounded-3xl border border-deshi-green/15 dark:border-deshi-green/20 bg-gradient-to-br from-deshi-mint/40 via-white to-blue-50/80 dark:from-emerald-950/30 dark:via-[#0c101c] dark:to-blue-950/25 shadow-sm py-6 md:py-12">
          {inner}
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-12 bg-deshi-mint/20 dark:bg-deshi-navy/15" aria-labelledby={sectionId}>
      {inner}
    </section>
  );
}
