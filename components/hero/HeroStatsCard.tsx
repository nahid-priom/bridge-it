'use client';

import { Briefcase, Headphones, Shield, Users } from 'lucide-react';
import { HERO_TRUST_STATS } from '@/data/homeContent';
import { cn } from '@/lib/cn';

const ICONS = {
  briefcase: Briefcase,
  users: Users,
  shield: Shield,
  headphones: Headphones,
} as const;

export function HeroStatsCard() {
  return (
    <div
      className={cn(
        'hero-stats-card w-full max-w-5xl mx-auto mt-8 md:mt-10',
        'bg-white/95 dark:bg-surface/95 backdrop-blur-sm',
        'border border-slate-200/80 dark:border-white/10',
        'rounded-2xl md:rounded-3xl',
        'shadow-[0_12px_40px_rgba(15,14,23,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)]',
        'px-4 py-5 sm:px-6 sm:py-6 md:px-8'
      )}
      role="list"
      aria-label="Platform statistics"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 md:gap-0 md:divide-x md:divide-slate-200 dark:md:divide-white/10">
        {HERO_TRUST_STATS.map((stat) => {
          const Icon = ICONS[stat.icon];
          return (
            <div
              key={stat.id}
              role="listitem"
              className="flex flex-col items-center justify-center gap-2 text-center md:px-4 first:md:pl-0 last:md:pr-0 py-1 pr-2"
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center shrink-0',
                  stat.iconBg
                )}
              >
                <Icon className={cn('w-5 h-5', stat.iconColor)} aria-hidden />
              </div>
              <span className="text-sm sm:text-base font-bold text-[#080B16] dark:text-text-primary leading-tight">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
