import type { SeedSoftwareProduct } from '../../src/features/software-showcase/types';

export type VisualFamily =
  | 'operations-erp'
  | 'retail-pos'
  | 'manufacturing'
  | 'feed-mill'
  | 'garments'
  | 'healthcare'
  | 'education'
  | 'logistics'
  | 'crm-sales'
  | 'finance'
  | 'agro'
  | 'saas-admin'
  | 'distribution'
  | 'real-estate';

/** Maturity ladder for KPI density / sidebar depth (slug heuristics). */
export type MaturityProfile = 'starter' | 'production' | 'standard' | 'professional' | 'enterprise';

export function maturityProfile(p: SeedSoftwareProduct): MaturityProfile {
  const s = p.slug;
  if (/starter|mini/.test(s)) return 'starter';
  if (/production-management|basic/.test(s) && !/erp-professional|enterprise/.test(s)) return 'production';
  if (/enterprise/.test(s)) return 'enterprise';
  if (/professional/.test(s)) return 'professional';
  return 'standard';
}

export function visualFamily(p: SeedSoftwareProduct): VisualFamily {
  const t = p.softwareType.toLowerCase();
  const g = p.solutionGroup;
  const slug = p.slug;
  if (t === 'pos' || g === 'pos-retail') return 'retail-pos';
  if (slug.includes('feed-mill') || slug.startsWith('feed-')) return 'feed-mill';
  if (slug.includes('garment') || slug.includes('textile') || slug.includes('dyeing') || slug.includes('accessories'))
    return 'garments';
  if (t === 'crm' || g === 'crm-sales') return 'crm-sales';
  if (t === 'healthcare' || g === 'healthcare-software') return 'healthcare';
  if (t === 'education' || g === 'education-software') return 'education';
  if (t === 'logistics' || g === 'logistics-courier') return 'logistics';
  if (t === 'agro' || g === 'agro-farm-management') return 'agro';
  if (t === 'saas' || g === 'saas-platforms') return 'saas-admin';
  if (t === 'manufacturing' || g === 'manufacturing-production' || t === 'production' || t === 'formulation')
    return 'manufacturing';
  if (g === 'distribution-dealership' || g === 'distribution-wholesale' || /distribution|wholesale|dealership|trading/.test(slug))
    return 'distribution';
  if (/real-estate|property|construction/.test(slug)) return 'real-estate';
  if (t === 'hrm' || g === 'hrm-payroll' || g === 'accounting-finance' || /account|finance|payroll/i.test(t))
    return 'finance';
  return 'operations-erp';
}

export type DemoRow = {
  code: string;
  party: string;
  person: string;
  city: string;
  term: string;
  amount: number;
  qty: number;
  status: string;
  color: string;
  date: string;
  extra?: string;
};

type Dataset = {
  parties: string[];
  people: string[];
  cities: string[];
  products: string[];
  statuses: Array<[string, string]>;
};

