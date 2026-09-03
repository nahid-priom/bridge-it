import { PageHeaderSkeleton } from '@/src/components/skeletons/PageHeaderSkeleton';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';
import { FilterSkeleton } from '@/src/components/skeletons/FilterSkeleton';

export default function WebsitesLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-8">
      <PageHeaderSkeleton />
      <div className="mt-6">
        <FilterSkeleton />
      </div>
      <div className="mt-8">
        <ProjectGridSkeleton count={6} />
      </div>
    </div>
  );
}
