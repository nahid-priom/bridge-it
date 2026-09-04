import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { BRANDING } from '@/lib/config/branding';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page does not exist on Bridge IT Park.',
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: ROUTES.home, label: 'Home' },
  { href: ROUTES.websites, label: 'Websites' },
  { href: ROUTES.softwareShowroom, label: 'Software' },
  { href: ROUTES.creativeMarketingShowroom, label: 'Creative & Marketing' },
  { href: ROUTES.consultation, label: 'Consultation' },
] as const;

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-24">
      <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">404</p>
        <h1 className="mt-2 font-display text-3xl font-black text-text-primary">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          This URL is not available on {BRANDING.appName}. Try one of these popular destinations:
        </p>
        <nav aria-label="Helpful links" className="mt-6 flex flex-wrap justify-center gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border-subtle px-3.5 py-2 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href={ROUTES.home}
          className="mt-6 inline-flex rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
