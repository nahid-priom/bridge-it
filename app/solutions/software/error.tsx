'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function SoftwareShowroomError({ reset }: { reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-black mb-2">Could not load software solutions</h1>
      <p className="text-text-secondary mb-6">Please try again or browse other solutions.</p>
      <div className="flex gap-3 justify-center">
        <button type="button" onClick={reset} className="deshi-btn-primary px-6 py-2 font-bold">Retry</button>
        <Link href={ROUTES.solutions} className="deshi-btn-outline px-6 py-2 font-semibold">All Solutions</Link>
      </div>
    </div>
  );
}
