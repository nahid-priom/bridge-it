import { KPISkeleton } from '@/src/components/skeletons/KPISkeleton';
import { DataTableSkeleton } from '@/src/components/skeletons/DataTableSkeleton';
import { PageHeaderSkeleton } from '@/src/components/skeletons/PageHeaderSkeleton';

export default function EcommerceProjectsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeaderSkeleton />
      <KPISkeleton count={4} />
      <DataTableSkeleton columns={6} rows={8} />
    </div>
  );
}
