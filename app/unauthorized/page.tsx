import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Unauthorized',
  path: '/unauthorized',
  noIndex: true,
});

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center rounded-3xl border border-border-subtle bg-surface/90 backdrop-blur-xl p-8 shadow-xl">
        <ShieldAlert className="w-12 h-12 text-bridge-accent mx-auto mb-4" aria-hidden />
        <h1 className="text-2xl font-black font-display text-text-primary mb-2">Access denied</h1>
        <p className="text-sm text-text-secondary mb-6">
          You do not have permission to view this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold text-sm"
          >
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl border border-border-subtle text-text-primary font-semibold text-sm hover:bg-background-soft"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