const DATASETS: Record<VisualFamily, Dataset> = {
  'retail-pos': {
    parties: ['Urban Style', 'Fashion Point', 'City Mart', 'Style Hub BD', 'Plaza Retail', 'Green Bazar'],
    people: ['Karim Hossain', 'Nasrin Akter', 'Tanvir Ahmed', 'Sadia Khan', 'Imran Chowdhury'],
    cities: ['Dhaka', 'Chattogram', 'Gazipur', 'Sylhet', 'Khulna'],
    products: ['Casual Shirt', 'Denim Jeans', 'Sneakers', 'Cotton Tee', 'Baseball Cap', 'Leather Belt'],
    statuses: [
      ['Active', '#059669'],
      ['Low Stock', '#d97706'],
      ['Sold Out', '#dc2626'],
      ['Hold', '#64748b'],
    ],
  },
  healthcare: {
    parties: ['OPD Desk', 'Cardiology Ward', 'Lab Unit-A', 'Pharmacy Counter', 'Emergency'],
    people: ['Dr. Amit Verma', 'Dr. Farhana Begum', 'Nurse Rina', 'Dr. Jahid Hasan', 'Patient Rahul'],
    cities: ['Dhaka', 'Chattogram', 'Rajshahi'],
    products: ['CBC Panel', 'ECG', 'Admission', 'Discharge', 'Rx Refill'],
    statuses: [
      ['Admitted', '#059669'],
      ['Pending', '#d97706'],
      ['Discharged', '#0f766e'],
      ['Critical', '#dc2626'],
    ],
  },
  garments: {
    parties: ['H&M', 'Zara', 'M&S', 'Next', 'Primark', 'Export House BD'],
    people: ['Merch Lead', 'Cutting In-Charge', 'QC Officer', 'Floor Manager', 'IE Officer'],
    cities: ['Gazipur', 'Narayanganj', 'Dhaka', 'Ashulia', 'Savar'],
    products: ['GM-2401', 'GM-2402', 'GM-2403', 'Colorway Navy', 'Size XS-XXL', 'Sewing Line-3', 'Finish Pack'],
    statuses: [
      ['In Cutting', '#2563eb'],
      ['Sewing', '#d97706'],
      ['Finishing', '#7c3aed'],
      ['QC Pass', '#059669'],
      ['Shipped', '#0f766e'],
    ],
  },
  'feed-mill': {
    parties: ['Agro Dealer North', 'Poultry Hub BD', 'Cattle Feed Mart', 'Aqua Feed Co', 'District Depot'],
    people: ['Mill Owner', 'Mixer Operator', 'Store Keeper', 'QC Chemist', 'Sales Officer'],
    cities: ['Gazipur', 'Bogura', 'Jessore', 'Chattogram', 'Rangpur'],
    products: [
      'Maize',
      'Soybean Meal',
      'Rice Polish',
      'Wheat Bran',
      'Limestone',
      'Premix',
      'Broiler Starter',
      'Broiler Grower',
      'Broiler Finisher',
      'Layer Feed',
    ],
    statuses: [
      ['Mixing', '#2563eb'],
      ['QC Hold', '#d97706'],
      ['Bagged', '#059669'],
      ['Dispatched', '#0f766e'],
    ],
  },
  manufacturing: {
    parties: ['Plant A', 'Plant B', 'Vendor Steel', 'QC Lab', 'Dispatch Bay'],
    people: ['Shift Lead', 'Machine Operator', 'Store Keeper', 'Plant Manager'],
    cities: ['Gazipur', 'Chattogram', 'Khulna'],
    products: ['Batch-2401', 'Raw Coil', 'Finished SKU', 'BOM Line', 'Work Order'],
    statuses: [
      ['Running', '#059669'],
      ['Idle', '#64748b'],
      ['Maintenance', '#d97706'],
      ['Complete', '#0f766e'],
    ],
  },
  logistics: {
    parties: ['Route North', 'Depot South', 'Client Warehouse', 'Hub Center'],
    people: ['Driver Alam', 'Fleet Officer', 'Dispatcher', 'Helper Rony'],
    cities: ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Bogura'],
    products: ['Trip-8841', 'Vehicle DM-12', 'Fuel Slip', 'Delivery Note', 'Route Plan'],
    statuses: [
      ['En Route', '#2563eb'],
      ['Delivered', '#059669'],
      ['Delayed', '#d97706'],
      ['Cancelled', '#dc2626'],
    ],
  },
  'crm-sales': {
    parties: ['Lead Pipeline', 'Key Account', 'Prospect Hub', 'Partner Desk'],
    people: ['Sales Rep A', 'Sales Rep B', 'Account Manager', 'SDR'],
    cities: ['Dhaka', 'Chattogram', 'Sylhet'],
    products: ['Lead-Q3', 'Quote-118', 'Visit Plan', 'Follow-up Call', 'Win Deal'],
    statuses: [
      ['New', '#2563eb'],
      ['Contacted', '#d97706'],
      ['Proposal', '#7c3aed'],
      ['Won', '#059669'],
    ],
  },
  agro: {
    parties: ['Dealer Network', 'Farm Unit-2', 'Feed Godown', 'Collection Point'],
    people: ['Farm Manager', 'Technician', 'Dealer Kabir', 'Accountant'],
    cities: ['Gazipur', 'Mymensingh', 'Bogura', 'Cumilla'],
    products: ['Broiler Batch', 'Layer Flock', 'Feed Formula', 'Mortality Log', 'Egg Collection'],
    statuses: [
      ['Healthy', '#059669'],
      ['Watch', '#d97706'],
      ['Vaccinated', '#2563eb'],
      ['Sold', '#0f766e'],
    ],
  },
  education: {
    parties: ['Class 9-A', 'Accounts Desk', 'Admission Cell', 'Exam Board'],
    people: ['Teacher Salma', 'Guardian Karim', 'Student Nabila', 'Principal'],
    cities: ['Dhaka', 'Chattogram', 'Rajshahi'],
    products: ['Fee Invoice', 'Attendance', 'Result Sheet', 'Admission Form'],
    statuses: [
      ['Paid', '#059669'],
      ['Due', '#d97706'],
      ['Absent', '#dc2626'],
      ['Present', '#2563eb'],
    ],
  },
  'real-estate': {
    parties: ['Project Green Valley', 'Tower-B', 'Broker Desk', 'Land Owner'],
    people: ['Site Engineer', 'Sales Consultant', 'Buyer Rahman', 'Collection Officer'],
    cities: ['Dhaka', 'Purbachal', 'Bashundhara'],
    products: ['Unit A-1204', 'Installment', 'Booking Form', 'Handover'],
    statuses: [
      ['Available', '#059669'],
      ['Booked', '#d97706'],
      ['Sold', '#0f766e'],
      ['Under Const.', '#2563eb'],
    ],
  },
  'saas-admin': {
    parties: ['Tenant Acme', 'Tenant Nova', 'Billing Ops', 'Support Queue'],
    people: ['CS Lead', 'Billing Analyst', 'Tenant Admin', 'Support Agent'],
    cities: ['Dhaka', 'Remote'],
    products: ['Plan Growth', 'Seat Add-on', 'Invoice', 'Usage Meter'],
    statuses: [
      ['Active', '#059669'],
      ['Trial', '#2563eb'],
      ['Past Due', '#d97706'],
      ['Churned', '#dc2626'],
    ],
  },
  distribution: {
    parties: ['Dealer Sylhet', 'Distributor CTG', 'Van Sales', 'Godown Central'],
    people: ['Area Manager', 'Van Seller', 'Godown Keeper', 'Collector'],
    cities: ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna'],
    products: ['SR Order', 'Primary Invoice', 'Secondary Sale', 'Return Note'],
    statuses: [
      ['Dispatched', '#2563eb'],
      ['Delivered', '#059669'],
      ['Partial', '#d97706'],
      ['Returned', '#dc2626'],
    ],
  },
  finance: {
    parties: ['Payroll Run', 'Bank Branch', 'Vendor Bill', 'Employee Desk'],
    people: ['HR Officer', 'Payroll Clerk', 'Finance Head', 'Employee'],
    cities: ['Dhaka', 'Chattogram'],
    products: ['Payslip', 'Attendance', 'Leave Request', 'Bank Advice'],
    statuses: [
      ['Posted', '#059669'],
      ['Draft', '#64748b'],
      ['Pending', '#d97706'],
      ['Approved', '#2563eb'],
    ],
  },
  'operations-erp': {
    parties: ['Branch North', 'Branch South', 'Vendor Desk', 'Accounts'],
    people: ['Ops Manager', 'Store Lead', 'Accountant', 'Supervisor'],
    cities: ['Dhaka', 'Chattogram', 'Gazipur', 'Khulna'],
    products: ['Work Order', 'Stock Move', 'Invoice', 'Receipt'],
    statuses: [
      ['Active', '#059669'],
      ['Pending', '#d97706'],
      ['In Progress', '#2563eb'],
      ['Closed', '#64748b'],
    ],
  },
};

