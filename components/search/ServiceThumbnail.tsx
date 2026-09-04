'use client';

import type { ThumbnailVariant } from '@/types/demoMarketplace';
import { cn } from '@/lib/cn';

const VARIANT_STYLES: Record<
  ThumbnailVariant,
  { from: string; to: string; accent: string; label: string }
> = {
  web: { from: '#0ea5e9', to: '#6366f1', accent: '#22d3ee', label: 'WEB' },
  wordpress: { from: '#21759b', to: '#1e3a5f', accent: '#38bdf8', label: 'WP' },
  ecommerce: { from: '#059669', to: '#047857', accent: '#6ee7b7', label: 'STORE' },
  ai: { from: '#2563eb', to: '#4c1d95', accent: '#c4b5fd', label: 'AI' },
  marketing: { from: '#ea580c', to: '#c2410c', accent: '#fdba74', label: 'ADS' },
  video: { from: '#db2777', to: '#9d174d', accent: '#f9a8d4', label: 'VIDEO' },
  design: { from: '#3b82f6', to: '#5b21b6', accent: '#ddd6fe', label: 'UI/UX' },
  seo: { from: '#0891b2', to: '#164e63', accent: '#67e8f9', label: 'SEO' },
  fullstack: { from: '#2563eb', to: '#1e1b4b', accent: '#93c5fd', label: 'FULL' },
  landing: { from: '#10b981', to: '#065f46', accent: '#a7f3d0', label: 'LAND' },
  maintenance: { from: '#64748b', to: '#334155', accent: '#cbd5e1', label: 'FIX' },
  mobile: { from: '#f59e0b', to: '#b45309', accent: '#fde68a', label: 'APP' },
  dashboard: { from: '#4f46e5', to: '#312e81', accent: '#a5b4fc', label: 'DASH' },
  saas: { from: '#06b6d4', to: '#0e7490', accent: '#a5f3fc', label: 'SAAS' },
  booking: { from: '#14b8a6', to: '#0f766e', accent: '#99f6e4', label: 'BOOK' },
  lms: { from: '#6366f1', to: '#4338ca', accent: '#c7d2fe', label: 'LMS' },
  restaurant: { from: '#ef4444', to: '#991b1b', accent: '#fecaca', label: 'FOOD' },
  realestate: { from: '#0d9488', to: '#115e59', accent: '#5eead4', label: 'HOME' },
  speed: { from: '#eab308', to: '#a16207', accent: '#fef08a', label: 'FAST' },
  migration: { from: '#3b82f6', to: '#1d4ed8', accent: '#bfdbfe', label: 'MOVE' },
  payment: { from: '#22c55e', to: '#15803d', accent: '#bbf7d0', label: 'PAY' },
  api: { from: '#475569', to: '#0f172a', accent: '#94a3b8', label: 'API' },
  crm: { from: '#ec4899', to: '#9f1239', accent: '#fbcfe8', label: 'CRM' },
};

type ServiceThumbnailProps = {
  variant: ThumbnailVariant;
  title: string;
  className?: string;
};

export function ServiceThumbnail({ variant, title, className }: ServiceThumbnailProps) {
  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.web;
  const words = title.split(/\s+/).slice(0, 3);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden flex items-end p-3 md:p-4',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${style.from} 0%, ${style.to} 100%)`,
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30"
        style={{ background: style.accent }}
        aria-hidden
      />
      <div
        className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest text-white/90 bg-black/20 backdrop-blur-sm"
        aria-hidden
      >
        {style.label}
      </div>
      <p className="relative z-[1] text-white font-black text-sm md:text-base leading-tight line-clamp-3 drop-shadow-md uppercase tracking-wide">
        {words.join(' ')}
      </p>
    </div>
  );
}
