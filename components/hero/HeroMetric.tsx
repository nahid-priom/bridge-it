'use client';

import { Briefcase, Headphones, Shield, Star, Users } from 'lucide-react';
import type { HeroTrustMetric } from '@/data/heroContent';

const ICONS = {
  users: Users,
  briefcase: Briefcase,
  headphones: Headphones,
  shield: Shield,
  star: Star,
} as const;

export function HeroMetric({ metric }: { metric: HeroTrustMetric }) {
  const Icon = ICONS[metric.icon];
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${metric.iconBg} dark:bg-white/10`}
      >
        <Icon className={`w-4 h-4 ${metric.iconColor} dark:text-bridge-secondary`} />
      </div>
      <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
        {metric.label}
      </span>
    </div>
  );
}
