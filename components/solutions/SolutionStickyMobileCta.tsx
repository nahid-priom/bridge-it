'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

type SolutionStickyMobileCtaProps = {
  slug: string;
  demoSlug?: string | null;
  variant?: 'ecommerce' | 'software' | 'generic';
  orderPath?: string;
};

export function SolutionStickyMobileCta({ slug, demoSlug, variant = 'ecommerce', orderPath }: SolutionStickyMobileCtaProps) {
  const demoHref = demoSlug
    ? variant === 'software'
      ? ROUTES.softwareDemo(demoSlug)
      : ROUTES.ecommerceDemo(demoSlug)
    : null;
  const orderHref =
    orderPath ??
    (variant === 'software'
      ? ROUTES.softwareSolutionOrder(slug)
      : variant === 'generic'
        ? ROUTES.solutionOrder(slug)
        : ROUTES.ecommerceSolutionOrder(slug));

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f1424]/95 backdrop-blur-sm p-3 safe-area-pb">
      <div className="flex gap-2 max-w-lg mx-auto">
        {demoHref && (
          <Link href={demoHref} className="deshi-btn-primary flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm font-bold">
            Live Demo
          </Link>
        )}
        <Link href={orderHref} className="deshi-btn-outline flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold">
          <ShoppingCart className="w-4 h-4" aria-hidden />
          Order
        </Link>
      </div>
    </div>
  );
}

/** @deprecated Use SolutionStickyMobileCta */
export function StickyMobileCta(props: Omit<SolutionStickyMobileCtaProps, 'variant'> & { variant?: 'ecommerce' | 'software' }) {
  return <SolutionStickyMobileCta {...props} variant={props.variant ?? 'ecommerce'} />;
}
