export type CoverPromptInput = {
  title: string;
  category?: string | null;
  shortDescription?: string | null;
  features?: string[];
  productType?: string | null;
  slug?: string;
};

const SLUG_VISUAL_HINTS: Record<string, string> = {
  'meta-ads-management':
    'social media advertising dashboard, megaphone, ad analytics charts, campaign performance metrics, Facebook/Instagram ad creative',
  'basic-stock-management':
    'warehouse shelves, product boxes, barcode scanner, inventory dashboard, stock levels chart',
  'single-product-landing':
    'single product showcase, mobile landing page, order now button, COD checkout flow, product hero section',
  'starter-ecommerce':
    'online store catalog, shopping cart, product grid, checkout page',
  'standard-ecommerce':
    'e-commerce dashboard with customer accounts, wishlist, order analytics',
  'automated-ecommerce':
    'automated store with courier integration, fraud detection panel, marketing pixel dashboard',
  'premium-ecommerce':
    'premium online store suite with advanced analytics and automation modules',
  'business-management-software':
    'business ERP dashboard with sales, ledger, stock, customers, and analytics modules',
  'advanced-business-erp':
    'multi-module ERP dashboard with accounting, inventory, CRM, and reporting',
  'manufacturing-production-erp':
    'factory production line, manufacturing dashboard, work orders, raw materials tracking',
  'enterprise-business-automation':
    'enterprise automation dashboard with workflows, integrations, and analytics',
  'pos-inventory-software':
    'POS checkout counter, barcode scanner, receipt printer, sales screen, inventory panel',
  'hr-payroll-software':
    'employee profiles, attendance tracking, payroll dashboard, organization chart',
  'custom-erp-software':
    'customizable ERP dashboard with modular business management panels',
  'ecommerce-website':
    'online storefront, shopping bags, product cards, checkout flow',
  'business-website':
    'desktop browser showing responsive business website UI',
  'mobile-app-development':
    'smartphone with multiple app UI screens, mobile interface elements',
  'seo-service':
    'SEO analytics dashboard, search ranking chart, keyword performance graph',
  'ecommerce-growth':
    'e-commerce growth funnel, ads, SEO metrics, conversion analytics',
  'social-media-design':
    'social media post templates, ad creative layouts, brand design elements',
  'logo-brand-identity':
    'logo design elements, brand identity palette, typography samples',
  'courier-logistics':
    'delivery truck, shipping parcels, route map, logistics tracking dashboard',
  'restaurant-software':
    'restaurant POS, dining table, food orders, kitchen management screen',
  'hospital-clinic-software':
    'hospital management dashboard with patient records, appointments, billing',
  'school-management':
    'school classroom, student management dashboard, academic records',
  'garments-erp':
    'garments factory, fabric rolls, apparel production, cutting and sewing workflow',
  'feed-mill-erp':
    'feed bags, grain raw materials, production machine, feed management dashboard',
  'poultry-management':
    'poultry farm, chickens, eggs and feed, farm management dashboard',
};

function inferVisualFromTitle(title: string, productType?: string | null): string {
  const lower = title.toLowerCase();

  if (lower.includes('erp') || lower.includes('management software')) {
    return 'business ERP dashboard with sales, inventory, accounting, and analytics modules';
  }
  if (lower.includes('pos') || lower.includes('point of sale')) {
    return 'POS checkout counter, barcode scanner, receipt, sales screen';
  }
  if (lower.includes('crm')) {
    return 'customer relationship dashboard with sales pipeline, contacts, and communication tools';
  }
  if (lower.includes('hrm') || lower.includes('hr ') || lower.includes('payroll')) {
    return 'employee management dashboard with attendance, payroll, and org structure';
  }
  if (lower.includes('e-commerce') || lower.includes('ecommerce') || lower.includes('store')) {
    return 'online storefront with shopping cart, product cards, and checkout';
  }
  if (lower.includes('mobile app') || lower.includes('app development')) {
    return 'smartphone with modern app UI screens and interface elements';
  }
  if (lower.includes('website') || lower.includes('web development')) {
    return 'desktop browser with responsive website UI and modern layout';
  }
  if (lower.includes('marketing') || lower.includes('ads')) {
    return 'digital marketing dashboard with campaign analytics and growth charts';
  }
  if (lower.includes('seo')) {
    return 'SEO analytics dashboard with search rankings and traffic growth';
  }
  if (lower.includes('courier') || lower.includes('logistics') || lower.includes('delivery')) {
    return 'delivery truck, parcels, route tracking, logistics dashboard';
  }
  if (lower.includes('restaurant')) {
    return 'restaurant POS, dining table, food orders, kitchen management';
  }
  if (lower.includes('hospital') || lower.includes('clinic')) {
    return 'hospital management dashboard with patient, appointment, and billing elements';
  }
  if (lower.includes('school')) {
    return 'school classroom and student management dashboard';
  }
  if (lower.includes('stock') || lower.includes('inventory') || lower.includes('warehouse')) {
    return 'warehouse inventory with product boxes, shelves, barcode, stock dashboard';
  }

  const typeHint =
    productType === 'software'
      ? 'business software dashboard with relevant modules'
      : productType === 'website'
        ? 'modern website interface on desktop and mobile'
        : productType === 'marketing'
          ? 'digital marketing analytics and campaign tools'
          : 'professional SaaS software interface elements';

  return `${typeHint} related to ${title}`;
}

export function buildSolutionCoverPrompt(input: CoverPromptInput): string {
  const { title, category, shortDescription, features, productType, slug } = input;

  const slugHint = slug ? SLUG_VISUAL_HINTS[slug] : undefined;
  const visualContext =
    slugHint ?? inferVisualFromTitle(title, productType);

  const featureBlock =
    features && features.length > 0
      ? `\nKEY FEATURES:\n${features.slice(0, 6).map((f) => `- ${f}`).join('\n')}`
      : '';

  const descriptionBlock = shortDescription?.trim()
    ? `\nBUSINESS CONTEXT:\n${shortDescription.trim()}`
    : '';

  return `Create a premium modern 3D SaaS illustration for:
TITLE: ${title}
${category ? `CATEGORY: ${category}` : ''}${descriptionBlock}${featureBlock}

Represent the solution visually using recognizable objects related to the business:
${visualContext}

Style:
premium 3D illustration,
modern enterprise SaaS visual,
clean composition,
dark navy background,
emerald and teal accents,
white and soft gray UI elements,
subtle professional lighting,
large central subject,
minimal clutter,
no text,
no logos,
no watermark,
no people unless required,
high readability at small card size,
16:9 composition.`.trim();
}
