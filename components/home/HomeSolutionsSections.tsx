import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { ROUTES, solutionsUrl } from '@/lib/routes';
import { HOME_SECTION_IDS } from '@/data/homeContent';
import type { BitpProduct } from '@/types/bitp';

type HomeFeaturedSolutionsProps = {
  products: BitpProduct[];
};

export function HomeFeaturedSolutions({ products }: HomeFeaturedSolutionsProps) {
  if (!products.length) return null;

  return (
    <section id={HOME_SECTION_IDS.popular} className="py-12 md:py-16 bg-slate-50/80 dark:bg-[#0a0e1a]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">Featured Solutions</p>
            <h2 className="text-2xl md:text-3xl font-black">Popular Digital Solutions</h2>
          </div>
          <Link href={ROUTES.solutions} className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline shrink-0">
            View all solutions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product) => (
            <SolutionCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeShowroomPromos() {
  return (
    <section className="py-6 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-4 text-center">Interactive Showrooms</p>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <Link
            href={ROUTES.softwareShowroom}
            className="group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0f2744]/5 to-emerald-500/10 p-6 hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Software Solutions</p>
                <h3 className="text-lg font-black mt-1 group-hover:text-emerald-600 transition-colors">Try Live ERP Demos</h3>
                <p className="text-sm text-text-secondary mt-2">Stock, ledger, production & enterprise workflows for growing teams</p>
              </div>
              <Play className="w-8 h-8 text-emerald-500 shrink-0" aria-hidden />
            </div>
          </Link>
          <Link
            href={ROUTES.ecommerceShowroom}
            className="group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0f2744]/5 to-teal-500/10 p-6 hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">E-commerce Solutions</p>
                <h3 className="text-lg font-black mt-1 group-hover:text-emerald-600 transition-colors">Explore Store Demos</h3>
                <p className="text-sm text-text-secondary mt-2">Landing pages to full stores with live checkout demos</p>
              </div>
              <Play className="w-8 h-8 text-emerald-500 shrink-0" aria-hidden />
            </div>
          </Link>
        </div>
        <p className="text-center mt-4">
          <Link href={solutionsUrl()} className="text-sm font-semibold text-text-secondary hover:text-emerald-600">
            Or browse Web, Marketing & Creative →
          </Link>
        </p>
      </div>
    </section>
  );
}
