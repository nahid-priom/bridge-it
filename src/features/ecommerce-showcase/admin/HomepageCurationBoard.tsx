'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  removeHomepagePlacementAction,
  reorderHomepagePlacementAction,
  setHomepagePlacementAction,
} from '@/app/actions/ecommerce-showcase';
import { HOMEPAGE_SECTION_MAX, HOMEPAGE_SECTIONS } from '../config/constants';
import type { HomepagePlacementRow } from '../api/admin';
import type { HomepageSectionKey } from '../types';
import { cmsInput, cmsSection } from './ui';

type ProjectOption = {
  id: string;
  title: string;
  slug: string;
  industry: string | null;
  cover_image_url: string | null;
  cover_fallback_url: string | null;
};

export function HomepageCurationBoard({
  placements,
  projects,
  canEdit,
}: {
  placements: HomepagePlacementRow[];
  projects: ProjectOption[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [queries, setQueries] = useState<Record<HomepageSectionKey, string>>({
    popular: '',
    fashion_lifestyle: '',
    electronics_gadgets: '',
    food_home_specialty: '',
  });

  const grouped = useMemo(() => {
    const next: Record<HomepageSectionKey, HomepagePlacementRow[]> = {
      popular: [],
      fashion_lifestyle: [],
      electronics_gadgets: [],
      food_home_specialty: [],
    };
    for (const item of placements) {
      next[item.section_key]?.push(item);
    }
    for (const key of Object.keys(next) as HomepageSectionKey[]) {
      next[key].sort((a, b) => a.sort_order - b.sort_order);
    }
    return next;
  }, [placements]);

  const run = (fn: () => Promise<{ error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.error) setError(result.error);
      else router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">Homepage Curation</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose up to {HOMEPAGE_SECTION_MAX} published templates per section. The same template may appear in more than
          one section.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {HOMEPAGE_SECTIONS.map((section) => {
          const items = grouped[section.key] ?? [];
          const used = new Set(items.map((item) => item.project_id));
          const q = queries[section.key].trim().toLowerCase();
          const options = projects.filter((project) => {
            if (used.has(project.id)) return false;
            if (!q) return true;
            return (
              project.title.toLowerCase().includes(q) ||
              project.slug.toLowerCase().includes(q) ||
              (project.industry ?? '').toLowerCase().includes(q)
            );
          });
          const full = items.length >= HOMEPAGE_SECTION_MAX;

          return (
            <section key={section.key} className={cmsSection}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold">{section.title}</h2>
                  <p className="text-xs text-text-muted">
                    {items.length}/{HOMEPAGE_SECTION_MAX} active
                  </p>
                </div>
              </div>

              <ol className="space-y-2">
                {items.map((item, index) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-xl border border-border-subtle p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image_url || item.cover_fallback_url || ''}
                      alt=""
                      className="h-12 w-[4.8rem] rounded-lg object-cover bg-background-soft"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.title}</p>
                      <p className="truncate text-xs text-text-muted">{item.industry ?? item.slug}</p>
                    </div>
                    {canEdit ? (
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={pending || index === 0}
                          className="rounded-lg border border-border-subtle p-1.5 disabled:opacity-40"
                          aria-label={`Move ${item.title} up`}
                          onClick={() => run(() => reorderHomepagePlacementAction(item.id, 'up'))}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={pending || index === items.length - 1}
                          className="rounded-lg border border-border-subtle p-1.5 disabled:opacity-40"
                          aria-label={`Move ${item.title} down`}
                          onClick={() => run(() => reorderHomepagePlacementAction(item.id, 'down'))}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          className="rounded-lg border border-border-subtle p-1.5 text-red-600"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => run(() => removeHomepagePlacementAction(section.key, item.project_id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>

              {canEdit ? (
                <div className="space-y-2">
                  <input
                    value={queries[section.key]}
                    onChange={(event) =>
                      setQueries((current) => ({ ...current, [section.key]: event.target.value }))
                    }
                    placeholder="Search published templates..."
                    className={cmsInput}
                    disabled={full}
                  />
                  {!full && options.slice(0, 6).map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      disabled={pending}
                      className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border-subtle px-3 py-2 text-left text-sm hover:border-[#2563eb]/40"
                      onClick={() => run(() => setHomepagePlacementAction(section.key, project.id))}
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      <span className="truncate">{project.title}</span>
                    </button>
                  ))}
                  {full ? (
                    <p className="text-xs text-text-muted">Remove a template to add another.</p>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
