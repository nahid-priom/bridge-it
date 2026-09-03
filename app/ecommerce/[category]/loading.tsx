import { PageHeaderSkeleton } from '@/src/components/skeletons/PageHeaderSkeleton';
import { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';

export default function EcommerceCategoryLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
      <PageHeaderSkeleton />
      <div className="mt-8">
        <ProjectGridSkeleton count={6} />
      </div>
    </div>
  );
}
