import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { RelatedSolutions } from '@/components/seo/RelatedSolutions';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { getProjectBySlug, listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { ProjectPreview } from '@/src/features/ecommerce-showcase/public/ProjectPreview';
import {
  showcaseTemplateBreadcrumbJsonLd,
  showcaseTemplateServiceJsonLd,
} from '@/lib/structured-data';
import { ROUTES } from '@/lib/routes';

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

  const related = (
    await listProjectCards({
      industry: project.industry || undefined,
      category: project.category?.slug || undefined,
      limit: 8,
    })
  ).items
    .filter((item) => item.id !== project.id)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          showcaseTemplateServiceJsonLd(project),
          showcaseTemplateBreadcrumbJsonLd(project.title, project.slug),
        ]}
      />
      {!project.published ? (
        <p className="bg-amber-100 text-center text-sm py-2 text-amber-900">Draft preview — not public</p>
      ) : null}
      <ProjectPreview project={project} />
      <RelatedSolutions
        kind="website"
        items={related}
        viewAllHref={ROUTES.websites}
        viewAllLabel="Explore website designs"
      />
    </>
  );
}
