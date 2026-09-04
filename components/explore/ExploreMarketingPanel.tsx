import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export function ExploreMarketingPanel() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-8 sm:px-8 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb] dark:text-[#60a5fa]">
        Creative Design + Performance Marketing
      </p>
      <h2 className="mt-2 font-display text-2xl font-black text-text-primary md:text-3xl">
        Creative &amp; Digital Marketing
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
        আপনার Brand-এর Design থেকে Digital Marketing - সব একসাথে। Social creatives, branding, Meta ads
        and growth services in one place.
      </p>
      <ul className="mt-5 grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
        <li>• Social media &amp; ad creatives</li>
        <li>• Branding &amp; packaging design</li>
        <li>• Facebook / Instagram ads management</li>
        <li>• E-commerce marketing &amp; lead generation</li>
      </ul>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={ROUTES.creativeMarketingShowroom}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
        >
          Explore Creative &amp; Marketing
        </Link>
        <Link
          href={ROUTES.consultation}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border-subtle px-6 text-sm font-semibold"
        >
          Free Consultation
        </Link>
      </div>
    </div>
  );
}
