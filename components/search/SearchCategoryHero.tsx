'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { MAIN_CATEGORY_BY_SLUG } from '@/constants/mainMarketplaceCategories';
import {
  getSearchCategoryDescription,
  getSearchCategoryTitle,
  getSearchPlaceholder,
  getSearchSubcategoryChips,
  matchActiveChip,
} from '@/lib/search/searchCategoryContent';
import { ROUTES } from '@/lib/routes';
import { SearchBreadcrumb, buildSearchBreadcrumbItems } from '@/components/search/SearchBreadcrumb';
import { SearchCategoryChips } from '@/components/search/SearchCategoryChips';
import { CompactMarketplaceSearch } from '@/components/search/CompactMarketplaceSearch';
import { cn } from '@/lib/cn';

type SearchCategoryHeroProps = {
  queryLabel: string;
  searchValue: string;
  category: string;
  highlightQuery?: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onChipSelect: (query: string) => void;
};

export function SearchCategoryHero({
  queryLabel,
  searchValue,
  category,
  highlightQuery = '',
  onSearchChange,
  onCategoryChange,
  onSubmit,
  onClear,
  onChipSelect,
}: SearchCategoryHeroProps) {
  const categoryName =
    category !== 'all' ? (MAIN_CATEGORY_BY_SLUG[category]?.name ?? null) : null;

  const title = useMemo(
    () => getSearchCategoryTitle(category, highlightQuery || searchValue),
    [category, highlightQuery, searchValue]
  );

  const description = useMemo(() => getSearchCategoryDescription(category), [category]);
  const placeholder = useMemo(() => getSearchPlaceholder(category), [category]);
  const chips = useMemo(() => getSearchSubcategoryChips(category), [category]);
  const activeChipId = useMemo(
    () => matchActiveChip(chips, highlightQuery || searchValue),
    [chips, highlightQuery, searchValue]
  );

  const breadcrumbItems = buildSearchBreadcrumbItems(
    category,
    categoryName,
    queryLabel
  );

  return (
    <section
      className="relative w-full border-b border-slate-200/80 dark:border-white/10 bg-background overflow-hidden"
      aria-labelledby="search-category-heading"
    >
      {/* Subtle background — no landing-page decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -left-32 top-0 w-64 h-64 rounded-full bg-teal-200/25 dark:bg-teal-500/8 blur-3xl" />
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-violet-100/30 dark:bg-violet-900/10 blur-2xl" />
        <svg
          className="absolute right-[8%] top-6 w-16 h-16 text-violet-400/20 dark:text-violet-500/15"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <pattern id="search-hero-dots" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#search-hero-dots)" />
        </svg>
      </div>

      <div
        className={cn(
          'relative z-[1] mx-auto w-full max-w-[1600px]',
          'px-4 sm:px-6 lg:px-8',
          'pt-[calc(var(--header-offset)+1.5rem)] pb-6 md:pb-8'
        )}
      >
        <SearchBreadcrumb items={breadcrumbItems} className="mb-3" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="min-w-0 flex-1"
          >
            <h1
              id="search-category-heading"
              className="font-display font-bold tracking-tight text-text-primary text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-[1.15] max-w-4xl"
            >
              {title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-text-muted leading-relaxed max-w-[900px]">
              {description}
            </p>
          </motion.div>

          <Link
            href={`${ROUTES.home}#how-it-works`}
            className="inline-flex items-center gap-1.5 shrink-0 text-sm font-semibold text-deshi-green hover:underline mt-1 lg:mt-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden />
            How Deshi Fiverr Works
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="mb-5"
        >
          <SearchCategoryChips
            chips={chips}
            activeId={activeChipId}
            onSelect={(chip) => onChipSelect(chip.query)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <CompactMarketplaceSearch
            searchValue={searchValue}
            category={category}
            placeholder={placeholder}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onSubmit={onSubmit}
            onClear={onClear}
          />
        </motion.div>
      </div>
    </section>
  );
}
