'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn, focusVisibleRing } from '@/lib/cn';
import { categoryPath, industryPath } from '../../utils/paths';
import { SOFTWARE_HUB_PRIORITY_SLUGS } from '../../config/software-industries-45';
import type { CatalogCategoryRoot } from '../../types';
import { industryLinkTitle, type CatalogSidebarIndustry } from './types';

export function IndustryFilter({
  root,
  industries,
  activeIndustrySlug,
  onNavigate,
}: {
  root: CatalogCategoryRoot;
  industries: CatalogSidebarIndustry[];
  activeIndustrySlug?: string | null;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { preview, rest, needsExpand } = useMemo(() => {
    if (root !== 'software' || industries.length <= 12) {
      return { preview: industries, rest: [] as CatalogSidebarIndustry[], needsExpand: false };
    }
    const priority = SOFTWARE_HUB_PRIORITY_SLUGS.map((slug) =>
      industries.find((i) => i.slug === slug)
    ).filter(Boolean) as CatalogSidebarIndustry[];
    const previewList = [...priority];
    const active = activeIndustrySlug
      ? industries.find((i) => i.slug === activeIndustrySlug)
      : undefined;
    if (active && !previewList.some((p) => p.slug === active.slug)) {
      previewList.push(active);
    }
    const restList = industries.filter((i) => !previewList.some((p) => p.slug === i.slug));
    return {
      preview: previewList,
      rest: restList,
      needsExpand: restList.length > 0,
    };
  }, [root, industries, activeIndustrySlug]);

  const [expanded, setExpanded] = useState(() =>
    Boolean(
      activeIndustrySlug &&
        rest.some((i) => i.slug === activeIndustrySlug) &&
        !preview.some((i) => i.slug === activeIndustrySlug)
    )
  );

  const visible = expanded || !needsExpand ? [...preview, ...rest] : preview;

  if (industries.length === 0) return null;

  return (
    <ul className="space-y-0.5">
      <li>
        <Link
          href={categoryPath(root)}
          title="View all"
          onClick={onNavigate}
          onMouseEnter={() => router.prefetch(categoryPath(root))}
          onFocus={() => router.prefetch(categoryPath(root))}
          className={cn(
            focusVisibleRing,
            'block rounded-lg px-2.5 py-1.5 text-sm transition-colors',
            !activeIndustrySlug
              ? 'border-l-2 border-[#2563eb] bg-[#2563eb]/10 pl-2 font-semibold text-[#0f2744] dark:text-white'
              : 'text-text-secondary hover:bg-surface hover:text-text-primary'
          )}
          aria-current={!activeIndustrySlug ? 'page' : undefined}
        >
          {root === 'software'
            ? 'All Software'
            : root === 'websites'
              ? 'All Templates'
              : 'All Services'}
        </Link>
      </li>
      {visible.map((industry) => {
        const active = industry.slug === activeIndustrySlug;
        const href = industryPath(root, industry.slug);
        return (
          <li key={industry.slug}>
            <Link
              href={href}
              title={industryLinkTitle(root, industry.name)}
              onClick={onNavigate}
              onMouseEnter={() => router.prefetch(href)}
              onFocus={() => router.prefetch(href)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                focusVisibleRing,
                'block rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                active
                  ? 'border-l-2 border-[#2563eb] bg-[#2563eb]/10 pl-2 font-semibold text-[#0f2744] dark:text-white'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
            >
              {industry.name}
            </Link>
          </li>
        );
      })}
      {needsExpand && !expanded ? (
        <li>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={cn(
              focusVisibleRing,
              'mt-1 w-full rounded-lg px-2.5 py-1.5 text-left text-sm font-medium text-[#2563eb] hover:bg-[#2563eb]/8'
            )}
          >
            Show more industries
          </button>
        </li>
      ) : null}
    </ul>
  );
}
