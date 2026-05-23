import { getCategoryBySlug, listActiveCategories } from '@/lib/db/categories';
import { listProductsFiltered } from '@/lib/db/products';
import { mapCategoryRow, mapDbProductToService, SERVICE_PRODUCT_TYPES } from '@/lib/db/mappers';
import { toHomeCategoryId, HOME_TO_PRODUCT_CATEGORY } from '@/lib/catalog/category-keys';
import type { Category } from '@/types';
import type { Service } from '@/types';

/** Collapse DB rows that share the same homepage id (e.g. video-ads + video-advertising). */
function dedupeCategoriesByHomeId(categories: Category[]): Category[] {
  const byId = new Map<string, Category>();
  for (const cat of categories) {
    const existing = byId.get(cat.id);
    if (!existing) {
      byId.set(cat.id, cat);
      continue;
    }
    byId.set(cat.id, { ...existing, count: existing.count + cat.count });
  }
  return [...byId.values()];
}

export async function fetchAllCategories(): Promise<Category[]> {
  const { data } = await listActiveCategories();
  const counts: Record<string, number> = {};
  const mapped = data.map((row) => mapCategoryRow(row, counts[row.key] ?? row.sort_order * 10));
  return dedupeCategoriesByHomeId(mapped);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const bySlug = await getCategoryBySlug(slug);
  if (bySlug.data) return mapCategoryRow(bySlug.data, 0);
  const byKey = await getCategoryBySlug(slug);
  if (byKey.data) return mapCategoryRow(byKey.data, 0);
  const all = await fetchAllCategories();
  return all.find((c) => c.id === slug) ?? null;
}

export async function fetchCategoryServices(
  categorySlug: string,
  limit = 48
): Promise<Service[]> {
  const productKey = HOME_TO_PRODUCT_CATEGORY[categorySlug] ?? categorySlug;
  const result = await listProductsFiltered({
    categoryKey: productKey,
    productTypes: SERVICE_PRODUCT_TYPES,
    limit,
    sort: 'popular',
  });
  return result.data.map((row) =>
    mapDbProductToService(row as import('@/types/database.types').ProductWithRelations)
  );
}

export async function listCategorySlugs(): Promise<string[]> {
  const { data } = await listActiveCategories();
  return data.map((c) => c.slug);
}
