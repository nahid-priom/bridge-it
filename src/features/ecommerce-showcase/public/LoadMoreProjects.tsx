'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { InlineSpinner } from '@/src/components/loading/InlineSpinner';
import { GALLERY_PAGE_SIZE } from '../config/constants';
import type { EcommerceProjectCard, ShowcaseListFilters } from '../types';
import { showcaseQueryString } from '../utils/filters';
import { ProjectGrid } from './ProjectGrid';

async function fetchMore(filters: ShowcaseListFilters, offset: number) {
  const res = await fetch(
    `/api/showcase/projects${showcaseQueryString({ ...filters, offset, limit: GALLERY_PAGE_SIZE })}`
  );
  if (!res.ok) throw new Error('Failed to load more projects');
  return (await res.json()) as { items: EcommerceProjectCard[]; total: number };
}

export function LoadMoreProjects({
  initialCount,
  total,
  filters,
}: {
  initialCount: number;
  total: number;
  filters: ShowcaseListFilters;
}) {
  const queryClient = useQueryClient();
  const [extra, setExtra] = useState<EcommerceProjectCard[]>([]);
  const [loading, setLoading] = useState(false);
  const remaining = total - (initialCount + extra.length);

  if (remaining <= 0) return null;

  return (
    <div className="mt-8">
      {extra.length > 0 ? (
        <div className="mb-8">
          <ProjectGrid projects={extra} eagerCount={0} />
        </div>
      ) : null}
      <div className="text-center">
        <button
          type="button"
          disabled={loading}
          aria-busy={loading || undefined}
          className="inline-flex min-w-[10.5rem] items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold disabled:opacity-60 dark:border-white/15"
          onClick={async () => {
            setLoading(true);
            const offset = initialCount + extra.length;
            try {
              const data = await queryClient.fetchQuery({
                queryKey: ['showcase-listing', filters, offset],
                queryFn: () => fetchMore(filters, offset),
              });
              setExtra((current) => [...current, ...data.items]);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <InlineSpinner size={18} label="Loading more projects" /> : `Load more (${remaining})`}
        </button>
      </div>
    </div>
  );
}
