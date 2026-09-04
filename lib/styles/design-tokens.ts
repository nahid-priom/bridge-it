/**
 * Global design tokens — typography, spacing, hero system.
 */
export const COLORS = {
  primary: '#00A85A',
  primaryDark: '#059669',
  accent: '#2563EB',
  accentViolet: '#0EA5E9',
  ink: '#080B16',
  muted: '#4B5563',
} as const;

export const heroTypography = {
  /** Marketing H1 — homepage master scale */
  h1Line:
    'block font-display font-black tracking-tight leading-[1.08] text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]',
  h1Ink: 'text-[#080B16] dark:text-white',
  h1Accent: 'text-[#00A85A] dark:text-emerald-300',
  h1Script:
    'hero-script-line block text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.25rem] xl:text-[4.75rem] text-[#0EA5E9] dark:text-sky-200 leading-[1.05]',
  subtitle:
    'mx-auto max-w-[600px] text-base sm:text-[17px] lg:text-lg text-[#4B5563] dark:text-slate-200 leading-relaxed',
  eyebrow:
    'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/15 shadow-sm text-sm font-semibold text-[#00A85A] dark:text-emerald-300',
  /** Search results / marketplace search hero */
  searchHeading:
    'font-display font-black tracking-tight leading-[1.12] text-xl sm:text-2xl md:text-[1.625rem]',
  /** Dashboard / interior pages */
  dashboardHeading:
    'font-display font-black tracking-tight leading-[1.05] text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem]',
  /** Compact page heroes (onboarding, listing headers) */
  compactHeading:
    'font-display font-bold tracking-tight leading-[1.15] text-xl sm:text-2xl md:text-[1.625rem] lg:text-[1.875rem]',
  pageHeading:
    'font-display font-extrabold tracking-tight leading-tight text-2xl md:text-3xl lg:text-4xl',
  sectionHeading: 'font-display font-bold tracking-tight text-xl md:text-2xl',
} as const;

const heroEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const heroMotion = {
  ease: heroEase,
  fadeUp: (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: heroEase },
  }),
  fadeDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: heroEase },
  },
};

export const sectionSpacing = {
  hero: 'pt-[calc(var(--header-offset)+2.5rem)] pb-12 md:pb-16',
  heroCompact: 'pt-[calc(var(--header-offset)+1.25rem)] pb-6 md:pb-8',
  searchHero: 'pt-[calc(var(--header-offset)+0.5rem)] pb-4 md:pb-5',
  dashboardHero: 'pt-[calc(var(--header-offset)+1.5rem)] pb-6 md:pb-8',
} as const;
