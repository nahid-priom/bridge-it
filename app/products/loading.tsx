import { PageHeaderSkeleton } from '@/src/components/skeletons/PageHeaderSkeleton';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10">
      <PageHeaderSkeleton />
      <div className="mt-8">
        <ProjectGridSkeleton count={6} />
      </div>
    </div>
  );
}
