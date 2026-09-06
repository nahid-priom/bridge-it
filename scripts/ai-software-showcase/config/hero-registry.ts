/**
 * Hero visual registry — Phase 1 AI targets across the catalog.
 * Screen keys for gallery-missing products align with seed + DB rows.
 */

export type HeroDef = { key: string; title: string; purpose: string };

export type ProductHeroConfig = {
  slug: string;
  title: string;
  industry: string;
  brandName: string;
  coverFocus: string;
  heroes: HeroDef[];
  needsCoverUpgrade?: boolean;
  needsGallery?: boolean;
};

export const SVG_COVER_UPGRADE: ProductHeroConfig[] = [
  {
    slug: 'ecommerce-admin-dashboard',
    title: 'E-commerce Admin Dashboard',
    industry: 'ecommerce',
    brandName: 'ShopAdmin',
    coverFocus: 'E-commerce admin dashboard with orders, inventory and courier KPIs on a desktop monitor',
    needsCoverUpgrade: true,
    heroes: [
      { key: 'dashboard-overview', title: 'Dashboard Overview', purpose: 'Store ops cockpit' },
      { key: 'orders', title: 'Orders Management', purpose: 'Order pipeline' },
      { key: 'inventory', title: 'Inventory / Stock', purpose: 'Stock levels' },
      { key: 'courier', title: 'Courier Management', purpose: 'Delivery handoff' },
      { key: 'analytics', title: 'Analytics', purpose: 'Sales insights' },
    ],
  },
  {
    slug: 'garments-merchandising-management',
    title: 'Garments Merchandising Management',
    industry: 'garments',
    brandName: 'MerchDesk',
    coverFocus: 'Apparel merchandising board with style, buyer PO and TNA timeline on software UI',
    needsCoverUpgrade: true,
    heroes: [
      { key: 'dashboard', title: 'Merchandising Dashboard', purpose: 'Style/PO KPIs' },
      { key: 'styles', title: 'Styles', purpose: 'Style master' },
      { key: 'inquiries', title: 'Inquiries', purpose: 'Buyer inquiries' },
      { key: 'time-action-calendar', title: 'T&A Calendar', purpose: 'Time & action' },
      { key: 'reports', title: 'Reports', purpose: 'Merch reports' },
    ],
  },
  {
    slug: 'garments-cutting-sewing-management',
    title: 'Garments Cutting & Sewing Management',
    industry: 'garments',
    brandName: 'FloorOps',
    coverFocus: 'Cutting and sewing floor control board with line efficiency on ERP UI',
    needsCoverUpgrade: true,
    heroes: [
      { key: 'dashboard', title: 'Floor Dashboard', purpose: 'Line KPIs' },
      { key: 'cutting', title: 'Cutting', purpose: 'Cut plans' },
      { key: 'sewing', title: 'Sewing Lines', purpose: 'Line output' },
      { key: 'wip', title: 'WIP', purpose: 'Work in progress' },
      { key: 'reports', title: 'Reports', purpose: 'Production reports' },
    ],
  },
  {
    slug: 'garments-inventory-warehouse',
    title: 'Garments Inventory & Warehouse',
    industry: 'garments',
    brandName: 'FabricStore',
    coverFocus: 'Fabric and trim warehouse stock dashboard with lot control on software UI',
    needsCoverUpgrade: true,
    heroes: [
      { key: 'dashboard', title: 'Inventory Dashboard', purpose: 'Stock KPIs' },
      { key: 'fabric', title: 'Fabric Stock', purpose: 'Fabric rolls' },
      { key: 'trims', title: 'Trims', purpose: 'Trim inventory' },
      { key: 'grn', title: 'GRN', purpose: 'Receipts' },
      { key: 'reports', title: 'Reports', purpose: 'Stock reports' },
    ],
  },
  {
    slug: 'garments-hr-payroll',
    title: 'Garments HR & Payroll',
    industry: 'garments',
    brandName: 'ApparelHR',
    coverFocus: 'Factory HR and payroll dashboard with attendance and wage sheets on software UI',
    needsCoverUpgrade: true,
    heroes: [
      { key: 'dashboard', title: 'HR Dashboard', purpose: 'Workforce KPIs' },
      { key: 'attendance', title: 'Attendance', purpose: 'Daily attendance' },
      { key: 'payroll', title: 'Payroll', purpose: 'Wage processing' },
      { key: 'employees', title: 'Employees', purpose: 'Worker master' },
      { key: 'reports', title: 'Reports', purpose: 'HR reports' },
    ],
  },
  {
    slug: 'garments-commercial-export-management',
    title: 'Garments Commercial & Export Management',
    industry: 'garments',
    brandName: 'ExportDesk',
    coverFocus: 'Export commercial desk with LC, shipment and document checklist on software UI',
    needsCoverUpgrade: true,
    heroes: [
      { key: 'dashboard', title: 'Commercial Dashboard', purpose: 'Export KPIs' },
      { key: 'lc', title: 'LC Tracking', purpose: 'Letters of credit' },
      { key: 'shipment', title: 'Shipment', purpose: 'Export shipments' },
      { key: 'documents', title: 'Documents', purpose: 'Export docs' },
      { key: 'reports', title: 'Reports', purpose: 'Commercial reports' },
    ],
  },
];

