/**
 * Deterministic software product slug → catalog industry slug map.
 * Keep in sync with supabase/migrations/20260917120000_software_45_industries_packages.sql
 */
export const SOFTWARE_PRODUCT_INDUSTRY_MAP = {
  'garments-erp': 'garments',
  'garments-starter-software': 'garments',
  'garments-production-management': 'garments',
  'garments-erp-professional': 'garments',
  'garments-enterprise-erp': 'garments',
  'garments-accessories-erp': 'garments',
  'textile-erp': 'textile-dyeing',
  'dyeing-management': 'textile-dyeing',
  'feed-mill-erp': 'feed-mill',
  'feed-mill-mini': 'feed-mill',
  'feed-mill-basic': 'feed-mill',
  'feed-mill-erp-professional': 'feed-mill',
  'feed-mill-enterprise-erp': 'feed-mill',
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
} as const;

export type SoftwareProductSlug = keyof typeof SOFTWARE_PRODUCT_INDUSTRY_MAP;
export type SoftwareIndustrySlug = (typeof SOFTWARE_PRODUCT_INDUSTRY_MAP)[SoftwareProductSlug];

export const SOFTWARE_INDUSTRY_SLUGS = [
  ...new Set(Object.values(SOFTWARE_PRODUCT_INDUSTRY_MAP)),
] as SoftwareIndustrySlug[];

export function softwareIndustryForProduct(
  productSlug: string
): SoftwareIndustrySlug | null {
  if (productSlug in SOFTWARE_PRODUCT_INDUSTRY_MAP) {
    return SOFTWARE_PRODUCT_INDUSTRY_MAP[productSlug as SoftwareProductSlug];
  }
  return null;
}
