import { DataTableSkeleton } from '@/src/components/skeletons/DataTableSkeleton';
import { PageHeaderSkeleton } from '@/src/components/skeletons/PageHeaderSkeleton';

export default function EcommerceLeadsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeaderSkeleton />
      <DataTableSkeleton columns={5} rows={8} />
    </div>
  );
}
