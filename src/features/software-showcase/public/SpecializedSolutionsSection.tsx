import Link from 'next/link';
import { GARMENTS_ACCESSORIES_SLUG } from '../config/maturity-ladder';
import type { SoftwareProjectCard } from '../types';
import { SoftwareCard } from './SoftwareCard';

export function SpecializedSolutionsSection({
  industrySlug,
  products,
}: {
  industrySlug: string;
  products: SoftwareProjectCard[];
}) {
  if (industrySlug !== 'garments') return null;

  const specialized = products.filter((p) => p.slug === GARMENTS_ACCESSORIES_SLUG);
  if (specialized.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="specialized-garments">
      <h2 id="specialized-garments" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
        Specialized Garments Solutions
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary">
        Trim and accessories factories need style-linked orders and delivery — separate from apparel ERP.
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {specialized.map((project) => (
          <li key={project.id}>
            <SoftwareCard project={project} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-text-muted">
        Looking for apparel factory ERP? Browse the maturity options above or{' '}
        <Link href="/software/garments/garments-erp" className="font-semibold text-[#2563eb] hover:underline">
          open Garments ERP Standard
        </Link>
        .
      </p>
    </section>
  );
}
