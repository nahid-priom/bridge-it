/**
 * Static permanent redirects for catalog hierarchy migration.
 * Kept dependency-free so next.config.ts can load this file safely.
 */

/** Software product slug → industry slug (45-industry taxonomy) */
const SOFTWARE_PRODUCT_INDUSTRY_MAP: Record<string, string> = {
  'garments-erp': 'garments',
  'garments-accessories-erp': 'garments',
  'textile-erp': 'textile-dyeing',
  'dyeing-management': 'textile-dyeing',
  'feed-mill-erp': 'feed-mill',
  'poultry-management-erp': 'poultry-livestock',
  'layer-farm-management': 'poultry-livestock',
  'cattle-dairy-management': 'poultry-livestock',
  'fish-farm-management': 'agriculture',
  'dealership-management': 'automotive',
  'distribution-management': 'distribution',
  'wholesale-erp': 'distribution',
  'trading-erp': 'distribution',
  'manufacturing-erp': 'manufacturing',
  'factory-management': 'manufacturing',
  'packaging-factory-erp': 'printing-packaging',
  'printing-press-management': 'printing-packaging',
  'electronics-assembly-erp': 'electronics-appliances',
  'inventory-warehouse-erp': 'inventory',
  'retail-pos': 'retail-pos',
  'super-shop-management': 'retail-pos',
  'pharmacy-management': 'pharmacy',
  'hospital-management': 'hospital',
  'diagnostic-center-management': 'diagnostic-laboratory',
  'clinic-management': 'clinic-dental',
  'restaurant-management': 'restaurant',
  'bakery-management': 'food-beverage-manufacturing',
  'school-management': 'education',
  'college-management': 'education',
  'coaching-management': 'training',
  'hr-payroll': 'hr-payroll',
  'crm-system': 'crm',
  'sales-force-automation': 'field-sales',
  'courier-management': 'courier',
  'logistics-erp': 'logistics',
  'transport-management': 'logistics',
  'manpower-recruiting-erp': 'agency-management',
  'real-estate-erp': 'real-estate',
  'property-management': 'real-estate',
  'construction-erp': 'construction',
  'brick-tiles-erp': 'construction',
  'rice-mill-erp': 'food-beverage-manufacturing',
  'flour-mill-erp': 'food-beverage-manufacturing',
  'oil-production-erp': 'food-beverage-manufacturing',
  'automobile-workshop': 'automotive',
  'service-center-management': 'service-business',
  'salon-management': 'salon',
  'isp-management': 'saas-subscription',
  'saas-management': 'saas-subscription',
  'multi-branch-erp': 'saas-subscription',
  'ecommerce-admin-dashboard': 'ecommerce',
  'ecommerce-admin-operations': 'ecommerce',
};

/** Prior hierarchy industry → new 45-industry slug */
const SOFTWARE_INDUSTRY_RENAME_MAP: Record<string, string> = {
  agro: 'agriculture',
  retail: 'retail-pos',
  school: 'education',
  hr: 'hr-payroll',
  services: 'service-business',
  saas: 'saas-subscription',
  manpower: 'agency-management',
  mills: 'food-beverage-manufacturing',
  dealership: 'automotive',
  enterprise: 'saas-subscription',
};

