import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import type { CatalogCategoryRoot } from '../types';

export function consultationDeepLink(params: {
  intent: 'demo' | 'order';
  product: string;
  industry?: string | null;
  kind: CatalogCategoryRoot;
  /** Selected package name or tier — optional, client state only. */
  package?: string | null;
}): string {
  const qs = new URLSearchParams();
  qs.set('intent', params.intent);
  qs.set('product', params.product);
  qs.set('kind', params.kind);
  if (params.industry) qs.set('industry', params.industry);
  if (params.package) qs.set('package', params.package);
  return `${ROUTES.consultation}?${qs.toString()}`;
}

export function CatalogCTA({
  productSlug,
  industrySlug,
  kind,
  packageName,
  className,
  demoLabel = 'Free Demo',
  orderLabel = 'Order Now',
}: {
  productSlug: string;
  industrySlug?: string | null;
  kind: CatalogCategoryRoot;
  packageName?: string | null;
  className?: string;
  demoLabel?: string;
  orderLabel?: string;
}) {
  const demoHref = consultationDeepLink({
    intent: 'demo',
    product: productSlug,
    industry: industrySlug,
    kind,
    package: packageName,
  });
  const orderHref = consultationDeepLink({
    intent: 'order',
    product: productSlug,
    industry: industrySlug,
    kind,
    package: packageName,
  });

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link
        href={demoHref}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f2744] px-5 text-sm font-semibold text-white hover:bg-[#16375f]"
      >
        {demoLabel}
      </Link>
      <Link
        href={orderHref}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-border-subtle px-5 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
      >
        {orderLabel}
      </Link>
    </div>
  );
}
