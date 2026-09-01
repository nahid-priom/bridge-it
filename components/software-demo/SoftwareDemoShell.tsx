'use client';

import Link from 'next/link';
import { X, ExternalLink, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { formatProductPrice } from '@/lib/format/currency';
import { BRANDING } from '@/lib/config/branding';

type SoftwareDemoShellProps = {
  productName: string;
  productSlug: string;
  price: number;
  businessType: string;
  children: React.ReactNode;
};

export function SoftwareDemoShell({ productName, productSlug, price, businessType, children }: SoftwareDemoShellProps) {
  const priceLabel = formatProductPrice(price, 'starting_from');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0a0e1a] flex flex-col [--demo-bar-height:96px]">
      <div className="sticky top-0 z-50 bg-[#0f2744] border-b border-emerald-500/30 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white">Software Live Demo</span>
              <span className="text-white/90 text-xs sm:text-sm font-semibold truncate">{BRANDING.shortName}</span>
              <span className="hidden sm:inline text-white/50">|</span>
              <span className="text-emerald-400 text-xs sm:text-sm font-bold truncate max-w-[180px]">{productName}</span>
              <span className="text-white font-black text-sm shrink-0">{priceLabel.primary}</span>
              <span className="text-white/60 text-xs hidden md:inline">· {businessType.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link href={ROUTES.softwareSolution(productSlug)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden /> View Package
              </Link>
              <Link href={ROUTES.softwareSolutionOrder(productSlug)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-400">
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden /> Order
              </Link>
              <Link href={ROUTES.softwareShowroom} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-white/70 hover:text-white" aria-label="Exit demo">
                <X className="w-4 h-4" aria-hidden /> <span className="hidden sm:inline">Exit</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/90 text-amber-950 text-center text-xs font-semibold py-1 px-2">
          Demo Environment — Sample data only. No real business records are created.
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