export function hashSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length];
}

export function getDataset(family: VisualFamily): Dataset {
  return DATASETS[family];
}

export function demoRows(product: SeedSoftwareProduct, family: VisualFamily, count = 7): DemoRow[] {
  const ds = getDataset(family);
  const h = hashSlug(product.slug);
  return Array.from({ length: count }, (_, r) => {
    const [status, color] = pick(ds.statuses, r + (h % 3));
    const term = pick(product.terminology.length ? product.terminology : ds.products, r + h);
    const productName = pick(ds.products, r + h);
    const code = `${String(term).slice(0, 3).toUpperCase().replace(/\s/g, '')}-${1000 + ((h + r * 11) % 8000)}`;
    return {
      code,
      party: pick(ds.parties, h + r * 3),
      person: pick(ds.people, h + r * 5),
      city: pick(ds.cities, h + r * 2),
      term: productName,
      amount: 8500 + ((h + r * 97) % 185000),
      qty: 2 + ((h + r * 13) % 120),
      status,
      color,
      date: `2026-09-${String(1 + (r % 28)).padStart(2, '0')}`,
      extra: pick(ds.products, r + 2),
    };
  });
}

export function money(n: number) {
  return `৳${Math.round(n).toLocaleString('en-BD')}`;
}

export function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function kpiValue(product: SeedSoftwareProduct, i: number): string {
  const h = hashSlug(product.slug);
  const base = [
    money(42000 + ((h >> (i * 3)) % 90000)),
    pct(72 + ((h >> (i + 2)) % 25) + i * 0.3),
    money(180000 + ((h >> i) % 400000)),
    String(12 + ((h + i * 7) % 48)),
    money(9500 + ((h >> (i + 1)) % 40000)),
    String(3 + ((h + i) % 14)),
  ];
  return base[i % base.length];
}

