'use client';

import Link from 'next/link';
import { BadgeCheck, MessageCircle, Shield, Star } from 'lucide-react';
import type { MarketplaceSeller, MarketplaceSellerClient, MarketplaceSellerSkill, MarketplaceSellerVerification } from '@/types/marketplaceSeller';
import { SellerSkills } from '@/components/seller/profile/SellerSkills';
import { ROUTES } from '@/lib/routes';

type SellerSidebarProps = {
  seller: MarketplaceSeller;
  skills: MarketplaceSellerSkill[];
  verifications: MarketplaceSellerVerification[];
  clients: MarketplaceSellerClient[];
};

export function SellerSidebar({ seller, skills, verifications, clients }: SellerSidebarProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-offset)+5rem)]">
      <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-deshi-green" />
          Verification
        </h3>
        <ul className="space-y-2">
          {verifications.map((v) => (
            <li key={v.id} className="flex items-center gap-2 text-xs text-text-secondary">
              <BadgeCheck className="w-4 h-4 text-deshi-green shrink-0" />
              {v.verificationType}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-deshi-green/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900/80 p-5 shadow-sm">
        <h3 className="text-base font-black text-text-primary mb-2">Work together</h3>
        <p className="text-xs text-text-secondary mb-4 leading-relaxed">
          Starting from{' '}
          <span className="font-bold text-deshi-green">
            ৳{seller.startingPrice.toLocaleString('en-BD')}
          </span>
          . Responds in {seller.responseTime} · {seller.responseRate}% response rate.
        </p>
        <Link href={ROUTES.messages} className="w-full deshi-btn-primary py-2.5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl mb-2">
          <MessageCircle className="w-4 h-4" />
          Contact Me
        </Link>
        <p className="text-[10px] text-center text-text-muted capitalize">
          Status: {seller.availabilityStatus.replace(/-/g, ' ')}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-text-primary mb-3">Languages</h3>
        <div className="flex flex-wrap gap-1.5">
          {seller.languages.map((lang) => (
            <span
              key={lang}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 text-text-secondary"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-text-primary mb-4">Skills</h3>
        <SellerSkills skills={skills} />
      </div>

      {clients.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-text-primary mb-3">Top clients</h3>
          <div className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <span
                key={c.id}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 text-text-muted"
              >
                {c.clientName}
              </span>
            ))}
          </div>
        </div>
      )}

      {seller.isTopRated && (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-500/20 p-5 text-center">
          <Star className="w-8 h-8 text-amber-500 mx-auto mb-2 fill-amber-500" />
          <p className="text-sm font-black text-text-primary">Top Rated Seller</p>
          <p className="text-xs text-text-muted mt-1">Consistently delivers exceptional work</p>
        </div>
      )}
    </aside>
  );
}
