import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  CREATIVE_MARKETING_HOMEPAGE_SECTION_MAX,
  CREATIVE_MARKETING_HOMEPAGE_SECTIONS,
  resolveCreativeGroupSlugs,
  type CreativeMarketingHomepageSectionKey,
} from '../config/constants';
import type {
  CreativeMarketingAsset,
  CreativeMarketingHomepageSectionsResult,
  CreativeMarketingListFilters,
  CreativeMarketingListResult,
  CreativeMarketingPackage,
  CreativeMarketingProject,
  CreativeMarketingProjectCard,
  CreativeMarketingProjectDetail,
} from '../types';

const CARD_SELECT =
  'id, title, slug, short_description, outcome_line, service_group, service_type, service_subcategory, target_business, pricing_model, cover_card_url, cover_detail_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, created_at, updated_at, deleted_at, asset_count';

function mapCard(row: Record<string, unknown>): CreativeMarketingProjectCard {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    outcome_line: (row.outcome_line as string | null) ?? null,
    service_group: String(row.service_group ?? ''),
    service_type: (row.service_type as string | null) ?? null,
    service_subcategory: (row.service_subcategory as string | null) ?? null,
    target_business: (row.target_business as string | null) ?? null,
    pricing_model: String(row.pricing_model ?? 'one_time'),
    cover_card_url: (row.cover_card_url as string | null) ?? null,
    cover_detail_url: (row.cover_detail_url as string | null) ?? null,
    starting_price: Number(row.starting_price ?? 0),
    price_suffix: String(row.price_suffix ?? ''),
    currency: String(row.currency ?? 'BDT'),
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    published: Boolean(row.published),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    asset_count: Number(row.asset_count ?? 0),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapProject(row: Record<string, unknown>): CreativeMarketingProject {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    full_description: (row.full_description as string | null) ?? null,
    outcome_line: (row.outcome_line as string | null) ?? null,
    service_group: String(row.service_group ?? ''),
    service_type: (row.service_type as string | null) ?? null,
    service_subcategory: (row.service_subcategory as string | null) ?? null,
    target_business: (row.target_business as string | null) ?? null,
    pricing_model: String(row.pricing_model ?? 'one_time'),
    deliverables: Array.isArray(row.deliverables) ? (row.deliverables as string[]) : [],
    related_slugs: Array.isArray(row.related_slugs) ? (row.related_slugs as string[]) : [],
    cover_card_url: (row.cover_card_url as string | null) ?? null,
    cover_card_path: (row.cover_card_path as string | null) ?? null,
    cover_detail_url: (row.cover_detail_url as string | null) ?? null,
    cover_detail_path: (row.cover_detail_path as string | null) ?? null,
    og_image_url: (row.og_image_url as string | null) ?? null,
    starting_price: Number(row.starting_price ?? 0),
    price_suffix: String(row.price_suffix ?? ''),
    currency: String(row.currency ?? 'BDT'),
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    published: Boolean(row.published),
    seo_title: (row.seo_title as string | null) ?? null,
    seo_description: (row.seo_description as string | null) ?? null,
    seo_keywords: Array.isArray(row.seo_keywords) ? (row.seo_keywords as string[]) : [],
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapAsset(row: Record<string, unknown>): CreativeMarketingAsset {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    asset_key: String(row.asset_key),
    asset_name: String(row.asset_name),
    asset_kind: String(row.asset_kind ?? 'portfolio'),
    image_url: (row.image_url as string | null) ?? null,
    image_path: (row.image_path as string | null) ?? null,
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

function mapPackage(row: Record<string, unknown>): CreativeMarketingPackage {
  const features = Array.isArray(row.features)
    ? (row.features as unknown[]).map((item) => String(item))
    : [];
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    name: String(row.name),
    price: Number(row.price ?? 0),
    currency: String(row.currency ?? 'BDT'),
    pricing_model: String(row.pricing_model ?? 'one_time'),
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

async function listCreativeMarketingCardsUncached(
  filters: CreativeMarketingListFilters = {},
  options: { includeDrafts?: boolean } = {}
): Promise<CreativeMarketingListResult> {
  const supabase = await getServerClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, Math.min(filters.pageSize ?? CREATIVE_MARKETING_GALLERY_PAGE_SIZE, 48));
  const offset = (page - 1) * pageSize;

  if (!supabase) return { items: [], total: 0, page, pageSize };

  let query = supabase
    .from('creative_marketing_project_cards')
    .select(CARD_SELECT, { count: 'exact' })
    .is('deleted_at', null);

  if (!options.includeDrafts) query = query.eq('published', true);
  else if (filters.published === true) query = query.eq('published', true);
  else if (filters.published === false) query = query.eq('published', false);

  if (filters.q) {
    const q = filters.q.replace(/,/g, ' ');
    query = query.or(
      `title.ilike.%${q}%,short_description.ilike.%${q}%,outcome_line.ilike.%${q}%,service_group.ilike.%${q}%,service_type.ilike.%${q}%,target_business.ilike.%${q}%`
    );
  }

  const groupSlugs = resolveCreativeGroupSlugs({
    group: filters.group,
    more: filters.more,
    serviceGroup: filters.serviceGroup,
  });
  if (groupSlugs && groupSlugs.length > 0) {
    query = query.in('service_group', groupSlugs);
  }

  if (filters.featured) query = query.eq('featured', true);
  if (filters.popular) query = query.eq('popular', true);

  const { data, count, error } = await query
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error('[creative-marketing] listCards', error.message);
    return { items: [], total: 0, page, pageSize };
  }

  return {
    items: (data ?? []).map((row) => mapCard(row as Record<string, unknown>)),
    total: count ?? 0,
    page,
    pageSize,
  };
}

const listCreativeMarketingCardsCached = cache(async (filtersKey: string, includeDrafts: boolean) => {
  const filters = JSON.parse(filtersKey) as CreativeMarketingListFilters;
  return listCreativeMarketingCardsUncached(filters, { includeDrafts });
});

export async function listCreativeMarketingCards(
  filters: CreativeMarketingListFilters = {},
  options: { includeDrafts?: boolean } = {}
): Promise<CreativeMarketingListResult> {
  const key = JSON.stringify({
    q: filters.q ?? null,
    group: filters.group ?? null,
    more: filters.more ?? null,
    serviceGroup: filters.serviceGroup ?? null,
    featured: filters.featured ?? null,
    popular: filters.popular ?? null,
    published: filters.published ?? null,
    page: filters.page ?? null,
    pageSize: filters.pageSize ?? null,
  });
  return listCreativeMarketingCardsCached(key, Boolean(options.includeDrafts));
}

async function getCreativeMarketingBySlugUncached(
  slug: string,
  includeDrafts: boolean
): Promise<CreativeMarketingProjectDetail | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let projectQuery = supabase
    .from('creative_marketing_projects')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null);
  if (!includeDrafts) projectQuery = projectQuery.eq('published', true);

  const { data: projectRow } = await projectQuery.maybeSingle();
  if (!projectRow) return null;
  const project = mapProject(projectRow as Record<string, unknown>);

  const [{ data: assets }, { data: packages }, relatedResult] = await Promise.all([
    supabase
      .from('creative_marketing_assets')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('creative_marketing_packages')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    project.related_slugs.length
      ? supabase
          .from('creative_marketing_project_cards')
          .select(CARD_SELECT)
          .in('slug', project.related_slugs)
          .eq('published', true)
          .is('deleted_at', null)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
  ]);

  const publicAssets = (assets ?? [])
    .map((row) => mapAsset(row as Record<string, unknown>))
    .filter((asset) => includeDrafts || asset.published);

  return {
    ...project,
    assets: publicAssets,
    packages: (packages ?? []).map((row) => mapPackage(row as Record<string, unknown>)),
    related: (relatedResult.data ?? []).map((row) => mapCard(row as Record<string, unknown>)),
  };
}

