import { requireShowcaseViewer } from '@/src/features/ecommerce-showcase/api/auth';
import {
  adminListHomepagePlacements,
  adminListPublishedProjectOptions,
  mapAdminPlacement,
} from '@/src/features/ecommerce-showcase/api/admin';
import { ShowcaseAdminShell } from '@/src/features/ecommerce-showcase/admin/ShowcaseAdminShell';
import { HomepageCurationBoard } from '@/src/features/ecommerce-showcase/admin/HomepageCurationBoard';
import { isShowcaseEditorRole } from '@/src/features/ecommerce-showcase/config/roles';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Homepage Curation',
  path: '/admin/ecommerce-projects/homepage',
  noIndex: true,
});

export default async function HomepageCurationPage() {
  const profile = await requireShowcaseViewer();
  const [placementRows, projectRows] = await Promise.all([
    adminListHomepagePlacements(),
    adminListPublishedProjectOptions(),
  ]);
  const placements = (placementRows as Record<string, unknown>[])
    .map((row) => mapAdminPlacement(row))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <ShowcaseAdminShell profile={profile}>
      <HomepageCurationBoard
        placements={placements}
        projects={projectRows as {
          id: string;
          title: string;
          slug: string;
          industry: string | null;
          cover_image_url: string | null;
          cover_fallback_url: string | null;
        }[]}
        canEdit={isShowcaseEditorRole(profile.role)}
      />
    </ShowcaseAdminShell>
  );
}
