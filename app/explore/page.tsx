import { redirect } from 'next/navigation';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { parseExploreType } from '@/components/explore/explore-types';
import {
  ExploreAllWork,
  type ExploreWorkItem,
} from '@/components/explore/ExploreAllWork';
import { ROUTES } from '@/lib/routes';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { listSoftwareProjectCards } from '@/src/features/software-showcase/api/projects';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Portfolio',
  description:
    'Explore Bridge IT Park work across websites, software, and creative marketing — a mixed showcase of live projects for Bangladesh businesses.',
  path: ROUTES.explore,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

/** Daily-stable shuffle so the mix feels random without layout flicker on refresh. */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function daySeed(): number {
  const now = new Date();
  return now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
}

async function loadMixedPortfolio(): Promise<ExploreWorkItem[]> {
  const [websites, software, marketing] = await Promise.all([
    listProjectCards({ limit: 16 }),
    listSoftwareProjectCards({ pageSize: 16, page: 1 }),
    listCreativeMarketingCards({ pageSize: 16, page: 1 }),
  ]);

  const mixed: ExploreWorkItem[] = [
    ...websites.items.map((project) => ({
      kind: 'website' as const,
      id: `website-${project.id}`,
      project,
    })),
    ...software.items.map((project) => ({
      kind: 'software' as const,
      id: `software-${project.id}`,
      project,
    })),
    ...marketing.items.map((project) => ({
      kind: 'marketing' as const,
      id: `marketing-${project.id}`,
      project,
    })),
  ];

  return seededShuffle(mixed, daySeed());
}

/**
 * Portfolio hub at /explore — mixed catalog when no type.
 * Search still uses ?type= to land on a dedicated showroom.
 */
export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const typeRaw = first(sp.type).trim();

  if (typeRaw) {
    const type = parseExploreType(typeRaw);
    const target =
      type === 'software' ? '/software' : type === 'marketing' ? '/marketing' : '/websites';

    const params = new URLSearchParams();
    for (const key of ['q', 'view', 'category', 'group', 'more', 'child', 'page', 'price'] as const) {
      const value = first(sp[key]).trim();
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    redirect(qs ? `${target}?${qs}` : target);
  }

  const items = await loadMixedPortfolio();

  return (
    <div className="relative min-w-0 overflow-x-hidden pb-16">
      <PageBreadcrumbJsonLd path={ROUTES.explore} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.10),_transparent_55%),linear-gradient(180deg,rgba(15,39,68,0.04),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(96,165,250,0.12),_transparent_55%),linear-gradient(180deg,rgba(15,39,68,0.35),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400 sm:text-xs">
            Portfolio
          </p>
          <h1
            className="mt-3 font-display font-bold tracking-[-0.03em] text-[#0f2744] dark:text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.08 }}
          >
            Explore our work
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:mt-4 sm:text-base">
            Websites, industry software, and creative marketing — mixed from live showrooms so you can
            browse the full range in one place.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.consultation}
              className="inline-flex items-center justify-center rounded-xl bg-[#0f2744] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-[#0f2744]"
            >
              Free consultation
            </Link>
            <Link
              href={ROUTES.websites}
              className="inline-flex items-center justify-center rounded-xl border border-border-subtle bg-surface/80 px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-[#2563eb]/40"
            >
              Browse catalogs
            </Link>
          </div>
        </header>

        <div className="mt-10 md:mt-14">
          <ExploreAllWork items={items} />
        </div>
      </div>
    </div>
  );
}
