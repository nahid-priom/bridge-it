'use client';

import { Check, X, Play, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import type { BitpProduct } from '@/types/bitp';
import type { SoftwareComparisonRow } from '@/lib/services/software-showroom.service';
import { formatProductPrice } from '@/lib/format/currency';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type SoftwarePackageComparisonProps = {
  products: BitpProduct[];
  rows: SoftwareComparisonRow[];
  highlightSlug?: string;
};

export function SoftwarePackageComparison({ products, rows, highlightSlug }: SoftwarePackageComparisonProps) {
  return (
    <>
      <div className="md:hidden space-y-4">
        {products.map((p) => {
          const price = formatProductPrice(Number(p.starting_price), p.pricing_type ?? 'starting_from');
          return (
            <div key={p.slug} className={cn('rounded-2xl border p-5', highlightSlug === p.slug ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-white/10')}>
              <h3 className="font-black text-lg">{p.name}</h3>
              <p className="text-emerald-600 font-black text-xl my-2">{price.primary}</p>
              <ul className="space-y-2 mt-4">
                {rows.map((row) => (
                  <li key={row.key} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{row.label}</span>
                    {row.values[p.slug] ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4">
                {p.internal_demo_slug && (
                  <Link href={ROUTES.softwareDemo(p.internal_demo_slug)} className="deshi-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold">
                    <Play className="w-3.5 h-3.5" aria-hidden /> Demo
                  </Link>
                )}
                <Link href={ROUTES.softwareSolutionOrder(p.slug)} className="deshi-btn-outline flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold">
                  <ShoppingCart className="w-3.5 h-3.5" aria-hidden /> Order
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="hidden md:block overflow-x-auto pb-4">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 sticky left-0 bg-background z-10 font-semibold text-sm">Feature</th>
              {products.map((p) => {
                const price = formatProductPrice(Number(p.starting_price), p.pricing_type ?? 'starting_from');
                return (
                  <th key={p.slug} className={cn('p-3 text-center min-w-[150px] text-sm font-black', highlightSlug === p.slug && 'bg-emerald-50 dark:bg-emerald-900/20')}>
                    <div>{p.name.replace(' Software', '').replace(' ERP', '')}</div>
                    <div className="text-emerald-600">{price.primary}</div>
                    <div className="flex gap-1 justify-center mt-2">
                      {p.internal_demo_slug && <Link href={ROUTES.softwareDemo(p.internal_demo_slug)} className="text-[10px] px-2 py-1 rounded bg-emerald-500 text-white font-bold">Demo</Link>}
                      <Link href={ROUTES.softwareSolutionOrder(p.slug)} className="text-[10px] px-2 py-1 rounded border border-emerald-500 text-emerald-600 font-bold">Order</Link>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-slate-100 dark:border-white/5">
                <td className="p-3 sticky left-0 bg-background z-10 text-sm text-text-secondary">{row.label}</td>
                {products.map((p) => (
                  <td key={p.slug} className={cn('p-3 text-center', highlightSlug === p.slug && 'bg-emerald-50/50 dark:bg-emerald-900/10')}>
                    {row.values[p.slug] ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
