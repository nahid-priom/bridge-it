import { DashboardSkeleton } from '@/src/components/skeletons/DashboardSkeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-bridge-dark text-white">
      <DashboardSkeleton />
    </div>
  );
}