const getCreativeMarketingBySlugCached = cache(getCreativeMarketingBySlugUncached);

export async function getCreativeMarketingBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<CreativeMarketingProjectDetail | null> {
  return getCreativeMarketingBySlugCached(slug, Boolean(options.includeDrafts));
}

function emptyHomepageSections(): CreativeMarketingHomepageSectionsResult {
  return { popular: [] };
}

async function listHomepageCreativeSectionsUncached(): Promise<CreativeMarketingHomepageSectionsResult> {
  const supabase = await getServerClient();
  if (!supabase) return emptyHomepageSections();

  const { data: placements, error } = await supabase
    .from('creative_marketing_homepage_placements')
    .select('id, section_key, project_id, sort_order')
    .order('section_key', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[creative-marketing] homepage', error.message);
    return emptyHomepageSections();
  }

  const rows = placements ?? [];
  if (!rows.length) return emptyHomepageSections();

  const projectIds = [...new Set(rows.map((row) => String((row as { project_id: string }).project_id)))];
  const { data: cards } = await supabase
    .from('creative_marketing_project_cards')
    .select(CARD_SELECT)
    .in('id', projectIds)
    .eq('published', true)
    .is('deleted_at', null);

  const cardMap = new Map(
    (cards ?? []).map((row) => {
      const card = mapCard(row as Record<string, unknown>);
      return [card.id, card] as const;
    })
  );

  const grouped = emptyHomepageSections();
  for (const row of rows) {
    const key = String((row as { section_key: string }).section_key) as CreativeMarketingHomepageSectionKey;
    if (!CREATIVE_MARKETING_HOMEPAGE_SECTIONS.some((section) => section.key === key)) continue;
    if (grouped[key].length >= CREATIVE_MARKETING_HOMEPAGE_SECTION_MAX) continue;
    const card = cardMap.get(String((row as { project_id: string }).project_id));
    if (card) grouped[key].push(card);
  }

  return grouped;
}

export const listHomepageCreativeMarketingSections = cache(listHomepageCreativeSectionsUncached);

export { mapCard, mapProject, mapAsset, mapPackage };
