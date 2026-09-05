'use client';

import Link from 'next/link';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';
import { OrderButton, TalkToExpertButton } from './ProductCtaButtons';

/**
 * Compact product identity — breadcrumb, badge, H1, rating, short summary.
 * Features / trust / gallery live outside this hero (screens-first layout).
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
    <header className={cn('min-w-0', className)}>
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
        <p className="mt-3 max-w-xl text-sm leading-snug text-text-secondary line-clamp-2 sm:text-base">
          {description}
        </p>
      ) : null}

      {showCtas && onOrder && onTalk ? (
        <div className="mt-5 hidden gap-2 lg:mt-6 lg:flex lg:flex-row">
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
