'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function SoftwareDemoError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-xl font-black mb-2">Demo unavailable</h1>
      <p className="text-text-secondary mb-6">This demo could not be loaded. It may not be configured yet.</p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="deshi-btn-primary px-5 py-2 text-sm font-bold">Retry</button>
        <Link href={ROUTES.softwareShowroom} className="deshi-btn-outline px-5 py-2 text-sm font-semibold">Back to Showroom</Link>
      </div>
    </div>
  );
}
