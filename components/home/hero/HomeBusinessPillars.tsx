import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

const PILLARS = [
  {
    title: 'Custom Websites',
    tagline: 'Premium e-commerce & business sites',
    meta: 'Browse custom storefront designs ready for your brand — preview, pick a style, and launch with confidence.',
    href: `${ROUTES.explore}?type=websites`,
    cta: 'Explore Websites',
    tint: 'from-[#DBEAFE]/70 to-surface dark:from-bridge-primary/15',
    image: {
      avif: '/assets/categories/websites-category.avif',
      webp: '/assets/categories/websites-category.webp',
      alt: 'Laptop and phone showing a premium e-commerce storefront',
    },
  },
  {
    title: 'Software Solutions',
    tagline: 'ERP, POS, CRM, HRM & custom apps',
    meta: 'Business software built around real operations — manage sales, inventory, people, and workflows in one place.',
    href: `${ROUTES.explore}?type=software`,
    cta: 'Explore Software',
    tint: 'from-[#CFFAFE]/70 to-surface dark:from-bridge-cyan/15',
    image: {
      avif: '/assets/categories/software-category.avif',
      webp: '/assets/categories/software-category.webp',
      alt: 'Monitor and phone showing an ERP dashboard with KPIs',
    },
  },
  {
    title: 'Creative & Digital Marketing',
    tagline: 'Design, ads & growth marketing',
    meta: 'Creative design, social content, and Meta ads managed together so your brand stays consistent and converts.',
    href: `${ROUTES.explore}?type=marketing`,
    cta: 'Explore Marketing',
    tint: 'from-[#D1FAE5]/70 to-surface dark:from-bridge-secondary/15',
    image: {
      avif: '/assets/categories/creative-marketing-category.avif',
      webp: '/assets/categories/creative-marketing-category.webp',
      alt: 'Creative campaign cards with ads and analytics visuals',
    },
  },
] as const;

export function HomeBusinessPillars() {
  return (
    <section
      id="business-solutions"
      aria-labelledby="business-solutions-heading"
      className="scroll-mt-[calc(var(--header-offset)+0.75rem)] border-y border-border-subtle bg-background-soft/40 py-8 md:py-12"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-6 mx-auto max-w-3xl text-center md:mb-8 md:mx-0 md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb] dark:text-[#60a5fa]">
            WHAT WE BUILD
          </p>
          <h2
            id="business-solutions-heading"
            className="mt-1 font-display text-2xl font-black text-text-primary md:text-3xl"
          >
            Everything Your Business Needs to Grow
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className={cn(
                'group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
                'transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2563eb]/45',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              <div
                className={cn(
                  'relative aspect-[16/10] w-full max-h-[148px] shrink-0 overflow-hidden bg-gradient-to-b sm:max-h-[168px]',
                  pillar.tint
                )}
              >
                <picture>
                  <source srcSet={pillar.image.avif} type="image/avif" />
                  <source srcSet={pillar.image.webp} type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.image.webp}
                    alt={pillar.image.alt}
                    width={900}
                    height={560}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain object-center p-3 transition-transform duration-500 group-hover:scale-[1.03] sm:p-3.5"
                  />
                </picture>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-3 text-center sm:px-5 sm:pb-5 md:text-left">
                <h3 className="font-display text-base font-bold tracking-[-0.01em] text-text-primary sm:text-lg">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa]">
                  {pillar.tagline}
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-text-secondary sm:text-sm sm:leading-relaxed">
                  {pillar.meta}
                </p>
                <span className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa] md:justify-start">
                  {pillar.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
