'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function EcommerceShowroomError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('E-commerce showroom error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <h1 className="text-2xl font-black mb-2">Something went wrong</h1>
      <p className="text-text-secondary mb-6">We couldn&apos;t load the e-commerce showroom. Please try again.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button type="button" onClick={reset} className="deshi-btn-primary px-6 py-3 font-bold">
          Try again
        </button>
        <Link href={ROUTES.solutions} className="deshi-btn-outline px-6 py-3 font-semibold">
          Browse all solutions
        </Link>
      </div>
    </div>
  );
}
