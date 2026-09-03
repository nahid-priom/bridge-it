import { PageHeaderSkeleton } from '@/src/components/skeletons/PageHeaderSkeleton';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';
import { FilterSkeleton } from '@/src/components/skeletons/FilterSkeleton';

export default function WebsitesLoading() {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-3 sm:px-6 sm:pt-4 lg:px-8 xl:px-10">
      <PageHeaderSkeleton />
      <div className="mt-5">
        <FilterSkeleton />
      </div>
      <div className="mt-6">
        <ProjectGridSkeleton count={6} />
      </div>
    </div>
  );
}
