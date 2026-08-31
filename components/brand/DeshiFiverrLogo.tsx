/**
 * @deprecated Use BridgeLogo — kept for backward compatibility during migration.
 */
import { BridgeLogo, type BridgeLogoVariant } from '@/components/brand/BridgeLogo';

type DeshiFiverrLogoProps = {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'nav' | 'nav-lg' | 'mobile';
};

const SIZE_MAP: Record<NonNullable<DeshiFiverrLogoProps['size']>, BridgeLogoVariant> = {
  sm: 'navSm',
  md: 'auth',
  nav: 'nav',
  'nav-lg': 'nav',
  mobile: 'navSm',
};

export function DeshiFiverrLogo({ className, size = 'md' }: DeshiFiverrLogoProps) {
  return <BridgeLogo className={className} variant={SIZE_MAP[size]} />;
}
