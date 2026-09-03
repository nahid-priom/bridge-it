import { CATALOG_PACKAGE_TIERS } from '../config/constants';

export type SeedPackage = {
  name: string;
  price: number;
  short_description: string;
  features: string[];
  is_popular: boolean;
};

export const CANONICAL_PACKAGES: SeedPackage[] = CATALOG_PACKAGE_TIERS.map((tier, index) => ({
  name: tier.name,
  price: tier.price,
  short_description:
    index === 0
      ? 'Premium single-page E-commerce landing page for product campaigns and online sales.'
      : index === 1
        ? 'Complete E-commerce website with product browsing, cart, checkout and admin management.'
        : 'Fully customized E-commerce solution with advanced automation, integrations and custom business features.',
  features: [...tier.features],
  is_popular: index === 1,
}));
