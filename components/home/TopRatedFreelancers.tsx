'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, BadgeCheck } from 'lucide-react';
import { HOME_FREELANCERS } from '@/data/homeContent';
import { ROUTES } from '@/lib/routes';

export function TopRatedFreelancers() {
  return (
    <section className="py-12 md:py-16 bg-surface" aria-labelledby="top-freelancers-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <h2
            id="top-freelancers-heading"
            className="text-2xl md:text-3xl font-black font-display text-text-primary"
          >
            Top Rated Freelancers
          </h2>
          <Link
            href={`${ROUTES.search}?resultType=seller`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-deshi-green"
          >
            View all freelancers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {HOME_FREELANCERS.map((f) => (
            <article
              key={f.id}
              className="rounded-2xl border border-slate-100 dark:border-white/10 bg-background p-5 text-center hover:shadow-lg hover:border-deshi-green/25 transition-all"
            >
              <div className="relative w-20 h-20 mx-auto mb-3">
                <Image
                  src={f.avatar}
                  alt=""
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-deshi-green/30"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-deshi-green text-white text-[9px] font-bold whitespace-nowrap">
                  <BadgeCheck className="w-3 h-3" aria-hidden />
                  Top Rated
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">{f.name}</h3>
              <p className="text-xs text-text-muted mb-2">{f.title}</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-2">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden />
                <span className="font-bold">{f.rating}</span>
                <span className="text-text-muted">({f.reviewCount})</span>
              </div>
              <p className="text-sm font-black text-text-primary">
                From ৳{f.priceFrom.toLocaleString('en-BD')}
              </p>
              <Link
                href={ROUTES.seller(f.slug)}
                className="sr-only"
              >
                View {f.name} profile
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
