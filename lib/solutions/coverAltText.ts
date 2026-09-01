type CoverAltInput = {
  title: string;
  category?: string | null;
  slug?: string;
};

const SLUG_ALT_HINTS: Record<string, string> = {
  'meta-ads-management':
    '3D illustration of Meta ads management with social media campaign dashboard, megaphone, and ad analytics',
  'basic-stock-management':
    '3D illustration of stock management software with warehouse inventory, product boxes, and barcode scanner',
  'single-product-landing':
    '3D illustration of single product landing page with mobile checkout and order button',
  'business-management-software':
    '3D illustration of business ERP dashboard with sales, ledger, stock, and analytics',
  'advanced-business-erp':
    '3D illustration of advanced business ERP with multi-module dashboard and analytics',
  'manufacturing-production-erp':
    '3D illustration of manufacturing ERP with production line and factory dashboard',
  'enterprise-business-automation':
    '3D illustration of enterprise business automation with workflow and analytics dashboard',
  'pos-inventory-software':
    '3D illustration of POS checkout counter with barcode scanner, receipt, and sales screen',
  'hr-payroll-software':
    '3D illustration of HRM software with employee profiles, attendance, and payroll dashboard',
  'custom-erp-software':
    '3D illustration of custom ERP software with integrated business modules dashboard',
  'ecommerce-website':
    '3D illustration of e-commerce storefront with shopping cart, product cards, and checkout',
  'business-website':
    '3D illustration of responsive business website on desktop browser',
  'mobile-app-development':
    '3D illustration of smartphone with modern mobile app interface screens',
  'seo-service':
    '3D illustration of SEO analytics dashboard with search rankings and growth chart',
  'courier-logistics':
    '3D illustration of courier logistics with delivery truck, parcels, and route tracking',
};

export function buildCoverAltText({ title, category, slug }: CoverAltInput): string {
  if (slug && SLUG_ALT_HINTS[slug]) {
    return SLUG_ALT_HINTS[slug];
  }

  const categoryPart = category ? ` for ${category}` : '';
  return `3D illustration of ${title}${categoryPart} with relevant business software elements`;
}
