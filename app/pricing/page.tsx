import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { PageHero } from '@/components/ui/PageHero';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { ROUTES } from '@/lib/routes';
import { CATALOG_PACKAGE_TIERS } from '@/src/features/ecommerce-showcase/config/constants';
import { formatBdt } from '@/lib/services/client';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Project Scope & Packages',
  description:
    'Understand how Bridge IT Park scopes custom websites, software solutions, and creative marketing — with starting website packages where published and custom quotes for software.',
  path: ROUTES.pricing,
});

const PILLARS = [
  {
    title: 'Custom Website',
    body: 'E-commerce and business websites scoped to your industry. Browse published designs, then confirm pages, integrations, and launch plan in a free consultation.',
    href: ROUTES.websites,
    cta: 'Explore website designs',
  },
  {
    title: 'Software Solution',
    body: 'ERP, POS, CRM, HRM and industry systems are delivered as custom implementations. Pricing depends on modules, users, and integrations — we quote after scope discovery.',
    href: ROUTES.softwareShowroom,
    cta: 'Browse software solutions',
    note: 'Based on scope · Custom quote',
  },
  {
    title: 'Creative & Digital Marketing',
    body: 'Branding, social creatives, Meta ads, and growth retainers. Packages vary by deliverables and monthly management needs.',
    href: ROUTES.creativeMarketingShowroom,
    cta: 'View creative services',
  },
] as const;

export default function PricingPage() {
  return (
    <div className="pb-16">
      <PageBreadcrumbJsonLd path={ROUTES.pricing} />
      <PageHero
        variant="marketing"
        title="Project Scope"
        highlightedText="& Packages."
        subtitle="Starting website packages where published. Software and custom work are quoted from real scope — not misleading fixed prices."
      />

      <div className="container mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="flex flex-col rounded-2xl border border-border-subtle bg-surface p-6"
            >
              <h2 className="font-display text-xl font-black text-text-primary">{pillar.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{pillar.body}</p>
              {'note' in pillar && pillar.note ? (
                <p className="mt-3 text-sm font-semibold text-[#2563eb]">{pillar.note}</p>
              ) : null}
              <Link
                href={pillar.href}
                className="mt-4 text-sm font-semibold text-[#2563eb] hover:underline"
              >
                {pillar.cta} →
              </Link>
            </article>
          ))}
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-text-primary">
            Website starting packages
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Indicative catalog tiers for e-commerce websites. Final price depends on customization,
            content, and integrations confirmed in your proposal.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {CATALOG_PACKAGE_TIERS.map((tier) => (
              <article
                key={tier.key}
                className="rounded-2xl border border-border-subtle bg-surface p-5"
              >
                <h3 className="font-bold text-text-primary">{tier.name}</h3>
                <p className="mt-2 text-2xl font-black text-text-primary">
                  {formatBdt(tier.price)}
                  {tier.plus ? '+' : ''}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border-subtle bg-surface px-6 py-8 text-center md:px-10">
          <h2 className="font-display text-xl font-black text-text-primary">Need a custom quote?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            Tell us about your business — we will recommend the right website, software, or marketing
            package without pressure pricing.
          </p>
          <Link
            href={ROUTES.consultation}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
          >
            Request free consultation
          </Link>
        </section>
      </div>
    </div>
  );
}
