import type { ExploreTypeId } from '@/components/explore/explore-types';
import { ROUTES } from '@/lib/routes';

const SOFTWARE_SIGNAL =
  /\b(erp|pos|crm|hrm|payroll|software|saas|inventory|warehouse|manufacturing|factory|mill|clinic|pharmacy|hospital|dealership|garments|poultry|dairy|bakery|logistics|courier|accounting|finance|management\s+system|admin\s+system)\b/i;

const MARKETING_SIGNAL =
  /\b(ads?|advertising|branding|brand\s+identity|logo|creative|marketing|social\s+media|meta\s+ads|facebook\s+ads|instagram|packaging|print|campaign|graphics?|design\s+pack)\b/i;

const WEBSITE_SIGNAL =
  /\b(website|storefront|ecommerce|e-?commerce|online\s+shop|store|shop\s+design|landing\s+page|fashion|beauty|grocery|electronics|furniture)\b/i;

/**
 * Infer which explore pillar a free-text query belongs to.
 * Software and marketing win over websites when clearly signaled.
 */
export function inferExploreType(query: string): ExploreTypeId {
  const q = query.trim();
  if (!q) return 'websites';

  if (SOFTWARE_SIGNAL.test(q)) return 'software';
  if (MARKETING_SIGNAL.test(q)) return 'marketing';
  if (WEBSITE_SIGNAL.test(q)) return 'websites';

  return 'websites';
}

export function buildExploreSearchUrl(options: {
  q?: string;
  type?: ExploreTypeId;
}): string {
  const q = options.q?.trim() ?? '';
  const type = options.type ?? (q ? inferExploreType(q) : 'websites');
  const params = new URLSearchParams();
  params.set('type', type);
  if (q) params.set('q', q);
  return `${ROUTES.explore}?${params.toString()}`;
}
