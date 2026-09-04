import Link from 'next/link';
import Image from 'next/image';
import { buildPageMetadata } from '@/lib/metadata';
import { PageHero } from '@/components/ui/PageHero';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { getPublishedPortfolio } from '@/lib/services/portfolio.service';
import { ROUTES } from '@/lib/routes';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Portfolio',
  description:
    'Selected website, software, and creative marketing work from Bridge IT Park — explore showrooms and request a consultation.',
  path: ROUTES.portfolio,
});

function categoryHref(category: string | null | undefined): string {
  const raw = (category ?? '').toLowerCase();
  if (raw.includes('software') || raw.includes('erp') || raw.includes('pos')) {
    return ROUTES.softwareShowroom;
  }
  if (raw.includes('market') || raw.includes('creative') || raw.includes('design') || raw.includes('brand')) {
    return ROUTES.creativeMarketingShowroom;
  }
  if (raw.includes('web') || raw.includes('e-com') || raw.includes('ecommerce') || raw.includes('store')) {
    return ROUTES.websites;
  }
  return ROUTES.explore;
}

export default async function PortfolioPage() {
  const items = await getPublishedPortfolio();

  return (
    <div className="pb-16">
      <PageBreadcrumbJsonLd path={ROUTES.portfolio} />
      <PageHero
        variant="marketing"
        title="Featured"
        highlightedText="Projects."
        subtitle="Curated work across websites, software, and creative marketing — each card links to related services."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={ROUTES.websites} className="text-[#2563eb] hover:underline">
            Website designs
          </Link>
          <span className="text-text-muted">·</span>
          <Link href={ROUTES.softwareShowroom} className="text-[#2563eb] hover:underline">
            Software solutions
          </Link>
          <span className="text-text-muted">·</span>
          <Link href={ROUTES.creativeMarketingShowroom} className="text-[#2563eb] hover:underline">
            Creative & marketing
          </Link>
          <span className="text-text-muted">·</span>
          <Link href={ROUTES.consultation} className="text-[#2563eb] hover:underline">
            Free consultation
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border-subtle bg-surface px-6 py-14 text-center">
            <p className="text-text-secondary">
              Portfolio case studies are being curated. Meanwhile, explore our live showrooms.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={ROUTES.websites}
                className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold"
              >
                Browse websites
              </Link>
              <Link
                href={ROUTES.softwareShowroom}
                className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold"
              >
                Browse software
              </Link>
              <Link
                href={ROUTES.consultation}
                className="rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white"
              >
                Book consultation
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const relatedHref = categoryHref(item.category);
              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-border-subtle transition-colors hover:border-[#2563eb]/40"
                >
                  <div className="relative aspect-video bg-background-soft">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={`${item.title} — Bridge IT Park portfolio`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    {item.category ? (
                      <Link
                        href={relatedHref}
                        className="text-xs font-semibold uppercase text-[#2563eb] hover:underline"
                      >
                        {item.category}
                      </Link>
                    ) : null}
                    <h2 className="mt-1 text-lg font-bold text-text-primary">{item.title}</h2>
                    {item.client_name ? (
                      <p className="text-sm text-text-secondary">{item.client_name}</p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{item.description}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                      {item.project_url ? (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2563eb] hover:underline"
                        >
                          View project
                        </a>
                      ) : null}
                      <Link href={relatedHref} className="text-text-secondary hover:text-[#2563eb]">
                        Related services
                      </Link>
                      <Link href={ROUTES.consultation} className="text-text-secondary hover:text-[#2563eb]">
                        Consultation
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
