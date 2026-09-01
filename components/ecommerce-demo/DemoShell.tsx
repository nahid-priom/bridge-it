'use client';

import Link from 'next/link';
import { X, ExternalLink, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { formatProductPrice } from '@/lib/format/currency';
import { BRANDING } from '@/lib/config/branding';

type DemoShellProps = {
  productName: string;
  productSlug: string;
  price: number;
  demoSlug: string;
  children: React.ReactNode;
};

export function DemoShell({ productName, productSlug, price, demoSlug, children }: DemoShellProps) {
  const priceLabel = formatProductPrice(price, 'fixed');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] flex flex-col [--demo-bar-height:88px]">
      <div className="sticky top-0 z-50 bg-[#0f2744] border-b border-emerald-500/30 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white">
                Live Demo
              </span>
              <span className="text-white/90 text-xs sm:text-sm font-semibold truncate max-w-[140px] sm:max-w-none">
                {BRANDING.shortName}
              </span>
              <span className="hidden sm:inline text-white/50">|</span>
              <span className="text-emerald-400 text-xs sm:text-sm font-bold truncate max-w-[160px] sm:max-w-[240px]">
                {productName}
              </span>
              <span className="text-white font-black text-sm shrink-0">{priceLabel.primary}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={ROUTES.ecommerceSolution(productSlug)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                <span className="hidden xs:inline">View Package</span>
                <span className="xs:hidden">Package</span>
              </Link>
              <Link
                href={ROUTES.ecommerceSolutionOrder(productSlug)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden />
                Order
              </Link>
              <Link
                href={ROUTES.ecommerceShowroom}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Exit demo"
              >
                <X className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">Exit</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/90 text-amber-950 text-center text-xs font-semibold py-1 px-2">
          Demo Environment — No real purchase will be made.
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
