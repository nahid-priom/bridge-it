'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-10 text-center max-w-md border border-border-subtle">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h1>
        <p className="text-text-muted text-sm mb-6">
          We could not load this page. Please try again or return to the marketplace home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light rounded-xl text-white font-semibold text-sm cursor-pointer"
          >
            Try again
          </button>
          <Link
            href={ROUTES.home}
            className="px-6 py-3 glass border border-border-subtle rounded-xl text-text-primary font-semibold text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
