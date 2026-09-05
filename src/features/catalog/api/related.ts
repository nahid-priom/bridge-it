import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import type { CatalogProductKind, CatalogRelatedProduct } from '../types';
import { getProductRefById } from './products';

const RELATED_SELECT = 'id, source_kind, source_id, related_kind, related_id, sort_order';

async function listRelatedProductsUncached(
  sourceKind: CatalogProductKind,
  sourceId: string,
  options: { limit?: number; includeDrafts?: boolean } = {}
): Promise<CatalogRelatedProduct[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const limit = Math.max(1, Math.min(options.limit ?? 8, 24));

  const { data, error } = await supabase
    .from('catalog_related_products')
    .select(RELATED_SELECT)
    .eq('source_kind', sourceKind)
    .eq('source_id', sourceId)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[catalog] listRelatedProducts', error.message);
    return [];
  }

  const rows = data ?? [];
  const results: CatalogRelatedProduct[] = [];

  for (const row of rows) {
    const relatedKind = String(row.related_kind) as CatalogProductKind;
    const relatedId = String(row.related_id);
    const product = await getProductRefById(relatedKind, relatedId, {
      includeDrafts: options.includeDrafts,
    });
    if (!product && !options.includeDrafts) continue;

    results.push({
      id: String(row.id),
      source_kind: String(row.source_kind) as CatalogProductKind,
      source_id: String(row.source_id),
      related_kind: relatedKind,
      related_id: relatedId,
      sort_order: Number(row.sort_order ?? 0),
      product,
    });
  }

  return results;
}

const listRelatedProductsCached = cache(
  async (sourceKind: CatalogProductKind, sourceId: string, limit: number, includeDrafts: boolean) =>
    listRelatedProductsUncached(sourceKind, sourceId, { limit, includeDrafts })
);

export async function listRelatedProducts(
  sourceKind: CatalogProductKind,
  sourceId: string,
  options: { limit?: number; includeDrafts?: boolean } = {}
): Promise<CatalogRelatedProduct[]> {
  return listRelatedProductsCached(
    sourceKind,
    sourceId,
    options.limit ?? 8,
    Boolean(options.includeDrafts)
  );
}
