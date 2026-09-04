import Link from 'next/link';
import { Briefcase, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { HOME_CTA } from '@/data/homeContent';
import { cn, focusVisibleRing } from '@/lib/cn';

export function HomeCtaBanner() {
  return (
    <section
      className="scroll-mt-[calc(var(--header-offset)+0.75rem)] py-12 md:py-16 lg:py-20"
      aria-labelledby="home-cta-heading"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div className="deshi-cta-banner relative overflow-hidden rounded-3xl px-6 py-8 md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-20 md:right-12 md:opacity-30"
            aria-hidden
          >
            <div className="relative h-32 w-32 md:h-48 md:w-48">
              <div className="absolute inset-0 rotate-12 rounded-3xl bg-white/20" />
              <Briefcase className="absolute inset-0 m-auto h-16 w-16 text-white md:h-24 md:w-24" />
              <div className="absolute -top-4 -right-4 h-16 w-12 rotate-[-8deg] rounded-lg bg-white/15" />
              <div className="absolute -bottom-2 left-0 h-10 w-14 rotate-[6deg] rounded-lg bg-white/10" />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2
              id="home-cta-heading"
              className="mb-3 font-display text-xl font-black leading-tight text-white md:text-3xl"
            >
              {HOME_CTA.title}
            </h2>
            <p className="mb-6 text-sm text-white/90 md:text-base">{HOME_CTA.subtitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.solutions}
                className={cn(
                  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-deshi-green-dark transition-colors hover:bg-white/95',
                  focusVisibleRing
                )}
              >
                Explore Solutions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={ROUTES.consultation}
                className={cn(
                  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-white px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10',
                  focusVisibleRing
                )}
              >
                Get Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
