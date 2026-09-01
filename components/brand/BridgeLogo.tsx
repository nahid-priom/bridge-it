import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { BRAND_ASSETS } from '@/lib/config/brand-assets';
import { ROUTES } from '@/lib/routes';

export type BridgeLogoVariant = 'nav' | 'navSm' | 'footer' | 'full' | 'mark' | 'auth';
export type BridgeLogoTheme = 'light' | 'dark' | 'auto';

type BridgeLogoProps = {
  /** @deprecated Text is baked into logo image */
  showText?: boolean;
  /** @deprecated Use variant instead */
  textVisibility?: 'always' | 'sm' | 'never';
  className?: string;
  /** @deprecated Use variant instead */
  iconSize?: 'sm' | 'md' | 'nav';
  variant?: BridgeLogoVariant;
  /** Force light (circular) or dark (wordmark) logo regardless of page theme */
  theme?: BridgeLogoTheme;
  href?: string | false;
  priority?: boolean;
};

type VariantConfig = {
  src: string;
  srcDark: string;
  width: number;
  height: number;
  className?: string;
};

const VARIANT_CONFIG: Record<BridgeLogoVariant, VariantConfig> = {
  nav: {
    src: BRAND_ASSETS.logo.nav,
    srcDark: BRAND_ASSETS.logo.navDark,
    width: 240,
    height: 48,
    className: 'h-10 sm:h-11 md:h-12 w-auto',
  },
  navSm: {
    src: BRAND_ASSETS.logo.navSm,
    srcDark: BRAND_ASSETS.logo.navSmDark,
    width: 180,
    height: 36,
    className: 'h-9 w-auto',
  },
  footer: {
    src: BRAND_ASSETS.logo.footer,
    srcDark: BRAND_ASSETS.logo.footerDark,
    width: 280,
    height: 64,
    className: 'h-14 w-auto',
  },
  full: {
    src: BRAND_ASSETS.logo.transparent,
    srcDark: BRAND_ASSETS.logo.transparentDark,
    width: 280,
    height: 280,
    className: 'h-32 w-auto max-w-[280px]',
  },
  mark: {
    src: BRAND_ASSETS.icons.markTransparent,
    srcDark: BRAND_ASSETS.icons.markDark,
    width: 48,
    height: 48,
    className: 'h-10 w-10',
  },
  auth: {
    src: BRAND_ASSETS.logo.transparent,
    srcDark: BRAND_ASSETS.logo.authDark,
    width: 320,
    height: 112,
    className: 'h-24 sm:h-28 w-auto',
  },
};

function resolveVariant(iconSize?: BridgeLogoProps['iconSize'], variant?: BridgeLogoVariant): BridgeLogoVariant {
  if (variant) return variant;
  if (iconSize === 'nav') return 'nav';
  if (iconSize === 'sm') return 'navSm';
  return 'nav';
}

function LogoImage({
  src,
  width,
  height,
  priority,
  className,
}: {
  src: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt="Bridge IT Park — Build. Market. Grow."
      width={width}
      height={height}
      priority={priority}
      className={cn('object-contain object-left shrink-0', className)}
      style={{ maxHeight: '100%' }}
    />
  );
}

export function BridgeLogo({
  className,
  iconSize,
  variant,
  theme = 'auto',
  href = ROUTES.home,
  priority = false,
}: BridgeLogoProps) {
  const resolved = resolveVariant(iconSize, variant);
  const config = VARIANT_CONFIG[resolved];

  const image =
    theme === 'dark' ? (
      <LogoImage
        src={config.srcDark}
        width={config.width}
        height={config.height}
        priority={priority}
        className={config.className}
      />
    ) : theme === 'light' ? (
      <LogoImage
        src={config.src}
        width={config.width}
        height={config.height}
        priority={priority}
        className={config.className}
      />
    ) : (
      <>
        <LogoImage
          src={config.src}
          width={config.width}
          height={config.height}
          priority={priority}
          className={cn(config.className, 'dark:hidden')}
        />
        <LogoImage
          src={config.srcDark}
          width={config.width}
          height={config.height}
          priority={priority}
          className={cn(config.className, 'hidden dark:block')}
        />
      </>
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
