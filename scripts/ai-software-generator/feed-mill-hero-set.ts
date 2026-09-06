/** Phase 1 hero matrix: 6 products × (1 cover + 5 screens). */

export type HeroScreen = { key: string; title: string };

export type FeedMillHeroProduct = {
  slug: string;
  coverFile: string;
  heroes: HeroScreen[];
};

export const FEED_MILL_HERO_SET: FeedMillHeroProduct[] = [
  {
    slug: 'feed-mill-erp',
    coverFile: 'feed-mill-erp-cover.png',
    heroes: [
      { key: 'dashboard', title: 'Executive Dashboard' },
      { key: 'production-planning', title: 'Production Planning' },
      { key: 'formula', title: 'Formula Builder' },
      { key: 'raw-stock', title: 'Raw Material Stock' },
      { key: 'accounts-pnl', title: 'Accounts / Profit & Loss' },
    ],
  },
  {
    slug: 'feed-production-management',
    coverFile: 'feed-production-management-cover.png',
    heroes: [
      { key: 'production-dashboard', title: 'Production Dashboard' },
      { key: 'production-plan', title: 'Batch Planning' },
      { key: 'material-issue', title: 'Material Issue' },
      { key: 'production-entry', title: 'Daily Production' },
      { key: 'reports', title: 'Production Report' },
    ],
  },
  {
    slug: 'feed-formula-costing-software',
    coverFile: 'feed-formula-costing-software-cover.png',
    heroes: [
      { key: 'dashboard', title: 'Formula Dashboard' },
      { key: 'formula-builder', title: 'Formula Builder' },
      { key: 'costing', title: 'Cost Analysis' },
      { key: 'nutrients', title: 'Nutrition Target' },
      { key: 'formula-version', title: 'Formula History' },
    ],
  },
  {
    slug: 'feed-dealer-distribution-management',
    coverFile: 'feed-dealer-distribution-management-cover.png',
    heroes: [
      { key: 'sales-dashboard', title: 'Dealer Dashboard' },
      { key: 'sales-order', title: 'Sales Order' },
      { key: 'dispatch', title: 'Dispatch' },
      { key: 'collection', title: 'Collection' },
      { key: 'dealer-ledger', title: 'Dealer Ledger' },
    ],
  },
  {
    slug: 'feed-mill-inventory-warehouse',
    coverFile: 'feed-mill-inventory-warehouse-cover.png',
    heroes: [
      { key: 'inventory-dashboard', title: 'Inventory Dashboard' },
      { key: 'raw-material', title: 'Raw Stock' },
      { key: 'warehouses', title: 'Warehouse' },
      { key: 'transfer', title: 'Stock Movement' },
      { key: 'reorder', title: 'Reorder' },
    ],
  },
  {
    slug: 'feed-mill-accounts-finance',
    coverFile: 'feed-mill-accounts-finance-cover.png',
    heroes: [
      { key: 'finance-dashboard', title: 'Finance Dashboard' },
      { key: 'profit-loss', title: 'Profit & Loss' },
      { key: 'ledger', title: 'Ledger' },
      { key: 'cash', title: 'Cash & Bank' },
      { key: 'receivables', title: 'Receivable' },
    ],
  },
];

export function screenPngName(slug: string, key: string): string {
  return `${slug}-${key}.png`;
}

export function allExpectedPngFiles(): string[] {
  const files: string[] = [];
  for (const product of FEED_MILL_HERO_SET) {
    files.push(product.coverFile);
    for (const hero of product.heroes) {
      files.push(screenPngName(product.slug, hero.key));
    }
  }
  return files;
}
