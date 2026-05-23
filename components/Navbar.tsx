'use client';

import type { Category } from '@/types';
import type { AuthProfile } from '@/lib/auth/types';
import { PremiumMarketplaceNavbar } from '@/components/navbar/PremiumMarketplaceNavbar';

export const Navbar: React.FC<{
  categories: Category[];
  authProfile?: AuthProfile | null;
}> = (props) => <PremiumMarketplaceNavbar {...props} />;

/** @deprecated Use PremiumMarketplaceNavbar via Navbar */
export { PremiumMarketplaceNavbar } from '@/components/navbar/PremiumMarketplaceNavbar';
