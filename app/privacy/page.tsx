import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { BRANDING } from '@/lib/config/branding';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: `How ${BRANDING.appName} collects, uses, and protects your information.`,
  path: ROUTES.privacy,
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-black text-text-primary">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: September 2026</p>
      <div className="prose-sm mt-8 space-y-4 text-text-secondary leading-relaxed">
        <p>
          {BRANDING.appName} (“we”, “us”) provides websites, software solutions, and creative marketing
          services. This policy explains what information we collect when you use our website, request a
          consultation, or create an account.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Information we collect</h2>
        <p>
          Contact details you submit (name, phone, email, business name), consultation messages, account
          credentials, and order/project information needed to deliver our services.
        </p>
        <h2 className="text-lg font-bold text-text-primary">How we use information</h2>
        <p>
          To respond to consultation requests, provide demos and services, manage your client dashboard,
          improve our products, and communicate important updates.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with trusted processors (hosting,
          payments, messaging) solely to operate the platform.
        </p>
        <h2 className="text-lg font-bold text-text-primary">Contact</h2>
        <p>
          Questions about privacy: {' '}
          <a className="text-bridge-primary underline" href={`mailto:${BRANDING.supportEmail}`}>
            {BRANDING.supportEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
