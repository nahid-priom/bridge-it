import Link from 'next/link';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import {
  specializedSlugsForIndustry,
} from '../config/specialized-solutions';
import type { SoftwareProjectCard } from '../types';
import { SoftwareCard } from './SoftwareCard';

export function SpecializedSolutionsSection({
  industrySlug,
  products,
}: {
  industrySlug: string;
  products: SoftwareProjectCard[];
}) {
  if (industrySlug !== 'garments' && industrySlug !== 'feed-mill') return null;

  const specializedSet = new Set(specializedSlugsForIndustry(industrySlug));
  const specialized = products
    .filter((p) => specializedSet.has(p.slug))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (specialized.length === 0) return null;

  const title =
    industrySlug === 'garments' ? 'Specialized Garments Software' : 'Specialized Feed Mill Software';
  const intro =
    industrySlug === 'garments'
      ? 'Focused tools for merchandising, floor production, warehouse, HR and commercial export — separate from complete ERP packages.'
      : 'Focused systems for production, formula costing, dealer distribution, inventory and finance. Choose these when you need depth in one department.';
  const flagshipHref =
    industrySlug === 'garments' ? '/software/garments/garments-erp' : '/software/feed-mill/feed-mill-erp';
  const flagshipLabel =
    industrySlug === 'garments' ? 'Garments ERP Standard' : 'Complete Feed Mill ERP';

  return (
    <section className="mt-12" aria-labelledby="specialized-solutions">
      <h2 id="specialized-solutions" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary">{intro}</p>
      {industrySlug === 'feed-mill' ? (
        <p className="mt-1 max-w-2xl text-xs text-text-muted">
          Pick Complete ERP for the whole business. Pick specialized software for a focused module you can expand later.
        </p>
      ) : null}
      <ul className={`mt-5 ${CATALOG_LISTING_GRID_CLASS}`}>
        {specialized.map((project) => (
          <li key={project.id} className="min-w-0 list-none">
            <SoftwareCard project={project} variant="home" />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-text-muted">
        Need a complete package?{' '}
        <Link href={flagshipHref} className="font-semibold text-[#2563eb] hover:underline">
          Open {flagshipLabel}
        </Link>
        .
      </p>
    </section>
  );
}
