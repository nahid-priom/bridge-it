import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { BRAND_ASSETS } from '@/lib/config/brand-assets';
import { ROUTES } from '@/lib/routes';

export type BridgeLogoVariant = 'nav' | 'navSm' | 'footer' | 'full' | 'mark' | 'auth';

type BridgeLogoProps = {
  /** @deprecated Text is baked into logo image */
  showText?: boolean;
  /** @deprecated Use variant instead */
  textVisibility?: 'always' | 'sm' | 'never';
  className?: string;
  /** @deprecated Use variant instead */
  iconSize?: 'sm' | 'md' | 'nav';
  variant?: BridgeLogoVariant;
  href?: string | false;
  priority?: boolean;
};

const VARIANT_CONFIG: Record<
  BridgeLogoVariant,
  { src: string; width: number; height: number; className?: string }
> = {
  nav: { src: BRAND_ASSETS.logo.nav, width: 200, height: 56, className: 'h-10 sm:h-11 md:h-12 w-auto' },
  navSm: { src: BRAND_ASSETS.logo.navSm, width: 160, height: 44, className: 'h-9 w-auto' },
  footer: { src: BRAND_ASSETS.logo.footer, width: 220, height: 64, className: 'h-14 w-auto' },
  full: { src: BRAND_ASSETS.logo.transparent, width: 280, height: 280, className: 'h-32 w-auto max-w-[280px]' },
  mark: { src: BRAND_ASSETS.icons.markTransparent, width: 48, height: 48, className: 'h-10 w-10' },
  auth: { src: BRAND_ASSETS.logo.transparent, width: 200, height: 200, className: 'h-24 sm:h-28 w-auto' },
};

function resolveVariant(iconSize?: BridgeLogoProps['iconSize'], variant?: BridgeLogoVariant): BridgeLogoVariant {
  if (variant) return variant;
  if (iconSize === 'nav') return 'nav';
  if (iconSize === 'sm') return 'navSm';
  return 'nav';
}

export function BridgeLogo({
  className,
  iconSize,
  variant,
  href = ROUTES.home,
  priority = false,
}: BridgeLogoProps) {
  const resolved = resolveVariant(iconSize, variant);
  const config = VARIANT_CONFIG[resolved];

  const image = (
    <Image
      src={config.src}
      alt="Bridge IT Park — Build. Market. Grow."
      width={config.width}
      height={config.height}
      priority={priority}
      className={cn('object-contain object-left shrink-0', config.className)}
      style={{ maxHeight: '100%' }}
    />
  );

  if (href === false) {
    return <div className={cn('inline-flex items-center min-w-0', className)}>{image}</div>;
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-lg',
        className
      )}
      aria-label="Bridge IT Park — home"
    >
      {image}
    </Link>
  );
}
