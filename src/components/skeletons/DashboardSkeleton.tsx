import { KPISkeleton } from './KPISkeleton';
import { DataTableSkeleton } from './DataTableSkeleton';
import { PageHeaderSkeleton } from './PageHeaderSkeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6" aria-busy="true" aria-label="Loading dashboard">
      <PageHeaderSkeleton />
      <KPISkeleton count={4} />
      <DataTableSkeleton columns={5} rows={6} />
    </div>
  );
}
