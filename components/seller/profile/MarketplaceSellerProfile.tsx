'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { MarketplaceSellerProfile } from '@/types/marketplaceSeller';
import { SellerProfileHero } from '@/components/seller/profile/SellerProfileHero';
import { SellerTabs, type SellerTabId } from '@/components/seller/profile/SellerTabs';
import { SellerStats } from '@/components/seller/profile/SellerStats';
import { SellerSidebar } from '@/components/seller/profile/SellerSidebar';
import { SellerServices } from '@/components/seller/profile/SellerServices';
import { SellerPortfolio } from '@/components/seller/profile/SellerPortfolio';
import { SellerReviews } from '@/components/seller/profile/SellerReviews';
import { ROUTES } from '@/lib/routes';

const TECH_CHIPS = ['React', 'Next.js', 'Node.js', 'Shopify', 'WordPress', 'UI/UX', 'Laravel', 'AI'];

type MarketplaceSellerProfileProps = {
  profile: MarketplaceSellerProfile;
};

export function MarketplaceSellerProfile({ profile }: MarketplaceSellerProfileProps) {
  const [tab, setTab] = useState<SellerTabId>('overview');
  const { seller, skills, reviews, portfolio, verifications, clients, services } = profile;

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-offset)+1rem)]">
        <SellerProfileHero seller={seller} />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="flex-1 min-w-0">
            <SellerTabs active={tab} onChange={setTab} reviewCount={reviews.length} />

            {tab === 'overview' && (
              <div className="space-y-10">
                <section>
                  <h2 className="text-xl font-black text-text-primary mb-4">About</h2>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {seller.about ?? seller.shortBio}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {TECH_CHIPS.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-white/10 text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="text-xl font-black text-text-primary mb-4">Stats</h2>
                  <SellerStats seller={seller} />
                </section>
                <section>
                  <h2 className="text-xl font-black text-text-primary mb-4">My Services</h2>
                  <SellerServices services={services} />
                </section>
              </div>
            )}

            {tab === 'services' && (
              <section>
                <h2 className="text-xl font-black text-text-primary mb-4">My Services</h2>
                <SellerServices services={services} horizontal={false} />
              </section>
            )}

            {tab === 'portfolio' && (
              <section>
                <h2 className="text-xl font-black text-text-primary mb-4">Portfolio</h2>
                <SellerPortfolio items={portfolio} />
              </section>
            )}

            {tab === 'reviews' && (
              <section>
                <h2 className="text-xl font-black text-text-primary mb-4">Reviews</h2>
                <SellerReviews reviews={reviews} />
              </section>
            )}

            {tab === 'about' && (
              <section className="prose prose-sm dark:prose-invert max-w-none">
                <h2 className="text-xl font-black text-text-primary mb-4">About {seller.fullName}</h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {seller.about}
                </p>
                <SellerStats seller={seller} />
              </section>
            )}

            {tab === 'faq' && (
              <section className="space-y-4">
                <h2 className="text-xl font-black text-text-primary mb-4">FAQ</h2>
                {[
                  {
                    q: 'What is your typical response time?',
                    a: `I usually respond within ${seller.responseTime} with a ${seller.responseRate}% response rate.`,
                  },
                  {
                    q: 'Do you work with clients outside Bangladesh?',
                    a: 'Yes. I communicate in English and Bengali and accept international payments where supported.',
                  },
                  {
                    q: 'How do revisions work?',
                    a: 'Each service includes agreed revisions. Additional scope is quoted before work begins.',
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-slate-200/90 dark:border-white/10 p-4 bg-white dark:bg-slate-900/60"
                  >
                    <h3 className="font-bold text-text-primary text-sm mb-1">{item.q}</h3>
                    <p className="text-sm text-text-secondary">{item.a}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div className="lg:w-[300px] xl:w-[320px] shrink-0">
            <SellerSidebar
              seller={seller}
              skills={skills}
              verifications={verifications}
              clients={clients}
            />
          </div>
        </div>

        <section className="mt-12 md:mt-16 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-900 dark:from-slate-950 dark:to-emerald-950 p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-black font-display mb-3">
            Ready to start your project?
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto mb-6">
            Get in touch with {seller.fullName} today and bring your idea to life with a verified
            Bangladeshi freelancer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={ROUTES.messages}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Me
            </Link>
            <button
              type="button"
              onClick={() => setTab('services')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-white/40 font-bold text-sm hover:bg-white/10 transition-colors"
            >
              View My Services
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
