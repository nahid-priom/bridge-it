import Link from 'next/link';
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
      : 'Focused tools for production, formula costing, dealers, warehouse and finance — separate from complete Feed Mill ERP packages.';
  const flagshipHref =
    industrySlug === 'garments' ? '/software/garments/garments-erp' : '/software/feed-mill/feed-mill-erp';
  const flagshipLabel =
    industrySlug === 'garments' ? 'Garments ERP Standard' : 'Feed Mill ERP Standard';

  return (
    <section className="mt-12" aria-labelledby="specialized-solutions">
      <h2 id="specialized-solutions" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary">{intro}</p>
      <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {specialized.map((project) => (
          <li key={project.id}>
            <SoftwareCard project={project} />
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
