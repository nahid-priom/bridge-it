import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { BRANDING } from '@/lib/config/branding';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: `How ${BRANDING.appName} collects, uses, and protects your information when you browse our site, request a consultation, or use client services.`,
  path: ROUTES.privacy,
});

const UPDATED = '5 September 2026';

const SECTIONS = [
  { id: 'who-we-are', title: 'Who we are' },
  { id: 'information-we-collect', title: 'Information we collect' },
  { id: 'contact-lead-data', title: 'Contact and lead form data' },
  { id: 'account-information', title: 'Account information' },
  { id: 'analytics', title: 'Analytics and usage data' },
  { id: 'cookies', title: 'Cookies and similar technologies' },
  { id: 'advertising', title: 'Advertising and marketing technologies' },
  { id: 'how-we-use', title: 'How we use information' },
  { id: 'service-providers', title: 'Service providers' },
  { id: 'retention', title: 'Data retention' },
  { id: 'security', title: 'Security' },
  { id: 'your-rights', title: 'Your rights' },
  { id: 'international', title: 'International processing' },
  { id: 'children', title: "Children's privacy" },
  { id: 'external-links', title: 'External links' },
  { id: 'updates', title: 'Policy updates' },
  { id: 'contact', title: 'Contact' },
] as const;

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <PageBreadcrumbJsonLd path={ROUTES.privacy} />
      <h1 className="font-display text-3xl font-black text-text-primary md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: {UPDATED}</p>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        This policy explains how {BRANDING.appName} (“we”, “us”) handles information when you use{' '}
        <Link href={ROUTES.home} className="font-medium text-[#2563eb] underline">
          {BRANDING.siteUrl}
        </Link>
        , request a consultation, browse our showrooms, or create a client account.
      </p>

      <nav aria-label="Privacy policy sections" className="mt-8 rounded-2xl border border-border-subtle bg-surface p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Contents</p>
        <ol className="mt-2 columns-1 gap-x-8 text-sm text-text-secondary sm:columns-2">
          {SECTIONS.map((section, index) => (
            <li key={section.id} className="mb-1.5 break-inside-avoid">
              <a href={`#${section.id}`} className="hover:text-[#2563eb]">
                {index + 1}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section id="who-we-are">
          <h2 className="font-display text-lg font-bold text-text-primary">1. Who we are</h2>
          <p className="mt-2">
            {BRANDING.appName} provides custom websites, software solutions, and creative & digital marketing
            services. Contact: {BRANDING.supportEmail}. Office address appears in our site footer.
          </p>
        </section>

        <section id="information-we-collect">
          <h2 className="font-display text-lg font-bold text-text-primary">2. Information we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Details you submit (name, phone, business name, messages).</li>
            <li>Account and project information if you use the client dashboard.</li>
            <li>Technical data such as browser type, device, and approximate location derived from IP.</li>
            <li>Usage analytics if you allow analytics cookies (see below).</li>
          </ul>
        </section>

        <section id="contact-lead-data">
          <h2 className="font-display text-lg font-bold text-text-primary">3. Contact and lead form data</h2>
          <p className="mt-2">
            When you request a free consultation or place a website order inquiry, we collect the fields you
            provide so our team can respond, schedule demos, and prepare proposals. We do not sell lead data.
          </p>
        </section>

        <section id="account-information">
          <h2 className="font-display text-lg font-bold text-text-primary">4. Account information</h2>
          <p className="mt-2">
            If you create an account, we store authentication credentials (handled via our auth provider),
            profile details, and project/order records needed to deliver services.
          </p>
        </section>

        <section id="analytics">
          <h2 className="font-display text-lg font-bold text-text-primary">5. Analytics and usage data</h2>
          <p className="mt-2">
            With your consent, we use <strong>Google Tag Manager</strong> to load analytics tags and{' '}
            <strong>Microsoft Clarity</strong> to understand how visitors use pages (including session
            heatmaps/replays). These tools may process IP address, device identifiers, and on-site behaviour.
            They do not load until you accept Analytics (and Marketing, where applicable) in the cookie banner.
          </p>
        </section>

        <section id="cookies">
          <h2 className="font-display text-lg font-bold text-text-primary">6. Cookies and similar technologies</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Necessary</strong> — session, security, and preference cookies required to run the site.
            </li>
            <li>
              <strong>Analytics</strong> — GTM / Clarity and related measurement cookies when you opt in.
            </li>
            <li>
              <strong>Marketing</strong> — optional tags configured through GTM when you opt in.
            </li>
          </ul>
          <p className="mt-2">
            You can change choices via the cookie banner (or by clearing site data for this domain). Browser
            controls can also block cookies.
          </p>
        </section>

        <section id="advertising">
          <h2 className="font-display text-lg font-bold text-text-primary">7. Advertising and marketing technologies</h2>
          <p className="mt-2">
            Marketing tags (if enabled in GTM) may help measure campaigns. We do not claim use of Google Ads
            conversion tags or Meta Pixel unless those tags are actually configured in your GTM container and
            you have consented to Marketing. Search Console is used for indexing diagnostics and does not place
            advertising cookies on visitors.
          </p>
        </section>

        <section id="how-we-use">
          <h2 className="font-display text-lg font-bold text-text-primary">8. How we use information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Respond to consultations, demos, and support requests.</li>
            <li>Deliver projects, invoices, and client dashboard access.</li>
            <li>Improve site performance, content, and conversion paths.</li>
            <li>Detect abuse and protect accounts.</li>
          </ul>
        </section>

        <section id="service-providers">
          <h2 className="font-display text-lg font-bold text-text-primary">9. Service providers</h2>
          <p className="mt-2">
            We use trusted processors such as hosting/CDN, database/auth (Supabase), email/messaging, and the
            analytics vendors above. They process data only to provide their services to us.
          </p>
        </section>

        <section id="retention">
          <h2 className="font-display text-lg font-bold text-text-primary">10. Data retention</h2>
          <p className="mt-2">
            Lead and project records are kept while an engagement is active and for a reasonable period afterward
            for support, accounting, and legal obligations. Analytics retention follows each vendor’s settings.
          </p>
        </section>

        <section id="security">
          <h2 className="font-display text-lg font-bold text-text-primary">11. Security</h2>
          <p className="mt-2">
            We use HTTPS, access controls, and industry-standard hosting practices. No method of transmission
            is 100% secure; please use strong passwords for accounts.
          </p>
        </section>

        <section id="your-rights">
          <h2 className="font-display text-lg font-bold text-text-primary">12. Your rights</h2>
          <p className="mt-2">
            Depending on applicable law, you may request access, correction, or deletion of personal data we
            hold, or withdraw cookie consent for non-essential tags. Contact {BRANDING.supportEmail}. We may
            need to verify your identity before fulfilling requests.
          </p>
        </section>

        <section id="international">
          <h2 className="font-display text-lg font-bold text-text-primary">13. International processing</h2>
          <p className="mt-2">
            Our primary audience is Bangladesh. Some processors (for example Google or Microsoft) may process
            data in other countries under their own safeguards.
          </p>
        </section>

        <section id="children">
          <h2 className="font-display text-lg font-bold text-text-primary">14. Children&apos;s privacy</h2>
          <p className="mt-2">
            Our services are directed to businesses and adults. We do not knowingly collect personal information
            from children.
          </p>
        </section>

        <section id="external-links">
          <h2 className="font-display text-lg font-bold text-text-primary">15. External links</h2>
          <p className="mt-2">
            Our site may link to third-party sites (social profiles, WhatsApp, partners). Their privacy practices
            are their own.
          </p>
        </section>

        <section id="updates">
          <h2 className="font-display text-lg font-bold text-text-primary">16. Policy updates</h2>
          <p className="mt-2">
            We may update this page to reflect product or legal changes. The “Last updated” date at the top will
            change when we do.
          </p>
        </section>

        <section id="contact">
          <h2 className="font-display text-lg font-bold text-text-primary">17. Contact</h2>
          <p className="mt-2">
            Privacy questions:{' '}
            <a className="font-medium text-[#2563eb] underline" href={`mailto:${BRANDING.supportEmail}`}>
              {BRANDING.supportEmail}
            </a>
            . Or request a{' '}
            <Link href={ROUTES.consultation} className="font-medium text-[#2563eb] underline">
              free consultation
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
