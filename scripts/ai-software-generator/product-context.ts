/** Realistic Bangladesh Feed Mill product context for prompts. */

export type FeedMillProductContext = {
  slug: string;
  title: string;
  brandName: string;
  purpose: string;
  modules: string[];
};

export const FEED_MILL_DATA = {
  rawMaterials: [
    'Maize',
    'Soybean Meal',
    'Rice Polish',
    'Wheat Bran',
    'Soybean Oil',
    'DCP',
    'Limestone',
    'Salt',
    'Premix',
    'Methionine',
    'Lysine',
  ],
  finishedFeed: [
    'Broiler Starter',
    'Broiler Grower',
    'Broiler Finisher',
    'Layer Starter',
    'Layer Grower',
    'Sonali Feed',
  ],
  dealers: ['Agro Dealer North', 'Rangpur Feed Hub', 'Bogura Traders', 'Khulna Agro Mart'],
  units: ['KG', 'MT', 'Bags'],
  currency: 'BDT / ৳',
  warehouses: ['Raw Godown A', 'Raw Godown B', 'Finished Store 1'],
  roles: ['Mill Owner', 'Production Supervisor', 'Storekeeper', 'Sales Officer', 'Accountant'],
} as const;

export const FEED_MILL_PRODUCTS: FeedMillProductContext[] = [
  {
    slug: 'feed-mill-erp',
    title: 'Feed Mill ERP',
    brandName: 'FeedMill Pro',
    purpose: 'Complete feed mill operations from raw purchase to P&L',
    modules: [
      'Raw Materials',
      'Formula',
      'Production',
      'Finished Feed',
      'Dealer',
      'Dispatch',
      'Collection',
      'Accounts',
    ],
  },
  {
    slug: 'feed-production-management',
    title: 'Feed Production Management',
    brandName: 'FeedBatch',
    purpose: 'Production planning, batches, material issue, yield and finished feed',
    modules: ['Production Plan', 'Batch', 'Material Issue', 'Yield', 'Finished Feed'],
  },
  {
    slug: 'feed-formula-costing-software',
    title: 'Feed Formula & Costing Software',
    brandName: 'FormuLab',
    purpose: 'Formulation, nutrition targets, cost per ton and margin simulation',
    modules: ['Ingredients', 'Formula Builder', 'Cost/Ton', 'Nutrition', 'Versions'],
  },
  {
    slug: 'feed-dealer-distribution-management',
    title: 'Feed Dealer & Distribution Management',
    brandName: 'DealerNet',
    purpose: 'Dealer orders, credit, dispatch, collection and ledgers',
    modules: ['Dealers', 'Sales Order', 'Dispatch', 'Collection', 'Ledger'],
  },
  {
    slug: 'feed-mill-inventory-warehouse',
    title: 'Feed Mill Inventory & Warehouse',
    brandName: 'MillStore',
    purpose: 'Raw and finished warehouses, GRN, lots, reorder and valuation',
    modules: ['Raw Stock', 'Finished Feed', 'Warehouse', 'GRN', 'Reorder'],
  },
  {
    slug: 'feed-mill-accounts-finance',
    title: 'Feed Mill Accounts & Finance',
    brandName: 'MillBooks',
    purpose: 'Ledgers, cash/bank, receivables, payables and P&L',
    modules: ['COA', 'Ledger', 'Cash/Bank', 'Receivable', 'P&L'],
  },
];

export function productBySlug(slug: string): FeedMillProductContext | undefined {
  return FEED_MILL_PRODUCTS.find((p) => p.slug === slug);
}

export function dataPromptBlock(): string {
  return [
    'REALISTIC BANGLADESH FEED MILL DATA (required on screen):',
    `- Raw materials: ${FEED_MILL_DATA.rawMaterials.join(', ')}`,
    `- Finished feed: ${FEED_MILL_DATA.finishedFeed.join(', ')}`,
    `- Dealers: ${FEED_MILL_DATA.dealers.join(', ')}`,
    `- Units: ${FEED_MILL_DATA.units.join(', ')}; Currency: ${FEED_MILL_DATA.currency}`,
    `- Warehouses: ${FEED_MILL_DATA.warehouses.join(', ')}`,
    '- Use Batch No., Area, Sales Officer, Vehicle, Driver where relevant',
    '- Numbers must look realistic (e.g. Maize 128.5 MT, dealer due ৳4,85,000)',
  ].join('\n');
}
