import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { BRANDING } from '@/lib/config/branding';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-10 text-center max-w-md border border-border-subtle">
        <h1 className="text-4xl font-black font-display text-text-primary mb-2">404</h1>
        <p className="text-text-muted mb-6">Page not found on {BRANDING.appName}.</p>
        <Link
          href={ROUTES.home}
          className="inline-flex px-6 py-3 bg-gradient-to-r from-bridge-primary to-bridge-primary-light rounded-xl text-white font-semibold text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