/** Published products with no local gallery — Phase C (6 screens each for upload gate) */
export const GALLERY_MISSING_HEROES: ProductHeroConfig[] = [
  {
    slug: 'accounting-software',
    title: 'Accounting & Finance Software',
    industry: 'accounting',
    brandName: 'LedgerPro',
    coverFocus: 'Accounting desktop with P&L and cash/bank dashboard',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Finance Dashboard', purpose: 'Cash, bank, AR/AP' },
      { key: 'chart-of-accounts', title: 'Chart of Accounts', purpose: 'COA tree' },
      { key: 'journal', title: 'Journal', purpose: 'Voucher entry' },
      { key: 'ledger', title: 'Ledger', purpose: 'Account ledger' },
      { key: 'cash-bank', title: 'Cash & Bank', purpose: 'Cash/bank books' },
      { key: 'profit-loss', title: 'Profit & Loss', purpose: 'P&L report' },
    ],
  },
  {
    slug: 'ecommerce-management',
    title: 'E-commerce Management',
    industry: 'ecommerce',
    brandName: 'StoreOps',
    coverFocus: 'E-commerce operations dashboard with orders and catalog',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Store Dashboard', purpose: 'Sales KPIs' },
      { key: 'catalog', title: 'Catalog', purpose: 'Products' },
      { key: 'orders', title: 'Orders', purpose: 'Order list' },
      { key: 'customers', title: 'Customers', purpose: 'Customer CRM' },
      { key: 'inventory', title: 'Inventory', purpose: 'Stock' },
      { key: 'reports', title: 'Reports', purpose: 'Sales reports' },
    ],
  },
  {
    slug: 'ecommerce-admin-operations',
    title: 'E-commerce Operations Suite',
    industry: 'ecommerce',
    brandName: 'OpsSuite',
    coverFocus: 'Multi-channel e-commerce ops hub with orders, stock sync and courier desk',
    needsGallery: true,
    heroes: [
      { key: 'orders-hub', title: 'Orders Hub', purpose: 'Unified orders' },
      { key: 'stock-sync', title: 'Stock Sync', purpose: 'Channel stock' },
      { key: 'courier-desk', title: 'Courier Desk', purpose: 'Delivery' },
      { key: 'settlements', title: 'Settlements', purpose: 'COD settle' },
      { key: 'customers', title: 'Customers', purpose: 'Customer list' },
      { key: 'reports', title: 'Reports', purpose: 'Ops reports' },
    ],
  },
  {
    slug: 'facility-management-software',
    title: 'Facility Management Software',
    industry: 'facility',
    brandName: 'FacilityHQ',
    coverFocus: 'Facility maintenance dashboard with tickets and assets',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Facility Dashboard', purpose: 'Open tickets' },
      { key: 'work-orders', title: 'Work Orders', purpose: 'Maintenance jobs' },
      { key: 'assets', title: 'Assets', purpose: 'Asset register' },
      { key: 'vendors', title: 'Vendors', purpose: 'Service vendors' },
      { key: 'preventive', title: 'Preventive Maintenance', purpose: 'PPM' },
      { key: 'reports', title: 'Reports', purpose: 'SLA reports' },
    ],
  },
  {
    slug: 'furniture-manufacturing-erp',
    title: 'Furniture Manufacturing ERP',
    industry: 'furniture',
    brandName: 'FurniERP',
    coverFocus: 'Furniture factory ERP with BOM and production orders',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Factory Dashboard', purpose: 'Production KPIs' },
      { key: 'bom', title: 'BOM', purpose: 'Bills of materials' },
      { key: 'production', title: 'Production Orders', purpose: 'Shop floor' },
      { key: 'inventory', title: 'Inventory', purpose: 'Materials' },
      { key: 'costing', title: 'Costing', purpose: 'Job cost' },
      { key: 'reports', title: 'Reports', purpose: 'Cost reports' },
    ],
  },
  {
    slug: 'gym-management',
    title: 'Gym Management Software',
    industry: 'gym',
    brandName: 'GymDesk',
    coverFocus: 'Gym membership desk with attendance and payments',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Gym Dashboard', purpose: 'Members active' },
      { key: 'members', title: 'Members', purpose: 'Member list' },
      { key: 'membership', title: 'Membership', purpose: 'Plans' },
      { key: 'attendance', title: 'Attendance', purpose: 'Check-ins' },
      { key: 'trainers', title: 'Trainers', purpose: 'Trainer roster' },
      { key: 'payments', title: 'Payments', purpose: 'Fees' },
    ],
  },
  {
    slug: 'hotel-management',
    title: 'Hotel Management Software',
    industry: 'hotel',
    brandName: 'StayOS',
    coverFocus: 'Hotel front desk with room status and reservations',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Hotel Dashboard', purpose: 'Occupancy' },
      { key: 'reservations', title: 'Reservations', purpose: 'Bookings' },
      { key: 'rooms', title: 'Room Status', purpose: 'Housekeeping board' },
      { key: 'check-in', title: 'Guest Check-in', purpose: 'Front desk' },
      { key: 'housekeeping', title: 'Housekeeping', purpose: 'Room cleaning' },
      { key: 'billing', title: 'Billing', purpose: 'Folio' },
    ],
  },
  {
    slug: 'jewelry-erp',
    title: 'Jewelry ERP',
    industry: 'jewelry',
    brandName: 'JewelERP',
    coverFocus: 'Jewelry ERP with karat stock and order tracking',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Jewelry Dashboard', purpose: 'Gold stock' },
      { key: 'inventory', title: 'Karat Inventory', purpose: 'Stock by karat' },
      { key: 'orders', title: 'Customer Orders', purpose: 'Custom orders' },
      { key: 'tagging', title: 'Tagging', purpose: 'Item tags' },
      { key: 'sales', title: 'Sales', purpose: 'Counter sales' },
      { key: 'reports', title: 'Reports', purpose: 'Sales reports' },
    ],
  },
  {
    slug: 'microfinance-software',
    title: 'Microfinance Software',
    industry: 'microfinance',
    brandName: 'MicroLedger',
    coverFocus: 'Microfinance portfolio dashboard with loans and collections',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Portfolio Dashboard', purpose: 'PAR, collections' },
      { key: 'loans', title: 'Loans', purpose: 'Loan accounts' },
      { key: 'collections', title: 'Collections', purpose: 'Daily collection' },
      { key: 'members', title: 'Members', purpose: 'Borrowers' },
      { key: 'groups', title: 'Groups', purpose: 'Lending groups' },
      { key: 'reports', title: 'Reports', purpose: 'PAR reports' },
    ],
  },
  {
    slug: 'ngo-management',
    title: 'NGO Management Software',
    industry: 'ngo',
    brandName: 'NGODesk',
    coverFocus: 'NGO program dashboard with beneficiaries and funds',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Program Dashboard', purpose: 'Projects' },
      { key: 'beneficiaries', title: 'Beneficiaries', purpose: 'Member list' },
      { key: 'projects', title: 'Projects', purpose: 'Programs' },
      { key: 'funds', title: 'Funds', purpose: 'Donor funds' },
      { key: 'donors', title: 'Donors', purpose: 'Donor master' },
      { key: 'reports', title: 'Reports', purpose: 'Donor reports' },
    ],
  },
  {
    slug: 'procurement-software',
    title: 'Procurement Software',
    industry: 'procurement',
    brandName: 'ProcureOS',
    coverFocus: 'Procurement desk with PR, PO and vendor scorecards',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Procurement Dashboard', purpose: 'Open PRs/POs' },
      { key: 'requisitions', title: 'Requisitions', purpose: 'PR list' },
      { key: 'purchase-orders', title: 'Purchase Orders', purpose: 'PO list' },
      { key: 'vendors', title: 'Vendors', purpose: 'Vendor master' },
      { key: 'grn', title: 'GRN', purpose: 'Goods receipt' },
      { key: 'reports', title: 'Reports', purpose: 'Spend reports' },
    ],
  },
  {
    slug: 'professional-services-erp',
    title: 'Professional Services ERP',
    industry: 'services',
    brandName: 'ServiceERP',
    coverFocus: 'Professional services ERP with projects, time and billing',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Services Dashboard', purpose: 'Utilization' },
      { key: 'projects', title: 'Projects', purpose: 'Client projects' },
      { key: 'timesheets', title: 'Timesheets', purpose: 'Time entry' },
      { key: 'billing', title: 'Billing', purpose: 'Invoices' },
      { key: 'resources', title: 'Resources', purpose: 'Staffing' },
      { key: 'reports', title: 'Reports', purpose: 'Margin reports' },
    ],
  },
  {
    slug: 'rental-management',
    title: 'Rental Management Software',
    industry: 'rental',
    brandName: 'RentDesk',
    coverFocus: 'Equipment rental desk with bookings and returns',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Rental Dashboard', purpose: 'Utilization' },
      { key: 'assets', title: 'Rental Assets', purpose: 'Fleet/items' },
      { key: 'bookings', title: 'Bookings', purpose: 'Reservations' },
      { key: 'returns', title: 'Returns', purpose: 'Check-in' },
      { key: 'billing', title: 'Billing', purpose: 'Rental invoices' },
      { key: 'reports', title: 'Reports', purpose: 'Utilization reports' },
    ],
  },
  {
    slug: 'security-services-software',
    title: 'Security Services Software',
    industry: 'security',
    brandName: 'GuardOS',
    coverFocus: 'Security manpower roster and site attendance dashboard',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Security Dashboard', purpose: 'Sites active' },
      { key: 'sites', title: 'Sites', purpose: 'Client sites' },
      { key: 'roster', title: 'Roster', purpose: 'Shift roster' },
      { key: 'attendance', title: 'Attendance', purpose: 'Guard check-in' },
      { key: 'guards', title: 'Guards', purpose: 'Manpower' },
      { key: 'billing', title: 'Billing', purpose: 'Client billing' },
    ],
  },
  {
    slug: 'travel-tourism-software',
    title: 'Travel & Tourism Software',
    industry: 'travel',
    brandName: 'TourDesk',
    coverFocus: 'Travel agency desk with packages, bookings and payments',
    needsGallery: true,
    heroes: [
      { key: 'dashboard', title: 'Travel Dashboard', purpose: 'Bookings today' },
      { key: 'packages', title: 'Packages', purpose: 'Tour packages' },
      { key: 'bookings', title: 'Bookings', purpose: 'Customer bookings' },
      { key: 'payments', title: 'Payments', purpose: 'Receipts' },
      { key: 'suppliers', title: 'Suppliers', purpose: 'Hotels/airlines' },
      { key: 'visa', title: 'Visa Process', purpose: 'Visa tracking' },
    ],
  },
];

export const ALL_PHASE1_HERO_PRODUCTS: ProductHeroConfig[] = [
  ...SVG_COVER_UPGRADE,
  ...GALLERY_MISSING_HEROES,
];

export function screenPngName(slug: string, key: string): string {
  return `${slug}-${key}.png`;
}

export function coverPngName(slug: string): string {
  return `${slug}-cover.png`;
}

export function findHeroConfig(slug: string): ProductHeroConfig | undefined {
  return ALL_PHASE1_HERO_PRODUCTS.find((p) => p.slug === slug);
}

export function filterHeroProducts(opts: {
  slug?: string;
  industry?: string;
  coversOnly?: boolean;
  missingOnly?: boolean;
}): ProductHeroConfig[] {
  let list = ALL_PHASE1_HERO_PRODUCTS;
  if (opts.slug) list = list.filter((p) => p.slug === opts.slug);
  if (opts.industry) list = list.filter((p) => p.industry === opts.industry);
  if (opts.missingOnly) list = list.filter((p) => p.needsGallery || p.needsCoverUpgrade);
  if (opts.coversOnly) {
    /* keep products; generation CLI decides what to emit */
  }
  return list;
}
