import { FormSkeleton } from '@/src/components/skeletons/FormSkeleton';

export default function EcommerceProjectNewLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <FormSkeleton fields={6} withPreview />
    </div>
  );
}
