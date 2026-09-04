/**
 * One-shot helper: injects solution taxonomy into seed catalog.ts
 * Run: npx tsx scripts/patch-software-catalog-taxonomy.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type Taxonomy = {
  solutionGroup: string;
  softwareType: string;
  platformType: string;
  popular?: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  screens?: Array<{ key: string; name: string; category: string }>;
  title?: string;
};

const POS_SCREENS = [
  { key: 'dashboard', name: 'Dashboard', category: 'dashboard' },
  { key: 'pos-billing', name: 'POS Billing', category: 'transaction' },
  { key: 'products', name: 'Products', category: 'list' },
  { key: 'stock', name: 'Stock', category: 'stock' },
  { key: 'customers', name: 'Customers', category: 'list' },
  { key: 'purchase', name: 'Purchase', category: 'transaction' },
  { key: 'sales', name: 'Sales', category: 'list' },
  { key: 'cash', name: 'Cash', category: 'accounts' },
  { key: 'reports', name: 'Reports', category: 'reports' },
  { key: 'settings', name: 'Settings', category: 'settings' },
];

const CRM_SCREENS = [
  { key: 'dashboard', name: 'Dashboard', category: 'dashboard' },
  { key: 'leads', name: 'Leads', category: 'list' },
  { key: 'pipeline', name: 'Pipeline', category: 'detail' },
  { key: 'contacts', name: 'Contacts', category: 'list' },
  { key: 'follow-ups', name: 'Follow-ups', category: 'list' },
  { key: 'tasks', name: 'Tasks', category: 'list' },
  { key: 'sales', name: 'Sales', category: 'transaction' },
  { key: 'activities', name: 'Activities', category: 'list' },
  { key: 'reports', name: 'Reports', category: 'reports' },
  { key: 'settings', name: 'Settings', category: 'settings' },
];

const HRM_SCREENS = [
  { key: 'dashboard', name: 'Dashboard', category: 'dashboard' },
  { key: 'employees', name: 'Employees', category: 'list' },
  { key: 'attendance', name: 'Attendance', category: 'transaction' },
  { key: 'leave', name: 'Leave', category: 'form' },
  { key: 'payroll', name: 'Payroll', category: 'accounts' },
  { key: 'loans', name: 'Loans', category: 'form' },
  { key: 'performance', name: 'Performance', category: 'detail' },
  { key: 'reports', name: 'Reports', category: 'reports' },
  { key: 'roles', name: 'Roles', category: 'users' },
  { key: 'settings', name: 'Settings', category: 'settings' },
];

const MOBILE_SALES_SCREENS = [
  { key: 'mobile-dashboard', name: 'Mobile Dashboard', category: 'dashboard' },
  { key: 'customer', name: 'Customer', category: 'list' },
  { key: 'order-entry', name: 'Order Entry', category: 'form' },
  { key: 'route', name: 'Route', category: 'list' },
  { key: 'collection', name: 'Collection', category: 'transaction' },
  { key: 'stock', name: 'Stock', category: 'stock' },
  { key: 'visit', name: 'Visit', category: 'form' },
  { key: 'location', name: 'Location', category: 'detail' },
  { key: 'reports', name: 'Reports', category: 'reports' },
  { key: 'profile', name: 'Profile', category: 'settings' },
];

const SAAS_SCREENS = [
  { key: 'dashboard', name: 'Dashboard', category: 'dashboard' },
  { key: 'tenants', name: 'Tenants', category: 'list' },
  { key: 'subscriptions', name: 'Subscriptions', category: 'list' },
  { key: 'plans', name: 'Plans', category: 'list' },
  { key: 'usage', name: 'Usage', category: 'detail' },
  { key: 'billing', name: 'Billing', category: 'accounts' },
  { key: 'users', name: 'Users', category: 'users' },
  { key: 'analytics', name: 'Analytics', category: 'reports' },
  { key: 'support', name: 'Support', category: 'list' },
  { key: 'settings', name: 'Settings', category: 'settings' },
];

const TAXONOMY: Record<string, Taxonomy> = {
  'garments-erp': {
    solutionGroup: 'erp-business-management',
    softwareType: 'ERP',
    platformType: 'web',
    popular: true,
    featured: true,
    seoTitle: 'Garments ERP Software Bangladesh | Factory Production & Merchandising',
    seoDescription:
      'Garments ERP for apparel factories in Bangladesh—manage styles, cutting, sewing, inventory, accounts and export shipments from one system.',
    seoKeywords: [
      'garments erp bangladesh',
      'apparel factory software',
      'erp software development',
      'business management software',
      'merchandising erp',
    ],
  },
  'feed-mill-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    popular: true,
    featured: true,
    seoTitle: 'Feed Mill Manufacturing Software | Batch Production & Dealer Management',
    seoDescription:
      'Manufacturing management software for feed mills—formulas, batches, raw materials, QC and dealer sales for Bangladesh agro industries.',
    seoKeywords: [
      'manufacturing management software',
      'feed mill software bangladesh',
      'feed batch production',
      'dealer management software',
    ],
  },
  'poultry-management-erp': {
    solutionGroup: 'agro-farm-management',
    softwareType: 'Agro',
    platformType: 'web',
    title: 'Poultry Farm Management',
    seoTitle: 'Poultry Farm Management Software Bangladesh | FCR & Shed Tracking',
    seoDescription:
      'Track flocks, FCR, mortality, feed and sales across poultry sheds with farm management software for Bangladesh.',
    seoKeywords: ['poultry management software', 'farm management software bangladesh', 'fcr tracking software'],
  },
  'layer-farm-management': {
    solutionGroup: 'agro-farm-management',
    softwareType: 'Agro',
    platformType: 'web',
    seoTitle: 'Layer Farm Management Software | Egg Production Tracking',
    seoDescription: 'Layer and egg production software for commercial farms—flock, feed, collection and sales.',
    seoKeywords: ['layer farm software', 'egg production software bangladesh', 'agro farm management'],
  },
  'fish-farm-management': {
    solutionGroup: 'agro-farm-management',
    softwareType: 'Agro',
    platformType: 'web',
    seoTitle: 'Fish Farm Management Software Bangladesh',
    seoDescription: 'Aquaculture and fish farm software for pond stock, feed, harvest and sales.',
    seoKeywords: ['fish farm software', 'aquaculture management bangladesh', 'agro farm software'],
  },
  'cattle-dairy-management': {
    solutionGroup: 'agro-farm-management',
    softwareType: 'Agro',
    platformType: 'web',
    seoTitle: 'Cattle & Dairy Management Software Bangladesh',
    seoDescription: 'Dairy herd, milk collection, feed and sales software for cattle farms.',
    seoKeywords: ['dairy management software', 'cattle farm software bangladesh', 'milk collection software'],
  },
  'dealership-management': {
    solutionGroup: 'distribution-dealership',
    softwareType: 'Distribution',
    platformType: 'web',
    popular: true,
    featured: true,
    seoTitle: 'Dealer Management Software Bangladesh | Orders & Ledger',
    seoDescription: 'Dealer management software for orders, stock, credit and party ledger.',
    seoKeywords: ['dealer management software', 'dealership software bangladesh', 'distribution software'],
  },
  'distribution-management': {
    solutionGroup: 'distribution-dealership',
    softwareType: 'Distribution',
    platformType: 'web',
    seoTitle: 'Distribution Management Software Bangladesh',
    seoDescription: 'Route, warehouse and distributor order software for trading companies.',
    seoKeywords: ['distribution management software', 'distributor software bangladesh'],
  },
  'wholesale-erp': {
    solutionGroup: 'erp-business-management',
    softwareType: 'ERP',
    platformType: 'web',
    seoTitle: 'Wholesale ERP Software Bangladesh | Stock & Party Ledger',
    seoDescription: 'Wholesale business management software for inventory, sales and accounts.',
    seoKeywords: ['wholesale erp bangladesh', 'business management software', 'erp software development'],
  },
  'trading-erp': {
    solutionGroup: 'erp-business-management',
    softwareType: 'ERP',
    platformType: 'web',
    seoTitle: 'Trading ERP Software Bangladesh',
    seoDescription: 'Trading company ERP for purchase, sales, stock and party accounts.',
    seoKeywords: ['trading erp bangladesh', 'trading management software', 'business management software'],
  },
  'manufacturing-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    seoTitle: 'Manufacturing Management Software Bangladesh | Production ERP',
    seoDescription: 'Manufacturing management software for BOM, production, inventory and costing.',
    seoKeywords: ['manufacturing management software', 'production erp bangladesh', 'factory software'],
  },
  'factory-management': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Factory Management',
    seoTitle: 'Factory Management Software Bangladesh',
    seoDescription: 'Factory floor production, inventory and workforce management software.',
    seoKeywords: ['factory management software', 'manufacturing management software bangladesh'],
  },
  'inventory-warehouse-erp': {
    solutionGroup: 'inventory-warehouse',
    softwareType: 'Inventory',
    platformType: 'web',
    title: 'Inventory & Warehouse Management',
    seoTitle: 'Inventory Management Software Bangladesh | Warehouse Control',
    seoDescription: 'Inventory and warehouse management software for stock, GRN, transfer and valuation.',
    seoKeywords: ['inventory management software', 'warehouse management software bangladesh'],
  },
  'retail-pos': {
    solutionGroup: 'pos-retail',
    softwareType: 'POS',
    platformType: 'web',
    popular: true,
    featured: true,
    title: 'POS Software',
    screens: POS_SCREENS,
    seoTitle: 'POS Software Bangladesh | Retail Billing & Stock',
    seoDescription: 'POS software for retail shops—billing, products, stock, customers and cash reports.',
    seoKeywords: ['pos software bangladesh', 'pos software development', 'retail pos software'],
  },
  'super-shop-management': {
    solutionGroup: 'pos-retail',
    softwareType: 'POS',
    platformType: 'web',
    screens: POS_SCREENS,
    seoTitle: 'Super Shop POS Software Bangladesh',
    seoDescription: 'Multi-counter POS and retail management for super shops and convenience stores.',
    seoKeywords: ['super shop software', 'retail pos bangladesh', 'pos software'],
  },
  'pharmacy-management': {
    solutionGroup: 'healthcare-software',
    softwareType: 'Healthcare',
    platformType: 'web',
    screens: POS_SCREENS.map((s) =>
      s.key === 'pos-billing' ? { ...s, name: 'Pharmacy Billing' } : s
    ),
    seoTitle: 'Pharmacy Management Software Bangladesh',
    seoDescription: 'Pharmacy software for medicine stock, expiry, billing and suppliers.',
    seoKeywords: ['pharmacy management software', 'pharmacy software bangladesh'],
  },
  'hospital-management': {
    solutionGroup: 'healthcare-software',
    softwareType: 'Healthcare',
    platformType: 'web',
    seoTitle: 'Hospital Management Software Bangladesh',
    seoDescription: 'Hospital management software for patients, appointments, billing and wards.',
    seoKeywords: ['hospital management software', 'hospital software bangladesh', 'healthcare software'],
  },
  'diagnostic-center-management': {
    solutionGroup: 'healthcare-software',
    softwareType: 'Healthcare',
    platformType: 'web',
    seoTitle: 'Diagnostic Center Management Software Bangladesh',
    seoDescription: 'Lab and diagnostic center software for tests, reports and billing.',
    seoKeywords: ['diagnostic center software', 'lab management software bangladesh'],
  },
  'clinic-management': {
    solutionGroup: 'healthcare-software',
    softwareType: 'Healthcare',
    platformType: 'web',
    seoTitle: 'Clinic Management Software Bangladesh',
    seoDescription: 'Clinic software for appointments, prescriptions, billing and follow-ups.',
    seoKeywords: ['clinic management software', 'clinic software bangladesh'],
  },
  'restaurant-management': {
    solutionGroup: 'restaurant-hospitality',
    softwareType: 'Hospitality',
    platformType: 'web',
    seoTitle: 'Restaurant Management Software Bangladesh',
    seoDescription: 'Restaurant POS, kitchen, table and inventory management software.',
    seoKeywords: ['restaurant management software', 'restaurant pos bangladesh'],
  },
  'bakery-management': {
    solutionGroup: 'restaurant-hospitality',
    softwareType: 'Hospitality',
    platformType: 'web',
    seoTitle: 'Bakery Management Software Bangladesh',
    seoDescription: 'Bakery production, recipes, counter POS and stock management software.',
    seoKeywords: ['bakery management software', 'bakery pos bangladesh'],
  },
  'school-management': {
    solutionGroup: 'education-software',
    softwareType: 'Education',
    platformType: 'web',
    seoTitle: 'School Management Software Bangladesh',
    seoDescription: 'School management software for students, fees, attendance and exams.',
    seoKeywords: ['school management software', 'school software bangladesh', 'education software'],
  },
  'college-management': {
    solutionGroup: 'education-software',
    softwareType: 'Education',
    platformType: 'web',
    seoTitle: 'College Management Software Bangladesh',
    seoDescription: 'College administration software for admissions, fees, exams and results.',
    seoKeywords: ['college management software', 'education software bangladesh'],
  },
  'coaching-management': {
    solutionGroup: 'education-software',
    softwareType: 'Education',
    platformType: 'web',
    seoTitle: 'Coaching Center Management Software Bangladesh',
    seoDescription: 'Coaching management software for batches, fees, attendance and exams.',
    seoKeywords: ['coaching management software', 'coaching center software bangladesh'],
  },
  'hr-payroll': {
    solutionGroup: 'hrm-payroll',
    softwareType: 'HRM',
    platformType: 'web',
    popular: true,
    featured: true,
    title: 'HR & Payroll',
    screens: HRM_SCREENS,
    seoTitle: 'HR & Payroll Software Bangladesh',
    seoDescription: 'HR and payroll software for attendance, leave, salary, loans and performance.',
    seoKeywords: ['hr payroll software bangladesh', 'hrm software', 'payroll software bangladesh'],
  },
  'crm-system': {
    solutionGroup: 'crm-sales',
    softwareType: 'CRM',
    platformType: 'web',
    popular: true,
    featured: true,
    title: 'CRM System',
    screens: CRM_SCREENS,
    seoTitle: 'CRM Software for Small Business | Bangladesh',
    seoDescription: 'CRM software for leads, pipeline, follow-ups and sales activities.',
    seoKeywords: ['crm software for small business', 'crm development', 'crm software bangladesh'],
  },
  'sales-force-automation': {
    solutionGroup: 'mobile-apps',
    softwareType: 'Mobile App',
    platformType: 'mobile',
    title: 'Mobile Sales App',
    screens: MOBILE_SALES_SCREENS,
    seoTitle: 'Mobile Business App Development | Field Sales App',
    seoDescription: 'Mobile sales app for order entry, routes, collection and field visits.',
    seoKeywords: [
      'mobile business app development',
      'sales force automation app',
      'field sales app bangladesh',
    ],
  },
  'courier-management': {
    solutionGroup: 'logistics-courier',
    softwareType: 'Logistics',
    platformType: 'web',
    seoTitle: 'Courier Management Software Bangladesh',
    seoDescription: 'Courier and parcel management software for booking, tracking and delivery.',
    seoKeywords: ['courier management software', 'courier software bangladesh', 'logistics software'],
  },
  'logistics-erp': {
    solutionGroup: 'logistics-courier',
    softwareType: 'Logistics',
    platformType: 'web',
    title: 'Logistics Management',
    seoTitle: 'Logistics Management Software Bangladesh',
    seoDescription: 'Logistics software for fleet, warehouse, trips and delivery operations.',
    seoKeywords: ['logistics management software', 'logistics software bangladesh'],
  },
  'transport-management': {
    solutionGroup: 'logistics-courier',
    softwareType: 'Logistics',
    platformType: 'web',
    seoTitle: 'Transport Management Software Bangladesh',
    seoDescription: 'Transport and fleet management software for trips, fuel and vehicle tracking.',
    seoKeywords: ['transport management software', 'fleet software bangladesh'],
  },
  'manpower-recruiting-erp': {
    solutionGroup: 'hrm-payroll',
    softwareType: 'HRM',
    platformType: 'web',
    title: 'Manpower & Recruiting Management',
    screens: HRM_SCREENS,
    seoTitle: 'Recruiting & Manpower Management Software Bangladesh',
    seoDescription: 'Manpower agency software for candidates, visas, placements and payroll.',
    seoKeywords: ['recruiting software bangladesh', 'manpower agency software', 'hrm software'],
  },
  'real-estate-erp': {
    solutionGroup: 'real-estate-construction',
    softwareType: 'Real Estate',
    platformType: 'web',
    title: 'Real Estate Management',
    seoTitle: 'Real Estate Management Software Bangladesh',
    seoDescription: 'Real estate software for plots, bookings, collections and project accounts.',
    seoKeywords: ['real estate management software', 'property software bangladesh'],
  },
  'property-management': {
    solutionGroup: 'real-estate-construction',
    softwareType: 'Real Estate',
    platformType: 'web',
    seoTitle: 'Property Management Software Bangladesh',
    seoDescription: 'Property and rental management software for tenants, rent and maintenance.',
    seoKeywords: ['property management software', 'rental management bangladesh'],
  },
  'construction-erp': {
    solutionGroup: 'real-estate-construction',
    softwareType: 'Construction',
    platformType: 'web',
    title: 'Construction Management',
    seoTitle: 'Construction Management Software Bangladesh',
    seoDescription: 'Construction project software for BOQ, site progress, materials and costing.',
    seoKeywords: ['construction management software', 'construction software bangladesh'],
  },
  'brick-tiles-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Brick & Tiles Factory Management',
    seoTitle: 'Brick & Tiles Factory Software Bangladesh',
    seoDescription: 'Brick and tiles factory production, stock and dealer sales software.',
    seoKeywords: ['brick factory software', 'manufacturing management software bangladesh'],
  },
  'rice-mill-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Rice Mill Management',
    seoTitle: 'Rice Mill Management Software Bangladesh',
    seoDescription: 'Rice mill production, paddy stock, milling and sales management software.',
    seoKeywords: ['rice mill software', 'manufacturing management software bangladesh'],
  },
  'flour-mill-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Flour Mill Management',
    seoTitle: 'Flour Mill Management Software Bangladesh',
    seoDescription: 'Flour mill production, wheat stock and finished goods software.',
    seoKeywords: ['flour mill software', 'manufacturing management software'],
  },
  'oil-production-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Mustard Oil Production Management',
    seoTitle: 'Oil Production Management Software Bangladesh',
    seoDescription: 'Mustard oil production, crushing, stock and dealer sales software.',
    seoKeywords: ['oil mill software', 'manufacturing management software bangladesh'],
  },
  'textile-erp': {
    solutionGroup: 'erp-business-management',
    softwareType: 'ERP',
    platformType: 'web',
    seoTitle: 'Textile ERP Software Bangladesh',
    seoDescription: 'Textile ERP for yarn, weaving, finishing and order tracking.',
    seoKeywords: ['textile erp bangladesh', 'textile management software', 'erp software development'],
  },
  'dyeing-management': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Dyeing Management',
    seoTitle: 'Dyeing Management Software Bangladesh',
    seoDescription: 'Dyeing factory production, batch, chemical and delivery management software.',
    seoKeywords: ['dyeing management software', 'textile dyeing software bangladesh'],
  },
  'garments-accessories-erp': {
    solutionGroup: 'erp-business-management',
    softwareType: 'ERP',
    platformType: 'web',
    seoTitle: 'Garments Accessories ERP Software Bangladesh',
    seoDescription: 'Accessories manufacturing ERP for orders, production and inventory.',
    seoKeywords: ['garments accessories erp', 'erp software bangladesh'],
  },
  'printing-press-management': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    seoTitle: 'Printing Press Management Software Bangladesh',
    seoDescription: 'Printing press job, production and delivery management software.',
    seoKeywords: ['printing press software', 'print management software bangladesh'],
  },
  'packaging-factory-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Packaging Factory Management',
    seoTitle: 'Packaging Factory Software Bangladesh',
    seoDescription: 'Packaging factory production, materials and order management software.',
    seoKeywords: ['packaging factory software', 'manufacturing management software'],
  },
  'electronics-assembly-erp': {
    solutionGroup: 'manufacturing-production',
    softwareType: 'Manufacturing',
    platformType: 'web',
    title: 'Electronics Assembly Management',
    seoTitle: 'Electronics Assembly Software Bangladesh',
    seoDescription: 'Electronics assembly BOM, production and QC management software.',
    seoKeywords: ['electronics assembly software', 'manufacturing management software'],
  },
  'automobile-workshop': {
    solutionGroup: 'business-automation',
    softwareType: 'Automation',
    platformType: 'web',
    seoTitle: 'Automobile Workshop Management Software Bangladesh',
    seoDescription: 'Workshop job cards, estimates, parts and invoicing software.',
    seoKeywords: ['automobile workshop software', 'business automation software bangladesh'],
  },
  'service-center-management': {
    solutionGroup: 'business-automation',
    softwareType: 'Automation',
    platformType: 'web',
    seoTitle: 'Service Center Management Software Bangladesh',
    seoDescription: 'Service center ticketing, parts, warranty and billing software.',
    seoKeywords: ['service center software', 'business automation solutions'],
  },
  'salon-management': {
    solutionGroup: 'business-automation',
    softwareType: 'Automation',
    platformType: 'web',
    seoTitle: 'Beauty Salon Management Software Bangladesh',
    seoDescription: 'Salon appointments, services, packages and billing software.',
    seoKeywords: ['salon management software', 'beauty parlor software bangladesh'],
  },
  'isp-management': {
    solutionGroup: 'saas-platforms',
    softwareType: 'SaaS',
    platformType: 'saas',
    screens: SAAS_SCREENS.map((s) =>
      s.key === 'tenants' ? { ...s, name: 'Subscribers', key: 'subscribers' } : s
    ),
    seoTitle: 'ISP Management Software Bangladesh | Subscriber Billing',
    seoDescription: 'ISP billing, subscribers, packages and support ticket software.',
    seoKeywords: ['isp management software', 'isp billing software bangladesh', 'saas development'],
  },
  'saas-management': {
    solutionGroup: 'saas-platforms',
    softwareType: 'SaaS',
    platformType: 'saas',
    title: 'Subscription Management Platform',
    screens: SAAS_SCREENS,
    seoTitle: 'SaaS Development Company | Subscription Management Platform',
    seoDescription: 'SaaS subscription platform for tenants, plans, usage billing and analytics.',
    seoKeywords: ['saas development company', 'saas development', 'subscription management platform'],
  },
  'multi-branch-erp': {
    solutionGroup: 'enterprise-solutions',
    softwareType: 'Enterprise',
    platformType: 'web',
    title: 'Multi-Branch Business Management',
    seoTitle: 'Enterprise Multi-Branch Business Software Bangladesh',
    seoDescription: 'Enterprise software for multi-branch inventory, accounts and consolidated reports.',
    seoKeywords: [
      'enterprise solutions bangladesh',
      'multi branch erp',
      'custom software development',
      'business management software',
    ],
  },
};

function formatScreens(screens: Taxonomy['screens']): string {
  if (!screens) return '';
  const lines = screens
    .map((s) => `      { key: '${s.key}', name: '${s.name}', category: '${s.category}' }`)
    .join(',\n');
  return `[\n${lines}\n    ]`;
}

function formatKeywords(keywords: string[]): string {
  return `[${keywords.map((k) => `'${k.replace(/'/g, "\\'")}'`).join(', ')}]`;
}

const catalogPath = path.join(process.cwd(), 'src/features/software-showcase/seed/catalog.ts');
let source = readFileSync(catalogPath, 'utf8');

for (const [slug, tax] of Object.entries(TAXONOMY)) {
  const slugMarker = `slug: '${slug}',`;
  const idx = source.indexOf(slugMarker);
  if (idx < 0) {
    console.warn('Missing slug', slug);
    continue;
  }

  // Inject taxonomy after categorySlug line if not already present
  const blockStart = idx;
  const nextSlug = source.indexOf("\n  {\n    slug:", blockStart + 1);
  const blockEnd = nextSlug > 0 ? nextSlug : source.indexOf('\n];', blockStart);
  let block = source.slice(blockStart, blockEnd);

  if (!block.includes('solutionGroup:')) {
    block = block.replace(
      /(categorySlug: '[^']+',)/,
      `$1\n    solutionGroup: '${tax.solutionGroup}',\n    softwareType: '${tax.softwareType}',\n    platformType: '${tax.platformType}',`
    );
  } else {
    block = block
      .replace(/solutionGroup: '[^']+',/, `solutionGroup: '${tax.solutionGroup}',`)
      .replace(/softwareType: '[^']+',/, `softwareType: '${tax.softwareType}',`)
      .replace(/platformType: '[^']+',/, `platformType: '${tax.platformType}',`);
  }

  if (tax.title) {
    block = block.replace(/title: '[^']*',/, `title: '${tax.title}',`);
  }
  if (typeof tax.popular === 'boolean') {
    block = block.replace(/popular: (true|false),/, `popular: ${tax.popular},`);
  }
  if (typeof tax.featured === 'boolean') {
    block = block.replace(/featured: (true|false),/, `featured: ${tax.featured},`);
  }
  if (tax.seoTitle) {
    block = block.replace(/seoTitle: '[^']*',/, `seoTitle: '${tax.seoTitle.replace(/'/g, "\\'")}',`);
  }
  if (tax.seoDescription) {
    block = block.replace(
      /seoDescription: '[^']*',/,
      `seoDescription: '${tax.seoDescription.replace(/'/g, "\\'")}',`
    );
  }
  if (tax.seoKeywords) {
    block = block.replace(/seoKeywords: \[[^\]]*\],/, `seoKeywords: ${formatKeywords(tax.seoKeywords)},`);
  }
  if (tax.screens) {
    block = block.replace(/screens: \[[\s\S]*?\],\n    theme:/, `screens: ${formatScreens(tax.screens)},\n    theme:`);
  }

  // Clear popular for products not in the popular six (unless explicitly set)
  const popularSix = new Set([
    'garments-erp',
    'feed-mill-erp',
    'dealership-management',
    'retail-pos',
    'hr-payroll',
    'crm-system',
  ]);
  if (!popularSix.has(slug) && tax.popular === undefined) {
    block = block.replace(/popular: true,/, 'popular: false,');
  }

  source = source.slice(0, blockStart) + block + source.slice(blockEnd);
}

writeFileSync(catalogPath, source);
console.log('Patched catalog taxonomy for', Object.keys(TAXONOMY).length, 'products');
