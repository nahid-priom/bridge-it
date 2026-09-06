import { designSystemPromptBlock } from './design-tokens';
import { dataPromptBlock, productBySlug } from './product-context';
import { FEED_MILL_HERO_SET } from './feed-mill-hero-set';

const SCREEN_SPECS: Record<string, Record<string, string>> = {
  'feed-mill-erp': {
    dashboard:
      'Executive operations cockpit. KPIs: Raw Material Stock MT, Today Production MT, Finished Feed Stock, Dealer Receivable ৳, Today Sales ৳, Cash & Bank. Sections: production vs sales chart, raw stock low alerts (Maize below reorder), batch status table, dealer collection list. Alerts: Maize below reorder, dealer payment overdue, batch awaiting approval.',
    'production-planning':
      'Production planning board: planned batches by date, formula (Broiler Grower), target MT, mixer assignment, status Open/Scheduled. Filters by date and warehouse.',
    formula:
      'Formula builder for Broiler Starter: ingredient table (Maize, Soybean Meal, Rice Polish, Premix…) with KG and %, nutrient targets CP/ME, save/version actions.',
    'raw-stock':
      'Raw material stock ledger: item, lot, warehouse, qty MT/KG, reorder level, valuation ৳. Highlight Maize low stock. Search + warehouse filter.',
    'accounts-pnl':
      'Profit & Loss for current month: Sales, COGS, Gross Profit, Expenses, Net Profit in ৳. Simple bar comparison vs last month. Export button.',
  },
  'feed-production-management': {
    'production-dashboard':
      'Production dashboard: Today Batches, Plan vs Actual MT, Yield %, Wastage %, Finished MT. Batch status cards and alerts.',
    'production-plan':
      'Batch planning list: plan date, formula, target MT, material ready flag, status.',
    'material-issue':
      'Material issue voucher against batch: raw lines Maize/Soy issued KG, warehouse, issued by Storekeeper.',
    'production-entry':
      'Daily production entry: batch no, formula, actual output MT, bags, yield %, wastage.',
    reports:
      'Production report table by date range: batches, MT produced, yield, wastage, variance.',
  },
  'feed-formula-costing-software': {
    dashboard:
      'Formula costing dashboard: Active Formulas, Avg Cost/Ton ৳, Ingredient Cost Δ, Margin %.',
    'formula-builder':
      'Formula builder grid with nutrients and live cost/ton as ingredients change.',
    costing:
      'Cost analysis: ingredient cost breakdown, production cost/ton, margin vs selling price ৳.',
    nutrients:
      'Nutrition target panel: CP%, ME, Calcium, Lysine vs actual formula values with variance.',
    'formula-version':
      'Formula history versions table: v1–v4, changed by, cost/ton, approved status.',
  },
  'feed-dealer-distribution-management': {
    'sales-dashboard':
      'Dealer dashboard: Active Dealers, Today Orders, Dispatch MT, Collections ৳, Outstanding ৳, Target %.',
    'sales-order':
      'Sales order form: dealer Agro Dealer North, Broiler Finisher bags, rate ৳, credit check.',
    dispatch:
      'Dispatch challan: vehicle, driver, dealer, bags/MT, route North Zone, status Loaded.',
    collection:
      'Collection entry: dealer, receipt ৳, mode Cash/Bank, outstanding after payment.',
    'dealer-ledger':
      'Dealer ledger: debit/credit rows, running balance ৳, ageing buckets.',
  },
  'feed-mill-inventory-warehouse': {
    'inventory-dashboard':
      'Inventory dashboard: Raw Cover Days, Finished MT, Open GRNs, Reorder Alerts, QC Hold Lots, Stock Value ৳.',
    'raw-material':
      'Raw stock list with lots, godown, qty, reorder flag.',
    warehouses:
      'Warehouse master: Raw Godown A/B, Finished Store 1, capacity, current occupancy.',
    transfer:
      'Stock movement / transfer voucher between godowns with lot and qty.',
    reorder:
      'Reorder suggestions: Maize, Soybean Meal below min with suggested PO qty.',
  },
  'feed-mill-accounts-finance': {
    'finance-dashboard':
      'Finance dashboard: Cash, Bank, Receivables, Payables, Dealer Due, Month P&L ৳.',
    'profit-loss':
      'P&L statement detailed lines for feed business month.',
    ledger:
      'General ledger detail for Maize Purchase or Dealer receivable account.',
    cash:
      'Cash & bank books with recent receipts/payments and closing balance ৳.',
    receivables:
      'Receivable ageing: dealers by 0–30 / 31–60 / 60+ days with totals ৳.',
  },
};

export function buildScreenPrompt(slug: string, screenKey: string): string {
  const product = productBySlug(slug);
  if (!product) throw new Error(`Unknown product ${slug}`);
  const spec = SCREEN_SPECS[slug]?.[screenKey];
  if (!spec) throw new Error(`No screen spec for ${slug}/${screenKey}`);
  const hero = FEED_MILL_HERO_SET.find((p) => p.slug === slug)?.heroes.find((h) => h.key === screenKey);

  return [
    `Realistic desktop ERP software screenshot for Bridge IT Park showcase.`,
    `PRODUCT: ${product.title} (${product.brandName}) — ${product.purpose}`,
    `SCREEN: ${hero?.title ?? screenKey}`,
    `SCREEN PURPOSE & REQUIRED UI: ${spec}`,
    'Same product shell on every screen (identical sidebar, header, typography, colors).',
    'Aspect ratio 16:9 desktop UI mockup, sharp readable text, production-ready business software look.',
    designSystemPromptBlock(),
    dataPromptBlock(),
    'Do not invent unrelated modules. No English gibberish labels.',
  ].join('\n\n');
}

export function listHeroPrompts(): Array<{ slug: string; key: string; filename: string; prompt: string }> {
  const out: Array<{ slug: string; key: string; filename: string; prompt: string }> = [];
  for (const product of FEED_MILL_HERO_SET) {
    for (const hero of product.heroes) {
      out.push({
        slug: product.slug,
        key: hero.key,
        filename: `${product.slug}-${hero.key}.png`,
        prompt: buildScreenPrompt(product.slug, hero.key),
      });
    }
  }
  return out;
}
