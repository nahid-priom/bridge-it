import 'server-only';

import { cache } from 'react';
import { getAdminClient, getServerClient } from '@/lib/services/client';
import {
  applyTokenizedIlikeFilter,
  ECOMMERCE_SEARCH_FIELDS,
  sanitizeShowcaseQuery,
} from '@/lib/search/showcaseSearch';
import { GALLERY_PAGE_SIZE, HOMEPAGE_LEGACY_CATEGORY_SECTIONS, HOMEPAGE_SECTIONS, HOMEPAGE_SECTION_MAX, TECHNOLOGY_OPTIONS } from '../config/constants';
import { parseFilterList } from '../utils/filters';
import type {
  EcommerceCategory,
  EcommercePackage,
  EcommerceProject,
  EcommerceProjectCard,
  EcommerceProjectDetail,
  EcommerceProjectPage,
  EcommerceTechnology,
  HomepageLegacyCategorySection,
  HomepageSectionKey,
  HomepageSectionsResult,
  ShowcaseListFilters,
  ShowcaseListResult,
} from '../types';
import { getPublicAssetUrl } from '@/src/features/catalog/utils/cover';

type Db = NonNullable<Awaited<ReturnType<typeof getServerClient>>>;

function mapCard(row: Record<string, unknown>): EcommerceProjectCard {
  const cover_image_url = getPublicAssetUrl((row.cover_image_url as string | null) ?? null);
  const cover_fallback_url = getPublicAssetUrl((row.cover_fallback_url as string | null) ?? null);
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    technology_stack: (row.technology_stack as string[]) ?? [],
    website_type: (row.website_type as string | null) ?? null,
    industry: (row.industry as string | null) ?? null,
    industry_id: (row.industry_id as string | null) ?? null,
    industry_slug: (row.industry_slug as string | null) ?? null,
    industry_name: (row.industry_name as string | null) ?? null,
    canonical_path: (row.canonical_path as string | null) ?? null,
    cover_image_url,
    cover_fallback_url,
    coverImageUrl: cover_image_url ?? cover_fallback_url,
    coverImageFallbackUrl:
      cover_fallback_url && cover_fallback_url !== cover_image_url ? cover_fallback_url : null,
    starting_price: Number(row.starting_price ?? 0),
    currency: String(row.currency ?? 'BDT'),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    sort_order: Number(row.sort_order ?? 0),
    rating_avg: row.rating_avg != null ? Number(row.rating_avg) : undefined,
    review_count: row.review_count != null ? Number(row.review_count) : undefined,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    category_name: (row.category_name as string | null) ?? null,
    category_slug: (row.category_slug as string | null) ?? null,
    page_count: Number(row.page_count ?? 0),
    page_types: Array.isArray(row.page_types) ? (row.page_types as string[]) : [],
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapProject(row: Record<string, unknown>): EcommerceProject {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    full_description: (row.full_description as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    technology_stack: (row.technology_stack as string[]) ?? [],
    website_type: (row.website_type as string | null) ?? null,
    industry: (row.industry as string | null) ?? null,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    cover_image_path: (row.cover_image_path as string | null) ?? null,
    cover_fallback_url: (row.cover_fallback_url as string | null) ?? null,
    cover_fallback_path: (row.cover_fallback_path as string | null) ?? null,
    og_image_url: (row.og_image_url as string | null) ?? null,
    starting_price: Number(row.starting_price ?? 0),
    currency: String(row.currency ?? 'BDT'),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    seo_title: (row.seo_title as string | null) ?? null,
    seo_description: (row.seo_description as string | null) ?? null,
    seo_keywords: (row.seo_keywords as string[]) ?? [],
    sort_order: Number(row.sort_order ?? 0),
    rating_avg: row.rating_avg != null ? Number(row.rating_avg) : undefined,
    review_count: row.review_count != null ? Number(row.review_count) : undefined,
    created_by: (row.created_by as string | null) ?? null,
    updated_by: (row.updated_by as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapPage(row: Record<string, unknown>): EcommerceProjectPage {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    page_type: String(row.page_type),
    page_name: String(row.page_name),
    slug: String(row.slug),
    image_url: (row.image_url as string | null) ?? null,
    image_path: (row.image_path as string | null) ?? null,
    fallback_url: (row.fallback_url as string | null) ?? null,
    fallback_path: (row.fallback_path as string | null) ?? null,
    thumbnail_url: (row.thumbnail_url as string | null) ?? null,
    thumbnail_path: (row.thumbnail_path as string | null) ?? null,
    image_width: row.image_width == null ? null : Number(row.image_width),
    image_height: row.image_height == null ? null : Number(row.image_height),
    sort_order: Number(row.sort_order ?? 0),
    is_featured: Boolean(row.is_featured),
    published: Boolean(row.published),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapPackage(row: Record<string, unknown>): EcommercePackage {
  const features = Array.isArray(row.features)
    ? (row.features as unknown[]).map((item) => String(item))
    : [];
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    name: String(row.name),
    price: Number(row.price ?? 0),
    currency: String(row.currency ?? 'BDT'),
    short_description: (row.short_description as string | null) ?? null,
    features,
    is_popular: Boolean(row.is_popular),
    sort_order: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

export async function listCategories(includeInactive = false): Promise<EcommerceCategory[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];
  let query = supabase
    .from('ecommerce_categories')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  if (!includeInactive) query = query.eq('active', true);
  const { data } = await query;
  return (data ?? []) as EcommerceCategory[];
}

export async function listTechnologies(): Promise<EcommerceTechnology[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('ecommerce_technologies')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data ?? []) as EcommerceTechnology[];
}

export const getCategoryBySlug = cache(async (slug: string): Promise<EcommerceCategory | null> => {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from('ecommerce_categories')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  return (data as EcommerceCategory | null) ?? null;
});

async function matchingProjectIdsForPageTypes(supabase: Db, pageTypes: string[]): Promise<string[]> {
  if (pageTypes.length === 0) return [];
  const { data } = await supabase
    .from('ecommerce_project_pages')
    .select('project_id')
    .in('page_type', pageTypes)
    .eq('published', true)
    .is('deleted_at', null);
  return [...new Set((data ?? []).map((row) => String((row as { project_id: string }).project_id)))];
}

async function pageTypesByProjectIds(
  supabase: Db,
  projectIds: string[]
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (projectIds.length === 0) return map;
  const { data } = await supabase
    .from('ecommerce_project_pages')
    .select('project_id, page_type')
    .in('project_id', projectIds)
    .eq('published', true)
    .is('deleted_at', null);
  for (const row of data ?? []) {
    const projectId = String((row as { project_id: string }).project_id);
    const pageType = String((row as { page_type: string }).page_type);
    const current = map.get(projectId) ?? [];
    if (!current.includes(pageType)) current.push(pageType);
    map.set(projectId, current);
  }
  return map;
}

const ECOMMERCE_CARD_SELECT =
  'id, title, slug, short_description, category_id, category_name, category_slug, industry, industry_id, industry_slug, industry_name, canonical_path, technology_stack, cover_image_url, cover_fallback_url, starting_price, currency, featured, published, sort_order, created_at, updated_at, deleted_at, page_count, rating_avg, review_count';

async function listProjectCardsViaFallback(
  supabase: Db,
  filters: ShowcaseListFilters,
  options: { includeDrafts?: boolean },
  limit: number,
  offset: number,
  pageTypes: string[],
  categories: string[],
  q: string
): Promise<ShowcaseListResult> {
  let query = supabase
    .from('ecommerce_project_cards')
    .select(ECOMMERCE_CARD_SELECT, { count: 'exact' })
    .is('deleted_at', null);

  if (!options.includeDrafts) {
    query = query.eq('published', true);
  } else if (filters.published === true) {
    query = query.eq('published', true);
  } else if (filters.published === false) {
    query = query.eq('published', false);
  }

  if (q) {
    query = applyTokenizedIlikeFilter(query, q, ECOMMERCE_SEARCH_FIELDS);
  }
  if (categories.length === 1) query = query.eq('category_slug', categories[0]);
  else if (categories.length > 1) query = query.in('category_slug', categories);
  if (filters.industrySlug && filters.industrySlug !== 'all') {
    const slug = filters.industrySlug.replace(/,/g, '');
    query = query.or(`industry_slug.eq.${slug},category_slug.eq.${slug}`);
  }
  if (filters.tech) {
    const techName =
      TECHNOLOGY_OPTIONS.find((item) => item.slug === filters.tech || item.id === filters.tech)?.id ??
      filters.tech;
    query = query.contains('technology_stack', [techName]);
  }
  if (filters.industry) query = query.eq('industry', filters.industry);
  if (filters.websiteType) query = query.eq('website_type', filters.websiteType);
  if (filters.featured) query = query.eq('featured', true);
  if (filters.minPrice != null) query = query.gte('starting_price', filters.minPrice);
  if (filters.maxPrice != null) query = query.lte('starting_price', filters.maxPrice);

  if (pageTypes.length > 0) {
    const ids = await matchingProjectIdsForPageTypes(supabase, pageTypes);
    if (ids.length === 0) return { items: [], total: 0 };
    query = query.in('id', ids);
  }

  const { data, count, error } = await query
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[showcase] listProjectCards fallback', error.message);
    return { items: [], total: 0 };
  }

  const rows = data ?? [];
  const pageTypesMap = await pageTypesByProjectIds(
    supabase,
    rows.map((row) => String((row as { id: string }).id))
  );

  return {
    items: rows.map((row) => {
      const card = mapCard(row as Record<string, unknown>);
      return { ...card, page_types: pageTypesMap.get(card.id) ?? [] };
    }),
    total: count ?? 0,
  };
}

async function listProjectCardsUncached(
  filters: ShowcaseListFilters = {},
  options: { includeDrafts?: boolean } = {}
): Promise<ShowcaseListResult> {
  const supabase = await getServerClient();
  if (!supabase) return { items: [], total: 0 };

  const limit = filters.limit ?? GALLERY_PAGE_SIZE;
  const offset = filters.offset ?? 0;
  const pageTypes = parseFilterList(filters.view || filters.page);
  const categories = parseFilterList(filters.category);
  const q = sanitizeShowcaseQuery(filters.q);

  const techName = filters.tech
    ? TECHNOLOGY_OPTIONS.find((item) => item.slug === filters.tech || item.id === filters.tech)?.id ??
      filters.tech
    : null;

  const { data: rpcRows, error: rpcError } = await supabase.rpc('search_ecommerce_project_cards', {
    p_q: q || null,
    p_category_slugs: categories.length > 0 ? categories : null,
    p_industry_slug: filters.industrySlug && filters.industrySlug !== 'all' ? filters.industrySlug : null,
    p_tech: techName,
    p_industry: filters.industry || null,
    p_website_type: filters.websiteType || null,
    p_featured: filters.featured ? true : null,
    p_min_price: filters.minPrice ?? null,
    p_max_price: filters.maxPrice ?? null,
    p_page_types: pageTypes.length > 0 ? pageTypes : null,
    p_include_drafts: Boolean(options.includeDrafts),
    p_published: filters.published ?? null,
    p_limit: limit,
    p_offset: offset,
  });

  if (rpcError) {
    console.warn('[showcase] listProjectCards RPC fallback', rpcError.message);
    return listProjectCardsViaFallback(
      supabase,
      filters,
      options,
      limit,
      offset,
      pageTypes,
      categories,
      q
    );
  }

  const rows = (rpcRows ?? []) as Record<string, unknown>[];
  const total = rows.length > 0 ? Number(rows[0]!.total_count ?? 0) : 0;
  const pageTypesMap = await pageTypesByProjectIds(
    supabase,
    rows.map((row) => String(row.id))
  );

  return {
    items: rows.map((row) => {
      const card = mapCard(row);
      return { ...card, page_types: pageTypesMap.get(card.id) ?? [] };
    }),
    total,
  };
}

const listProjectCardsCached = cache(async (filtersKey: string, includeDrafts: boolean) => {
  const filters = JSON.parse(filtersKey) as ShowcaseListFilters;
  return listProjectCardsUncached(filters, { includeDrafts });
});

export async function listProjectCards(
  filters: ShowcaseListFilters = {},
  options: { includeDrafts?: boolean } = {}
): Promise<ShowcaseListResult> {
  const key = JSON.stringify({
    q: filters.q ?? null,
    category: filters.category ?? null,
    tech: filters.tech ?? null,
    industry: filters.industry ?? null,
    industrySlug: filters.industrySlug ?? null,
    websiteType: filters.websiteType ?? null,
    featured: filters.featured ?? null,
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    view: filters.view ?? null,
    page: filters.page ?? null,
    published: filters.published ?? null,
    limit: filters.limit ?? null,
    offset: filters.offset ?? null,
  });
  return listProjectCardsCached(key, Boolean(options.includeDrafts));
}

async function getProjectBySlugUncached(
  slug: string,
  includeDrafts: boolean
): Promise<EcommerceProjectDetail | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let projectQuery = supabase.from('ecommerce_projects').select('*').eq('slug', slug).is('deleted_at', null);
  if (!includeDrafts) projectQuery = projectQuery.eq('published', true);

  const { data: projectRow } = await projectQuery.maybeSingle();
  if (!projectRow) return null;
  const project = mapProject(projectRow as Record<string, unknown>);

  const [{ data: pages }, { data: packages }, { data: category }] = await Promise.all([
    supabase
      .from('ecommerce_project_pages')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('ecommerce_packages')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    project.category_id
      ? supabase
          .from('ecommerce_categories')
          .select('id, name, slug')
          .eq('id', project.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const publicPages = (pages ?? [])
    .map((row) => mapPage(row as Record<string, unknown>))
    .filter((page) => includeDrafts || page.published);

  return {
    ...project,
    category: (category as Pick<EcommerceCategory, 'id' | 'name' | 'slug'> | null) ?? null,
    pages: publicPages,
    packages: (packages ?? []).map((row) => mapPackage(row as Record<string, unknown>)),
  };
}

const getProjectBySlugCached = cache(getProjectBySlugUncached);

export async function getProjectBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<EcommerceProjectDetail | null> {
  return getProjectBySlugCached(slug, Boolean(options.includeDrafts));
}

export async function getProjectById(id: string): Promise<EcommerceProjectDetail | null> {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data: projectRow } = await supabase.from('ecommerce_projects').select('*').eq('id', id).maybeSingle();
  if (!projectRow) return null;
  const project = mapProject(projectRow as Record<string, unknown>);
  const [{ data: pages }, { data: packages }, { data: category }] = await Promise.all([
    supabase
      .from('ecommerce_project_pages')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('ecommerce_packages')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    project.category_id
      ? supabase.from('ecommerce_categories').select('id, name, slug').eq('id', project.category_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  return {
    ...project,
    category: (category as Pick<EcommerceCategory, 'id' | 'name' | 'slug'> | null) ?? null,
    pages: (pages ?? []).map((row) => mapPage(row as Record<string, unknown>)),
    packages: (packages ?? []).map((row) => mapPackage(row as Record<string, unknown>)),
  };
}

function emptyHomepageSections(): HomepageSectionsResult {
  return {
    fashion_lifestyle: [],
    electronics_gadgets: [],
    popular: [],
  };
}

const HOMEPAGE_WEBSITE_CARD_SELECT =
  'id, title, slug, short_description, category_id, category_name, category_slug, industry, industry_id, industry_slug, industry_name, canonical_path, technology_stack, cover_image_url, cover_fallback_url, starting_price, currency, featured, published, sort_order, created_at, updated_at, deleted_at, page_count, rating_avg, review_count';

async function listHomepageSectionsUncached(): Promise<HomepageSectionsResult> {
  const supabase = await getServerClient();
  if (!supabase) return emptyHomepageSections();

  // Placements for order, then hydrate full PortfolioCard fields from cards view.
  const { data: placements, error: placementError } = await supabase
    .from('ecommerce_homepage_placements')
    .select('section_key, sort_order, project_id')
    .eq('active', true)
    .order('section_key', { ascending: true })
    .order('sort_order', { ascending: true });

  if (placementError) {
    console.error('[showcase] listHomepageSections placements', placementError.message);
    return emptyHomepageSections();
  }

  const projectIds = [
    ...new Set(
      (placements ?? [])
        .map((row) => String((row as { project_id: string }).project_id))
        .filter(Boolean)
    ),
  ];

  if (projectIds.length === 0) return emptyHomepageSections();

  const { data: cardRows, error: cardsError } = await supabase
    .from('ecommerce_project_cards')
    .select(HOMEPAGE_WEBSITE_CARD_SELECT)
    .in('id', projectIds)
    .eq('published', true)
    .is('deleted_at', null);

  if (cardsError) {
    console.error('[showcase] listHomepageSections cards', cardsError.message);
    return emptyHomepageSections();
  }

  const cardById = new Map(
    (cardRows ?? []).map((row) => {
      const card = mapCard(row as Record<string, unknown>);
      return [card.id, card] as const;
    })
  );

  const grouped = emptyHomepageSections();
  for (const row of placements ?? []) {
    const key = String((row as { section_key: string }).section_key) as HomepageSectionKey;
    if (!HOMEPAGE_SECTIONS.some((section) => section.key === key)) continue;
    if (!grouped[key] || grouped[key].length >= HOMEPAGE_SECTION_MAX) continue;
    const projectId = String((row as { project_id: string }).project_id);
    const card = cardById.get(projectId);
    if (!card) continue;
    grouped[key].push(card);
  }
  return grouped;
}

export const listHomepageSections = cache(listHomepageSectionsUncached);

async function listHomepageLegacyCategorySectionsUncached(): Promise<HomepageLegacyCategorySection[]> {
  const rows = await Promise.all(
    HOMEPAGE_LEGACY_CATEGORY_SECTIONS.map(async (section) => {
      const { items } = await listProjectCards({
        category: section.slug,
        limit: HOMEPAGE_SECTION_MAX,
      });
      return { ...section, projects: items };
    })
  );
  return rows;
}

export const listHomepageLegacyCategorySections = cache(listHomepageLegacyCategorySectionsUncached);

export async function listProjectHomepageSections(projectId: string): Promise<HomepageSectionKey[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('ecommerce_homepage_placements')
    .select('section_key')
    .eq('project_id', projectId)
    .eq('active', true);
  return (data ?? [])
    .map((row) => String((row as { section_key: string }).section_key) as HomepageSectionKey)
    .filter((key) => HOMEPAGE_SECTIONS.some((section) => section.key === key));
}

export { mapProject, mapPage, mapPackage, mapCard };
