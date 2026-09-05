'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';
import { OrderButton, TalkToExpertButton } from './ProductCtaButtons';

function HeroDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = text.length > 140 || text.split(/\s+/).length > 28;

  return (
    <div className="min-w-0">
      {/* Desktop: full SEO copy — fills the left column */}
      <p className="hidden text-[0.9375rem] leading-relaxed text-text-secondary lg:block lg:text-base lg:leading-[1.65]">
        {text}
      </p>

      {/* Mobile: truncated with View more */}
      <div className="lg:hidden">
        <p
          className={cn(
            'text-sm leading-relaxed text-text-secondary',
            !expanded && needsToggle && 'line-clamp-3'
          )}
        >
          {text}
        </p>
        {needsToggle ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 text-sm font-semibold text-bridge-primary hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? 'View less' : 'View more'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Product identity — breadcrumb, badge, H1, rating, SEO description, CTAs.
 * Desktop stretches with the gallery so the left column is not empty.
 */
export function SoftwareDetailsHero({
  categoryLabel,
  title,
  ratingAvg,
  reviewCount,
  description,
  industrySlug,
  onOrder,
  onTalk,
  ctaDisabled,
  /** Desktop-only hero CTAs — mobile uses StickyProductCTA. */
  showCtas = false,
  className,
}: {
  categoryLabel: string;
  title: string;
  ratingAvg?: number | null;
  reviewCount?: number | null;
  description: string | null;
  industrySlug?: string | null;
  onOrder?: () => void;
  onTalk?: () => void;
  ctaDisabled?: boolean;
  showCtas?: boolean;
  className?: string;
}) {
  const breadcrumbSoftwareHref = industrySlug
    ? ROUTES.softwareIndustry(industrySlug)
    : ROUTES.softwareShowroom;
  const hasRating = ratingAvg != null && ratingAvg > 0;

  return (
    <header className={cn('flex min-h-0 min-w-0 flex-col lg:h-full', className)}>
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-text-muted sm:mb-4 sm:text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href={ROUTES.home} className="hover:text-text-primary hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={ROUTES.explore} className="hover:text-text-primary hover:underline">
              Portfolio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={breadcrumbSoftwareHref} className="hover:text-text-primary hover:underline">
              Software
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="truncate font-medium text-text-secondary">{title}</li>
        </ol>
      </nav>

      <span className="inline-flex rounded-full bg-bridge-primary/10 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-bridge-primary">
        {categoryLabel}
      </span>

      <h1 className="mt-2 font-display text-[1.875rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-text-primary sm:text-3xl lg:text-[2.125rem]">
        {title}
      </h1>

      {hasRating ? (
        <StarRating
          rating={ratingAvg!}
          reviewCount={reviewCount}
          size="md"
          compact
          className="mt-2"
        />
      ) : null}

      {description ? (
        <div className="mt-3 min-w-0 flex-1 lg:mt-4">
          <HeroDescription text={description} />
        </div>
      ) : (
        <div className="hidden flex-1 lg:block" aria-hidden />
      )}

      {showCtas && onOrder && onTalk ? (
        <div className="mt-5 hidden gap-2 lg:mt-auto lg:flex lg:flex-row lg:gap-3 lg:pt-8">
          <OrderButton onClick={onOrder} disabled={ctaDisabled} fullWidth={false} className="min-w-[10rem]" />
          <TalkToExpertButton
            onClick={onTalk}
            disabled={ctaDisabled}
            fullWidth={false}
            className="min-w-[10rem]"
          />
        </div>
      ) : null}
    </header>
  );
}
