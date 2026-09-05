'use client';

import Link from 'next/link';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';
import type { SoftwareProductFeature } from '../types';
import { ImportantFeatureGrid } from './ImportantFeatureGrid';
import { TrustPoints } from './TrustPoints';
import { OrderButton, TalkToExpertButton } from './ProductCtaButtons';

export function SoftwareDetailsHero({
  categoryLabel,
  title,
  ratingAvg,
  reviewCount,
  description,
  features,
  industrySlug,
  onOrder,
  onTalk,
  ctaDisabled,
  className,
}: {
  categoryLabel: string;
  title: string;
  ratingAvg: number;
  reviewCount: number;
  description: string | null;
  features: SoftwareProductFeature[];
  industrySlug?: string | null;
  onOrder: () => void;
  onTalk: () => void;
  ctaDisabled?: boolean;
  className?: string;
}) {
  const breadcrumbSoftwareHref = industrySlug
    ? ROUTES.softwareIndustry(industrySlug)
    : ROUTES.softwareShowroom;

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

      <StarRating rating={ratingAvg} reviewCount={reviewCount} size="md" className="mt-2" />

      {description ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary line-clamp-4 sm:text-base sm:line-clamp-none">
          {description}
        </p>
      ) : null}

      <ImportantFeatureGrid features={features} className="mt-4 sm:mt-5" />

      <TrustPoints className="mt-4" />

      <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row">
        <OrderButton onClick={onOrder} disabled={ctaDisabled} />
        <TalkToExpertButton onClick={onTalk} disabled={ctaDisabled} />
      </div>
    </header>
  );
}
