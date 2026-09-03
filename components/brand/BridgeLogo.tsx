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
  /** Force light or dark logo, or follow the site theme switcher */
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

const WORDMARK = {
  src: BRAND_ASSETS.logo.light,
  srcDark: BRAND_ASSETS.logo.dark,
  width: 381,
  height: 115,
} as const;

const VARIANT_CONFIG: Record<BridgeLogoVariant, VariantConfig> = {
  nav: {
    ...WORDMARK,
    className: 'h-10 sm:h-11 md:h-12 w-auto',
  },
  navSm: {
    ...WORDMARK,
    className: 'h-9 w-auto',
  },
  footer: {
    ...WORDMARK,
    className: 'h-14 w-auto',
  },
  full: {
    ...WORDMARK,
    className: 'h-20 w-auto max-w-[320px]',
  },
  mark: {
    src: BRAND_ASSETS.icons.markTransparent,
    srcDark: BRAND_ASSETS.icons.markDark,
    width: 115,
    height: 115,
    className: 'h-10 w-10',
  },
  auth: {
    ...WORDMARK,
    className: 'h-16 sm:h-20 w-auto',
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
        <span className="contents dark:hidden">
          <LogoImage
            src={config.src}
            width={config.width}
            height={config.height}
            priority={priority}
            className={config.className}
          />
        </span>
        <span className="hidden dark:contents">
          <LogoImage
            src={config.srcDark}
            width={config.width}
            height={config.height}
            priority={priority}
            className={config.className}
          />
        </span>
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