/** Prior product → industry map (pre-45 finalization) for hierarchical redirects */
const SOFTWARE_PRODUCT_INDUSTRY_MAP_LEGACY: Record<string, string> = {
  'garments-erp': 'garments',
  'textile-erp': 'garments',
  'dyeing-management': 'garments',
  'garments-accessories-erp': 'garments',
  'feed-mill-erp': 'feed-mill',
  'poultry-management-erp': 'agro',
  'layer-farm-management': 'agro',
  'fish-farm-management': 'agro',
  'cattle-dairy-management': 'agro',
  'dealership-management': 'dealership',
  'distribution-management': 'distribution',
  'wholesale-erp': 'distribution',
  'trading-erp': 'distribution',
  'manufacturing-erp': 'manufacturing',
  'factory-management': 'manufacturing',
  'packaging-factory-erp': 'manufacturing',
  'electronics-assembly-erp': 'manufacturing',
  'printing-press-management': 'manufacturing',
  'inventory-warehouse-erp': 'inventory',
  'retail-pos': 'retail',
  'super-shop-management': 'retail',
  'pharmacy-management': 'pharmacy',
  'hospital-management': 'hospital',
  'diagnostic-center-management': 'hospital',
  'clinic-management': 'hospital',
  'restaurant-management': 'restaurant',
  'bakery-management': 'restaurant',
  'school-management': 'school',
  'college-management': 'school',
  'coaching-management': 'school',
  'hr-payroll': 'hr',
  'crm-system': 'crm',
  'sales-force-automation': 'crm',
  'courier-management': 'logistics',
  'logistics-erp': 'logistics',
  'transport-management': 'logistics',
  'manpower-recruiting-erp': 'manpower',
  'real-estate-erp': 'real-estate',
  'property-management': 'real-estate',
  'construction-erp': 'construction',
  'brick-tiles-erp': 'construction',
  'rice-mill-erp': 'mills',
  'flour-mill-erp': 'mills',
  'oil-production-erp': 'mills',
  'automobile-workshop': 'services',
  'service-center-management': 'services',
  'salon-management': 'services',
  'isp-management': 'saas',
  'saas-management': 'saas',
  'multi-branch-erp': 'enterprise',
};

const MARKETING_PRODUCT_INDUSTRY_MAP: Record<string, string> = {
  'social-media-post-design': 'social-media-design',
  'facebook-ads-creative': 'advertising-creative',
  'brand-identity-design': 'branding-identity',
  'logo-design': 'branding-identity',
  'packaging-design': 'packaging-print',
  'product-label-design': 'packaging-print',
  'brochure-flyer-design': 'packaging-print',
  'visiting-card-design': 'branding-identity',
  'meta-ads-management': 'facebook-instagram-ads',
  'meta-pixel-capi-setup': 'facebook-instagram-ads',
  'ecommerce-marketing-package': 'ecommerce-marketing',
  'lead-generation-campaigns': 'lead-generation',
  'social-media-management': 'social-media-management',
  'web-banner-ecommerce-creative': 'advertising-creative',
  'campaign-strategy-creative-testing': 'facebook-instagram-ads',
};

const WEBSITE_INDUSTRIES = [
  'fashion',
  'electronics',
  'grocery',
  'cosmetics',
  'furniture',
  'lifestyle',
  'specialty',
  'sports',
];

export function buildCatalogHierarchyRedirects(): ReadonlyArray<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  const redirects: Array<{ source: string; destination: string; permanent: boolean }> = [];

  for (const [from, to] of Object.entries(SOFTWARE_INDUSTRY_RENAME_MAP)) {
    redirects.push({
      source: `/software/${from}`,
      destination: `/software/${to}`,
      permanent: true,
    });
  }

  for (const [product, industry] of Object.entries(SOFTWARE_PRODUCT_INDUSTRY_MAP)) {
    // Never steal industry hub URLs when product slug equals industry slug
    // (e.g. retail-pos, hr-payroll). Product lives at /software/{industry}/{product}.
    if (product !== industry) {
      redirects.push({
        source: `/software/${product}`,
        destination: `/software/${industry}/${product}`,
        permanent: true,
      });
    }

    const legacyIndustry = SOFTWARE_PRODUCT_INDUSTRY_MAP_LEGACY[product];
    if (legacyIndustry && legacyIndustry !== industry) {
      redirects.push({
        source: `/software/${legacyIndustry}/${product}`,
        destination: `/software/${industry}/${product}`,
        permanent: true,
      });
    }
  }

  const marketingIndustrySlugs = new Set(Object.values(MARKETING_PRODUCT_INDUSTRY_MAP));

  for (const [product, industry] of Object.entries(MARKETING_PRODUCT_INDUSTRY_MAP)) {
    redirects.push({
      source: `/creative-marketing/${product}`,
      destination: `/marketing/${industry}/${product}`,
      permanent: true,
    });
    if (!marketingIndustrySlugs.has(product)) {
      redirects.push({
        source: `/marketing/${product}`,
        destination: `/marketing/${industry}/${product}`,
        permanent: true,
      });
    }
  }

  for (const slug of WEBSITE_INDUSTRIES) {
    redirects.push({
      source: `/ecommerce/${slug}`,
      destination: `/websites/${slug}`,
      permanent: true,
    });
  }

  return redirects;
}
