import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getCreativeMarketingBySlug } from '@/src/features/creative-marketing-showcase/api/projects';
import { CreativeMarketingPreview } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingPreview';
import { breadcrumbJsonLd } from '@/lib/structured-data';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;
  const project = await getCreativeMarketingBySlug(slug, { includeDrafts });
  if (!project) {
    return buildPageMetadata({
      title: 'Creative & Marketing',
      path: ROUTES.creativeMarketingSolution(slug),
    });
  }
  return buildPageMetadata({
    title: project.seo_title || project.title,
    description: project.seo_description || project.short_description || undefined,
    path: ROUTES.creativeMarketingSolution(project.slug),
    keywords: project.seo_keywords,
    image: project.og_image_url || project.cover_detail_url || project.cover_card_url,
    noIndex: !project.published,
  });
}

export default async function CreativeMarketingDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;
  const project = await getCreativeMarketingBySlug(slug, { includeDrafts });
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: project.title,
            description: project.short_description,
            url: `${SITE_URL}${ROUTES.creativeMarketingSolution(project.slug)}`,
            provider: { '@type': 'Organization', name: 'Bridge IT Park', url: SITE_URL },
            areaServed: { '@type': 'Country', name: 'Bangladesh' },
            offers: {
              '@type': 'Offer',
              priceCurrency: project.currency,
              price: project.starting_price,
            },
          },
          breadcrumbJsonLd([
            { name: 'Home', url: SITE_URL },
            {
              name: 'Creative & Digital Marketing',
              url: `${SITE_URL}${ROUTES.creativeMarketingShowroom}`,
            },
            {
              name: project.title,
              url: `${SITE_URL}${ROUTES.creativeMarketingSolution(project.slug)}`,
            },
          ]),
        ]}
      />
      {!project.published ? (
        <p className="bg-amber-100 py-2 text-center text-sm text-amber-900">Draft preview — not public</p>
      ) : null}
      <CreativeMarketingPreview project={project} />
    </>
  );
}
