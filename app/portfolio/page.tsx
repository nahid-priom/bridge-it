import Link from 'next/link';
import Image from 'next/image';
import { buildPageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { getPublishedPortfolio } from '@/lib/services/portfolio.service';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: `Portfolio | ${SITE_NAME}`,
  path: '/portfolio',
});

export default async function PortfolioPage() {
  const items = await getPublishedPortfolio();

  return (
    <div className="pb-16">
      <PageHero
        variant="marketing"
        title={PAGE_HEROES.portfolio.title}
        highlightedText={PAGE_HEROES.portfolio.highlightedText}
        subtitle={PAGE_HEROES.portfolio.subtitle}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <p className="text-center text-text-secondary py-16">No portfolio items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="group rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-deshi-green/40 transition-colors"
              >
                <div className="relative aspect-video bg-gradient-to-br from-emerald-600/20 to-teal-700/20">
                  {item.thumbnail && (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5">
                  {item.category && (
                    <span className="text-xs font-semibold text-deshi-green uppercase">{item.category}</span>
                  )}
                  <h2 className="text-lg font-bold mt-1">{item.title}</h2>
                  {item.client_name && <p className="text-sm text-text-secondary">{item.client_name}</p>}
                  {item.description && <p className="text-sm text-text-secondary mt-2 line-clamp-2">{item.description}</p>}
                  {item.project_url && (
                    <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-semibold text-deshi-green hover:underline">
                      View Project
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
