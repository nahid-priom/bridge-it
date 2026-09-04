import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { BRANDING } from '@/lib/config/branding';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Terms & Conditions',
  description: `Terms of use for ${BRANDING.appName} websites, software showcases, creative marketing services, demos, and client engagements.`,
  path: ROUTES.terms,
});

const UPDATED = '5 September 2026';

const SECTIONS = [
  { id: 'overview', title: 'Service overview' },
  { id: 'quotes', title: 'Quotes and proposals' },
  { id: 'scope', title: 'Project scope' },
  { id: 'client-responsibilities', title: 'Client responsibilities' },
  { id: 'payment', title: 'Payment terms' },
  { id: 'revisions', title: 'Revisions and change requests' },
  { id: 'timelines', title: 'Delivery timelines' },
  { id: 'third-party', title: 'Third-party services' },
  { id: 'domains-hosting', title: 'Domains, hosting, and API costs' },
  { id: 'ip', title: 'Intellectual property' },
  { id: 'client-materials', title: 'Client-provided materials' },
  { id: 'prohibited', title: 'Prohibited use' },
  { id: 'support', title: 'Maintenance and support' },
  { id: 'availability', title: 'Service availability' },
  { id: 'liability', title: 'Limitation of liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'refunds', title: 'Refunds and cancellation' },
  { id: 'changes', title: 'Changes to these terms' },
  { id: 'contact', title: 'Governing and contact' },
] as const;

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8">
      <PageBreadcrumbJsonLd path={ROUTES.terms} />
      <h1 className="font-display text-3xl font-black text-text-primary md:text-4xl">
        Terms & Conditions
      </h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: {UPDATED}</p>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        By using {BRANDING.appName}, browsing our showrooms, requesting a consultation, or creating an
        account, you agree to these terms. If you do not agree, please do not use the site or services.
      </p>

      <nav aria-label="Terms sections" className="mt-8 rounded-2xl border border-border-subtle bg-surface p-4">
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
        <section id="overview">
          <h2 className="font-display text-lg font-bold text-text-primary">1. Service overview</h2>
          <p className="mt-2">
            We provide custom websites, software solutions, creative & digital marketing, demos, and related
            consulting. Showcase content is illustrative unless a signed agreement says otherwise.
          </p>
        </section>

        <section id="quotes">
          <h2 className="font-display text-lg font-bold text-text-primary">2. Quotes and proposals</h2>
          <p className="mt-2">
            Prices, timelines, and deliverables in proposals are estimates until both parties confirm scope in
            writing (email, quotation acceptance, or contract). Verbal discussions are not binding alone.
          </p>
        </section>

        <section id="scope">
          <h2 className="font-display text-lg font-bold text-text-primary">3. Project scope</h2>
          <p className="mt-2">
            Work is limited to the agreed scope. Features, pages, integrations, or revisions outside scope may
            require a change request and adjusted fees or timelines.
          </p>
        </section>

        <section id="client-responsibilities">
          <h2 className="font-display text-lg font-bold text-text-primary">4. Client responsibilities</h2>
          <p className="mt-2">
            You agree to provide timely content, feedback, access credentials, and approvals. Delays on the
            client side may extend delivery dates.
          </p>
        </section>

        <section id="payment">
          <h2 className="font-display text-lg font-bold text-text-primary">5. Payment terms</h2>
          <p className="mt-2">
            Payment schedules (for example deposits and milestones) are defined per project. Late payment may
            pause work. Public “starting from” figures on the site are indicative where shown; software and
            custom work are typically scoped as custom quotes.
          </p>
        </section>

        <section id="revisions">
          <h2 className="font-display text-lg font-bold text-text-primary">6. Revisions and change requests</h2>
          <p className="mt-2">
            Reasonable revisions within the agreed round(s) are included. Material new requirements are billed
            separately after confirmation.
          </p>
        </section>

        <section id="timelines">
          <h2 className="font-display text-lg font-bold text-text-primary">7. Delivery timelines</h2>
          <p className="mt-2">
            Timelines depend on scope clarity and client responsiveness. We do not guarantee specific search
            rankings, ad ROAS, or revenue outcomes.
          </p>
        </section>

        <section id="third-party">
          <h2 className="font-display text-lg font-bold text-text-primary">8. Third-party services</h2>
          <p className="mt-2">
            Projects may rely on third-party platforms (hosting, payment gateways, Meta ads, courier APIs,
            etc.). Their terms and uptime are outside our control.
          </p>
        </section>

        <section id="domains-hosting">
          <h2 className="font-display text-lg font-bold text-text-primary">9. Domains, hosting, and API costs</h2>
          <p className="mt-2">
            Domain registration, hosting, SMS, payment gateway fees, ad spend, and similar pass-through costs
            are the client’s responsibility unless a proposal explicitly includes them.
          </p>
        </section>

        <section id="ip">
          <h2 className="font-display text-lg font-bold text-text-primary">10. Intellectual property</h2>
          <p className="mt-2">
            Upon full payment, clients typically receive agreed license or ownership of project deliverables as
            stated in the proposal. Our demos, unused concepts, frameworks, and brand assets remain ours unless
            assigned in writing.
          </p>
        </section>

        <section id="client-materials">
          <h2 className="font-display text-lg font-bold text-text-primary">11. Client-provided materials</h2>
          <p className="mt-2">
            You confirm you have rights to materials you supply (logos, photos, copy). You are responsible for
            claims arising from content you provide.
          </p>
        </section>

        <section id="prohibited">
          <h2 className="font-display text-lg font-bold text-text-primary">12. Prohibited use</h2>
          <p className="mt-2">
            Do not misuse the site or demos to attack systems, scrape at abusive rates, impersonate others, or
            host illegal content.
          </p>
        </section>

        <section id="support">
          <h2 className="font-display text-lg font-bold text-text-primary">13. Maintenance and support</h2>
          <p className="mt-2">
            Ongoing maintenance, hosting management, or ad management is included only when stated in an active
            agreement or retainer.
          </p>
        </section>

        <section id="availability">
          <h2 className="font-display text-lg font-bold text-text-primary">14. Service availability</h2>
          <p className="mt-2">
            We aim for reliable access to this website and demos but do not warrant uninterrupted availability.
          </p>
        </section>

        <section id="liability">
          <h2 className="font-display text-lg font-bold text-text-primary">15. Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, {BRANDING.appName} is not liable for indirect, incidental,
            or consequential damages (including lost profits) arising from use of the site or services. Our
            aggregate liability for a project is limited to fees paid for that project in the preceding three
            months, except where liability cannot be limited by law.
          </p>
        </section>

        <section id="termination">
          <h2 className="font-display text-lg font-bold text-text-primary">16. Termination</h2>
          <p className="mt-2">
            Either party may end an engagement as described in the proposal. We may suspend access for unpaid
            invoices or prohibited use.
          </p>
        </section>

        <section id="refunds">
          <h2 className="font-display text-lg font-bold text-text-primary">17. Refunds and cancellation</h2>
          <p className="mt-2">
            Deposits for work already started are generally non-refundable. Unused prepaid balances, if any,
            are handled case-by-case as written in the proposal.
          </p>
        </section>

        <section id="changes">
          <h2 className="font-display text-lg font-bold text-text-primary">18. Changes to these terms</h2>
          <p className="mt-2">
            We may update these terms. Continued use of the site after updates constitutes acceptance of the
            revised terms for site use. Active project contracts control those engagements.
          </p>
        </section>

        <section id="contact">
          <h2 className="font-display text-lg font-bold text-text-primary">19. Governing and contact</h2>
          <p className="mt-2">
            These terms are interpreted under the laws of Bangladesh unless a signed contract specifies
            otherwise. Questions:{' '}
            <a className="font-medium text-[#2563eb] underline" href={`mailto:${BRANDING.supportEmail}`}>
              {BRANDING.supportEmail}
            </a>
            . See also our{' '}
            <Link href={ROUTES.privacy} className="font-medium text-[#2563eb] underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
