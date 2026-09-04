'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { ROUTES } from '@/lib/routes';
import type { MarketplaceSellerSummary } from '@/types/marketplaceSeller';
import { cn } from '@/lib/cn';

type FreelancerCarouselProps = {
  sellers: MarketplaceSellerSummary[];
};

export function FreelancerCarousel({ sellers }: FreelancerCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (sellers.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-slate-50/80 dark:bg-slate-900/30" aria-labelledby="top-freelancers-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2
              id="top-freelancers-heading"
              className="text-2xl md:text-3xl font-black font-display text-text-primary"
            >
              Top Rated <span className="text-deshi-green">Freelancers</span>
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Hand-picked professionals with outstanding reviews and fast delivery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center justify-center hover:border-deshi-green/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
              aria-label="Scroll freelancers left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center justify-center hover:border-deshi-green/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
              aria-label="Scroll freelancers right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href={ROUTES.search}
              className="ml-2 text-sm font-semibold text-deshi-green hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded"
            >
              View all freelancers
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
        >
          {sellers.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="snap-start shrink-0 w-[260px] md:w-[280px]"
            >
              <Link
                href={ROUTES.marketplaceSeller(f.slug)}
                className={cn(
                  'block rounded-2xl border border-slate-200/90 dark:border-white/10',
                  'bg-white dark:bg-slate-900/90 p-5 shadow-sm hover:shadow-lg hover:border-deshi-green/30 transition-all'
                )}
              >
                <div className="relative w-fit mx-auto mb-3">
                  {f.avatarUrl ? (
                    <Image
                      src={f.avatarUrl}
                      alt=""
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md mx-auto"
                    />
                  ) : (
                    <SellerAvatar name={f.fullName} size="lg" />
                  )}
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                    aria-hidden
                  />
                </div>
                <h3 className="text-center text-sm font-bold text-text-primary">{f.fullName}</h3>
                <p className="text-center text-[11px] text-deshi-green font-semibold mt-0.5 line-clamp-1">
                  {f.sellerLevel}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden />
                  <span className="font-bold">{f.rating.toFixed(1)}</span>
                  <span className="text-text-muted">({f.totalReviews})</span>
                </div>
                <p className="text-center text-sm font-black text-text-primary mt-3">
                  From ৳{f.startingPrice.toLocaleString('en-BD')}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
