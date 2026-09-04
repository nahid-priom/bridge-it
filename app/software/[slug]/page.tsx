import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { ROUTES } from '@/lib/routes';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getSoftwareProjectBySlug } from '@/src/features/software-showcase/api/projects';
import {
  SoftwarePreview,
  SoftwarePreviewSkeleton,
} from '@/src/features/software-showcase/public/SoftwarePreview';
import {
  softwareShowcaseBreadcrumbJsonLd,
  softwareShowcaseServiceJsonLd,
} from '@/lib/structured-data';

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
  const project = await getSoftwareProjectBySlug(slug, { includeDrafts });
  if (!project) {
    return buildPageMetadata({ title: 'Software', path: ROUTES.softwareSolution(slug) });
  }
  return buildPageMetadata({
    title: project.seo_title || project.title,
    description: project.seo_description || project.short_description || undefined,
    path: ROUTES.softwareSolution(project.slug),
    keywords: project.seo_keywords,
    image: project.og_image_url || project.cover_detail_url || project.cover_card_url,
    noIndex: !project.published,
  });
}

export default async function SoftwareDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;
  const project = await getSoftwareProjectBySlug(slug, { includeDrafts });
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={[
          softwareShowcaseServiceJsonLd(project),
          softwareShowcaseBreadcrumbJsonLd(project.title, project.slug),
        ]}
      />
      {!project.published ? (
        <p className="bg-amber-100 text-center text-sm py-2 text-amber-900">
          Draft preview — not public
        </p>
      ) : null}
      <Suspense fallback={<SoftwarePreviewSkeleton />}>
        <SoftwarePreview project={project} />
      </Suspense>
    </>
  );
}
