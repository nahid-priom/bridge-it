'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { POPULAR_TAGS, TRENDING_SERVICES } from '@/data/searchSidebarContent';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { ROUTES, searchUrl } from '@/lib/routes';
import { becomeSellerPath } from '@/lib/auth/become-seller';
import type { MarketplaceService } from '@/types/marketplace';
import type { MarketplaceSellerSummary } from '@/types/marketplaceSeller';
import { getMarketplaceThumbnailStyle } from '@/lib/marketplace/thumbnails';
function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-text-primary mb-3">{title}</h3>
      {children}
    </div>
  );
}

type SidebarWidgetsProps = {
  services: MarketplaceService[];
  topSellers?: MarketplaceSellerSummary[];
};

export function SidebarWidgets({ services, topSellers = [] }: SidebarWidgetsProps) {
  const recent = services.slice(0, 3);

  return (
    <aside className="space-y-4 lg:space-y-5" aria-label="Search sidebar">
      <WidgetCard title="Recently Viewed">
        <ul className="space-y-3">
          {recent.map((item) => {
            const thumb = getMarketplaceThumbnailStyle(item.categorySlug, item.rowGroup);
            return (
              <li key={item.id}>
                <Link
                  href={ROUTES.service(item.slug)}
                  className="flex gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
                >
                  <div
                    className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${thumb.className}`}
                  >
                    <span className="text-lg" aria-hidden>
                      {thumb.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-primary line-clamp-2 group-hover:text-deshi-green transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs font-bold text-text-primary mt-0.5">
                      ৳{item.priceFrom.toLocaleString('en-BD')}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </WidgetCard>

      <WidgetCard title="Trending Services">
        <ul className="space-y-2.5">
          {TRENDING_SERVICES.map((t) => (
            <li key={t.label}>
              <Link
                href={t.href}
                className="flex items-center justify-between gap-2 text-xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded"
              >
                <span className="font-medium text-text-primary group-hover:text-deshi-green transition-colors truncate">
                  {t.label}
                </span>
                <span className="text-text-muted shrink-0">{t.count.toLocaleString()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </WidgetCard>

      <WidgetCard title="Popular Tags">
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => (
            <Link
              key={tag}
              href={searchUrl(tag)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-text-secondary hover:bg-deshi-green/10 hover:text-deshi-green transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
            >
              {tag}
            </Link>
          ))}
        </div>
      </WidgetCard>

      <WidgetCard title="Top Freelancers">
        <ul className="space-y-3">
          {topSellers.slice(0, 5).map((f) => (
            <li key={f.id}>
              <Link
                href={ROUTES.marketplaceSeller(f.slug)}
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
              >
                {f.avatarUrl ? (
                  <Image
                    src={f.avatarUrl}
                    alt=""
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0"
                  />
                ) : (
                  <SellerAvatar name={f.fullName} size="md" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-text-primary truncate group-hover:text-deshi-green">
                    {f.fullName}
                  </p>
                  <p className="text-[10px] text-deshi-green font-medium truncate">{f.sellerLevel}</p>
                  <div className="flex items-center gap-0.5 text-[10px] text-text-muted mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" aria-hidden />
                    {f.rating.toFixed(1)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </WidgetCard>

      <div className="rounded-2xl overflow-hidden border border-violet-200/60 dark:border-violet-500/20 bg-gradient-to-br from-violet-50 via-white to-sky-50 dark:from-violet-950/40 dark:via-slate-900 dark:to-sky-950/30 p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="shrink-0">
            <SellerAvatar name="Join Seller" size="lg" hue={270} />
          </div>
          <div>
            <h3 className="text-base font-black text-text-primary mb-1">Become a Seller</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              Start earning by offering your skills to thousands of buyers across Bangladesh.
            </p>
            <Link
              href={becomeSellerPath(null)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl deshi-btn-primary text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50"
            >
              Join Now
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
