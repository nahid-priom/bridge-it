'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  Star,
  Calendar,
  Clock,
} from 'lucide-react';
import type { MarketplaceSeller } from '@/types/marketplaceSeller';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type SellerProfileHeroProps = {
  seller: MarketplaceSeller;
};

export function SellerProfileHero({ seller }: SellerProfileHeroProps) {
  const memberYear = new Date(seller.memberSince).getFullYear();

  return (
    <section className="relative mb-8 md:mb-10">
      <div
        className={cn(
          'relative h-44 sm:h-52 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden',
          'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900',
          'dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900'
        )}
      >
        {seller.bannerUrl ? (
          <Image src={seller.bannerUrl} alt="" fill className="object-cover opacity-60" priority />
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(16,185,129,0.4), transparent 50%), radial-gradient(circle at 80% 30%, rgba(109,53,245,0.35), transparent 45%)',
            }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative -mt-16 sm:-mt-20 mx-4 sm:mx-6 md:mx-8"
      >
        <div className="rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/95 shadow-xl p-5 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-5 md:gap-8">
            <div className="flex gap-4 sm:gap-5 shrink-0">
              <div className="relative">
                {seller.avatarUrl ? (
                  <Image
                    src={seller.avatarUrl}
                    alt={seller.fullName}
                    width={96}
                    height={96}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-deshi-green/20 border-4 border-white dark:border-slate-800" />
                )}
                {seller.isVerified && (
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-deshi-green flex items-center justify-center border-2 border-white dark:border-slate-900">
                    <BadgeCheck className="w-4 h-4 text-white" aria-hidden />
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-text-primary">
                  {seller.fullName}
                </h1>
                {seller.isTopRated && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                    Top Rated
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-deshi-green font-semibold mb-2">{seller.title}</p>
              <p className="text-sm text-text-secondary line-clamp-2 mb-3">{seller.shortBio}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-text-muted">
                <span className="inline-flex items-center gap-1 font-semibold text-text-primary">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {seller.rating.toFixed(1)} ({seller.totalReviews} reviews)
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {seller.city}, {seller.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {memberYear}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {seller.queueOrders} orders in queue
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:shrink-0">
              <Link
                href={ROUTES.messages}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl deshi-btn-primary text-sm font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-deshi-green text-deshi-green-dark dark:text-deshi-green font-bold text-sm hover:bg-deshi-green/10 transition-colors"
              >
                Contact Me
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-text-secondary hover:bg-slate-50 dark:hover:bg-white/5"
                aria-label="Save seller"
              >
                <Heart className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
