import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import type { CatalogFaq, CatalogFaqScope } from '../types';

const FAQ_SELECT =
  'id, category_root, industry_id, product_kind, product_id, question, answer, sort_order, active';

function mapFaq(row: Record<string, unknown>): CatalogFaq {
  return {
    id: String(row.id),
    category_root: (row.category_root as CatalogFaq['category_root']) ?? null,
    industry_id: (row.industry_id as string | null) ?? null,
    product_kind: (row.product_kind as CatalogFaq['product_kind']) ?? null,
    product_id: (row.product_id as string | null) ?? null,
    question: String(row.question),
    answer: String(row.answer),
    sort_order: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

function scopeCacheKey(scope: CatalogFaqScope): string {
  return JSON.stringify({
    categoryRoot: scope.categoryRoot ?? null,
    industryId: scope.industryId ?? null,
    productKind: scope.productKind ?? null,
    productId: scope.productId ?? null,
  });
}

async function listFaqsUncached(scope: CatalogFaqScope): Promise<CatalogFaq[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  let query = supabase
    .from('catalog_faqs')
    .select(FAQ_SELECT)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  // Prefer most specific scope available
  if (scope.productKind && scope.productId) {
    query = query.eq('product_kind', scope.productKind).eq('product_id', scope.productId);
  } else if (scope.industryId) {
    query = query.eq('industry_id', scope.industryId).is('product_id', null);
  } else if (scope.categoryRoot) {
    query = query
      .eq('category_root', scope.categoryRoot)
      .is('industry_id', null)
      .is('product_id', null);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) {
    console.error('[catalog] listFaqs', error.message);
    return [];
  }

  return (data ?? []).map((row) => mapFaq(row as Record<string, unknown>));
}

const listFaqsCached = cache(async (key: string) => {
  const scope = JSON.parse(key) as CatalogFaqScope;
  return listFaqsUncached(scope);
});

export async function listFaqs(scope: CatalogFaqScope): Promise<CatalogFaq[]> {
  return listFaqsCached(scopeCacheKey(scope));
}
