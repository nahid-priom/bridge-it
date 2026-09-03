import { EcommerceHeroContent } from './EcommerceHeroContent';
import { EcommerceHeroShowcase } from './EcommerceHeroShowcase';

export function EcommerceHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_12%_0%,rgba(37,99,235,0.16),transparent_55%),radial-gradient(700px_circle_at_88%_20%,rgba(37,99,235,0.08),transparent_50%)]"
      />
      <div className="relative mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.15rem)] pb-0 sm:px-6 lg:px-8 lg:pt-[calc(var(--header-offset)+0.75rem)] lg:pb-8 xl:px-10">
        <div className="grid min-w-0 grid-cols-1 items-center gap-0 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <EcommerceHeroContent className="min-w-0" />
          <EcommerceHeroShowcase className="min-w-0" />
        </div>
      </div>
    </section>
  );
}
