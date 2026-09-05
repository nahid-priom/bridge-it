import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import type { CatalogCategoryRoot, CatalogIndustry } from '../types';

const INDUSTRY_SELECT =
  'id, category_root, name, slug, short_description, description, seo_title, seo_description, seo_h1, seo_intro, taxonomy_type, is_featured, primary_keyword, secondary_keywords, sort_order, active, created_at, updated_at, deleted_at';

function mapIndustry(row: Record<string, unknown>): CatalogIndustry {
  return {
    id: String(row.id),
    category_root: row.category_root as CatalogCategoryRoot,
    name: String(row.name),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    seo_title: (row.seo_title as string | null) ?? null,
    seo_description: (row.seo_description as string | null) ?? null,
    seo_h1: (row.seo_h1 as string | null) ?? null,
    seo_intro: (row.seo_intro as string | null) ?? null,
    taxonomy_type: (row.taxonomy_type as string | null) ?? 'industry',
    is_featured: Boolean(row.is_featured),
    primary_keyword: (row.primary_keyword as string | null) ?? null,
    secondary_keywords: Array.isArray(row.secondary_keywords)
      ? (row.secondary_keywords as string[])
      : [],
    sort_order: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

async function listIndustriesUncached(
  root: CatalogCategoryRoot,
  includeInactive = false
): Promise<CatalogIndustry[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  let query = supabase
    .from('catalog_industries')
    .select(INDUSTRY_SELECT)
    .eq('category_root', root)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[catalog] listIndustries', error.message);
    return [];
  }

  return (data ?? []).map((row) => mapIndustry(row as Record<string, unknown>));
}

const listIndustriesCached = cache(async (root: CatalogCategoryRoot, includeInactive: boolean) =>
  listIndustriesUncached(root, includeInactive)
);

export async function listIndustries(
  root: CatalogCategoryRoot,
  options: { includeInactive?: boolean } = {}
): Promise<CatalogIndustry[]> {
  return listIndustriesCached(root, Boolean(options.includeInactive));
}

async function getIndustryByPathUncached(
  root: CatalogCategoryRoot,
  slug: string,
  includeInactive: boolean
): Promise<CatalogIndustry | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let query = supabase
    .from('catalog_industries')
    .select(INDUSTRY_SELECT)
    .eq('category_root', root)
    .eq('slug', slug)
    .is('deleted_at', null);

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error('[catalog] getIndustryByPath', error.message);
    return null;
  }
  if (!data) return null;
  return mapIndustry(data as Record<string, unknown>);
}

const getIndustryByPathCached = cache(getIndustryByPathUncached);

export async function getIndustryByPath(
  root: CatalogCategoryRoot,
  slug: string,
  options: { includeInactive?: boolean } = {}
): Promise<CatalogIndustry | null> {
  return getIndustryByPathCached(root, slug, Boolean(options.includeInactive));
}

export { mapIndustry, INDUSTRY_SELECT };