export function brandOf(product: SeedSoftwareProduct) {
  return product.brandName || product.title;
}

export function logoOf(product: SeedSoftwareProduct) {
  return product.logoText || brandOf(product).split(/\s+/)[0].slice(0, 2).toUpperCase();
}

export function deriveQuickActions(product: SeedSoftwareProduct, family: VisualFamily): string[] {
  const term = (n: number) => product.terminology[n % Math.max(product.terminology.length, 1)] || 'Record';
  switch (family) {
    case 'retail-pos':
      return ['New Sale', 'Open Shift', `Add ${term(0)}`, 'Cash Close'];
    case 'crm-sales':
      return ['New Lead', 'Log Call', 'Create Quote', 'Schedule Visit'];
    case 'manufacturing':
    case 'feed-mill':
    case 'garments':
      return ['Production Batch', `New ${term(0)}`, 'Issue Materials', 'QC Release'];
    case 'healthcare':
      return ['New Appointment', 'Admit Patient', 'Lab Order', 'Discharge'];
    case 'logistics':
      return ['Book Trip', 'Assign Vehicle', 'Fuel Entry', 'Confirm Delivery'];
    case 'agro':
      return [`New ${term(0)}`, 'Record Collection', 'Feed Issue', 'Sale Entry'];
    case 'education':
      return ['New Admission', 'Collect Fee', 'Mark Attendance', 'Publish Result'];
    case 'saas-admin':
      return ['New Tenant', 'Invite User', 'Create Plan', 'View Usage'];
    case 'finance':
      return ['New Voucher', 'Run Payroll', 'Post Payment', 'Bank Reconcile'];
    case 'distribution':
      return ['New Order', 'Allocate Stock', 'Dispatch', 'Collect Payment'];
    case 'real-estate':
      return ['New Booking', 'Collect Installment', 'Unit Handover', 'Site Visit'];
    default:
      return [`New ${term(0)}`, `Create ${product.modules[0] || term(1)}`, 'Receive Payment', 'Export Report'];
  }
}
