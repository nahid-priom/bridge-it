'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function DemoError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-black mb-2">Demo unavailable</h1>
        <p className="text-text-secondary mb-6">We couldn&apos;t load this demo. Please try again.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="deshi-btn-primary px-6 py-3 font-bold">Retry</button>
          <Link href={ROUTES.ecommerceShowroom} className="deshi-btn-outline px-6 py-3 font-semibold">Back to showroom</Link>
        </div>
      </div>
    </div>
  );
}
