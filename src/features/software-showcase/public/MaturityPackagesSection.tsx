import type { SoftwareProjectCard } from '../types';
import { SoftwareCard } from './SoftwareCard';
import { isMaturitySlug } from '../config/specialized-solutions';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';

/** Section 1 grid: Complete ERP maturity packages only. */
export function MaturityPackagesSection({
  industrySlug,
  products,
}: {
  industrySlug: string;
  products: SoftwareProjectCard[];
}) {
  if (industrySlug !== 'garments' && industrySlug !== 'feed-mill') return null;

  const industry = industrySlug as 'garments' | 'feed-mill';
  const packages = products
    .filter((p) => isMaturitySlug(p.slug, industry))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (packages.length === 0) return null;

  const title =
    industrySlug === 'garments' ? 'Complete Garments ERP Packages' : 'Complete Feed Mill ERP Packages';
  const intro =
    industrySlug === 'garments'
      ? 'Recommended maturity path from Starter through Enterprise — each product is a full solution with its own price.'
      : 'Recommended maturity path from Mini through Enterprise — each product is a full solution with its own price.';

  return (
    <section className="mb-2" aria-labelledby="maturity-packages">
      <h2 id="maturity-packages" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary">{intro}</p>
      <ul className={`mt-5 ${CATALOG_LISTING_GRID_CLASS}`}>
        {packages.map((project) => (
          <li key={project.id} className="min-w-0 list-none">
            <SoftwareCard project={project} variant="home" />
          </li>
        ))}
      </ul>
    </section>
  );
}
