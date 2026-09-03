import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { getProjectBySlug } from '@/src/features/ecommerce-showcase/api/projects';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { ProjectPreview } from '@/src/features/ecommerce-showcase/public/ProjectPreview';
import { SITE_URL } from '@/lib/site';

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
  const project = await getProjectBySlug(slug, { includeDrafts });
  if (!project) return buildPageMetadata({ title: 'Website', path: `/websites/${slug}` });
  return buildPageMetadata({
    title: project.seo_title || project.title,
    description: project.seo_description || project.short_description || undefined,
    path: `/websites/${project.slug}`,
    keywords: project.seo_keywords,
    image: project.og_image_url || project.cover_fallback_url || project.cover_image_url,
    noIndex: !project.published,
  });
}

export default async function WebsiteDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;
  const project = await getProjectBySlug(slug, { includeDrafts });
  if (!project) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.short_description,
    url: `${SITE_URL}/websites/${project.slug}`,
    image: project.cover_image_url || project.cover_fallback_url,
    offers: {
      '@type': 'Offer',
      priceCurrency: project.currency,
      price: project.starting_price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {!project.published ? (
        <p className="bg-amber-100 text-amber-900 text-center text-sm py-2">Draft preview — not public</p>
      ) : null}
      <ProjectPreview project={project} />
    </>
  );
}
