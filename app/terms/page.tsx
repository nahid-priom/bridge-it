import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { BRANDING } from '@/lib/config/branding';

export const metadata = buildPageMetadata({
  title: 'Terms & Conditions',
  description: `Terms of use for ${BRANDING.appName} websites, software demos, and client services.`,
  path: ROUTES.terms,
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-black text-text-primary">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: September 2026</p>
      <div className="prose-sm mt-8 space-y-4 text-text-secondary leading-relaxed">
        <p>
          By using {BRANDING.appName}, requesting a consultation, or creating an account, you agree to
          these terms.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Services</h2>
        <p>
          We provide custom websites, software solutions, creative marketing, demos, and related
          consulting. Service scope, timelines, and fees are confirmed in quotations or orders before
          work begins.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Accounts</h2>
        <p>
          You are responsible for keeping login credentials secure and for activity under your account.
          Provide accurate contact information so we can deliver project updates.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Demos & content</h2>
        <p>
          Showcase demos and sample screens are for evaluation. Assets and branding remain property of
          {` ${BRANDING.appName}`} or their respective owners unless assigned in a signed agreement.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Contact</h2>
        <p>
          Questions:{' '}
          <a className="text-bridge-primary underline" href={`mailto:${BRANDING.supportEmail}`}>
            {BRANDING.supportEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
