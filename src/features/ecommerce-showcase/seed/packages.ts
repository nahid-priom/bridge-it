export type SeedPackage = {
  name: string;
  price: number;
  short_description: string;
  features: string[];
  is_popular: boolean;
};

/** Canonical packages for wave-2+ showcase projects. */
export const CANONICAL_PACKAGES: SeedPackage[] = [
  {
    name: 'Landing Page',
    price: 5000,
    short_description: 'Premium single-page E-commerce landing page for product campaigns and online sales.',
    features: [
      'Premium Landing Page',
      'Product / Offer presentation',
      'CTA / Order action',
      'Mobile Responsive',
      'Lead / Order Form',
    ],
    is_popular: false,
  },
  {
    name: 'E-commerce Website',
    price: 20000,
    short_description: 'Complete E-commerce website with product browsing, cart, checkout and admin management.',
    features: [
      'Homepage + Shop + Product + Cart + Checkout',
      'Responsive Design',
      'Product Management',
      'Basic Admin',
      'SEO Setup',
    ],
    is_popular: true,
  },
  {
    name: 'Premium Custom',
    price: 50000,
    short_description:
      'Fully customized E-commerce solution with advanced automation, integrations and custom business features.',
    features: [
      'Fully Custom UI/UX',
      'Inventory / Stock',
      'Courier Automation',
      'Advanced Checkout & Analytics',
      'POS / ERP integrations where required',
    ],
    is_popular: false,
  },
];
