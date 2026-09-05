import Link from 'next/link';
import { productPath } from '@/src/features/catalog/utils/paths';
import { upgradeNeighbors } from '../config/maturity-ladder';

export function MaturityUpgradePath({ productSlug }: { productSlug: string }) {
  const { previous, next, industrySlug } = upgradeNeighbors(productSlug);
  if (!industrySlug || (!previous && !next)) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-border-subtle bg-background-soft/60 px-5 py-5 sm:px-6"
      aria-labelledby="maturity-path"
    >
      <h2 id="maturity-path" className="font-display text-base font-bold text-[#0f2744] dark:text-white">
        Looking for a different fit?
      </h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-6">
        {previous ? (
          <p className="text-sm text-text-secondary">
            Need something simpler?{' '}
            <Link
              href={productPath('software', industrySlug, previous.slug)}
              className="font-semibold text-[#2563eb] hover:underline"
            >
              {previous.shortLabel} ({previous.priceLabel})
            </Link>
          </p>
        ) : null}
        {next ? (
          <p className="text-sm text-text-secondary">
            Need more features?{' '}
            <Link
              href={productPath('software', industrySlug, next.slug)}
              className="font-semibold text-[#2563eb] hover:underline"
            >
              {next.shortLabel} ({next.priceLabel})
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
