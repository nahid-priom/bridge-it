'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/**
 * Root error UI — must define its own <html>/<body> (replaces root layout when active).
 */
export default function GlobalError({
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
    <html lang="en">
      <body className="font-sans antialiased bg-background text-text-primary min-h-screen flex items-center justify-center px-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-10 text-center max-w-md shadow-lg">
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
              className="px-6 py-3 border border-border-subtle rounded-xl text-text-primary font-semibold text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
