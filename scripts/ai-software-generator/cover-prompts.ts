import { designSystemPromptBlock } from './design-tokens';
import { dataPromptBlock, productBySlug } from './product-context';

const COVER_FOCUS: Record<string, string> = {
  'feed-mill-erp':
    'Feed mill / factory environment blended with a crisp ERP dashboard composition (operations cockpit). Software UI must dominate the frame.',
  'feed-production-management':
    'Production control room feel: batch tickets, mixer run status, and production dashboard — software-first.',
  'feed-formula-costing-software':
    'Formula builder + ingredient costing / nutrition panel visible on a large monitor — software-first.',
  'feed-dealer-distribution-management':
    'Dealer map / territory list with orders and dispatch board — software-first.',
  'feed-mill-inventory-warehouse':
    'Warehouse / godown with stock dashboard, lot cards, and reorder alerts — software-first.',
  'feed-mill-accounts-finance':
    'Finance desk with P&L and cash/bank dashboard — software-first.',
};

export function buildCoverPrompt(slug: string): string {
  const product = productBySlug(slug);
  if (!product) throw new Error(`Unknown Feed Mill product: ${slug}`);
  const focus = COVER_FOCUS[slug] ?? 'Premium enterprise software product cover.';

  return [
    `Premium product cover for Bridge IT Park software showcase.`,
    `Product: ${product.title} (${product.brandName}).`,
    `Purpose: ${product.purpose}.`,
    `Cover concept: ${focus}`,
    'Aspect ratio 16:9, marketing cover that still shows realistic ERP UI chrome.',
    'Avoid generic stock handshake photos; keep it software-first and Feed Mill specific.',
    designSystemPromptBlock(),
    dataPromptBlock(),
    'No watermarks, no fake logos other than a simple brand mark in the app chrome.',
  ].join('\n\n');
}
