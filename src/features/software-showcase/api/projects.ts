import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import {
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_HOMEPAGE_SECTION_MAX,
  SOFTWARE_HOMEPAGE_SECTIONS,
  listingFilterGroups,
  resolveSoftwareGroupSlugs,
  type SoftwareHomepageSectionKey,
} from '../config/constants';
import type {
  SoftwareCategory,
  SoftwareHomepageSectionsResult,
  SoftwareListFilters,
  SoftwareListResult,
  SoftwarePackage,
  SoftwareProject,
  SoftwareProjectCard,
  SoftwareProjectDetail,
  SoftwareProjectScreen,
} from '../types';

const CARD_SELECT =
  'id, title, slug, short_description, category_id, category_name, category_slug, industry, business_type, solution_group, software_type, platform_type, cover_card_url, cover_detail_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, created_at, updated_at, deleted_at, screen_count';

function mapCard(row: Record<string, unknown>): SoftwareProjectCard {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    industry: (row.industry as string | null) ?? null,
    business_type: (row.business_type as string | null) ?? null,
    solution_group: (row.solution_group as string | null) ?? null,
    software_type: (row.software_type as string | null) ?? null,
    platform_type: (row.platform_type as string | null) ?? null,
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
    category_name: (row.category_name as string | null) ?? null,
    category_slug: (row.category_slug as string | null) ?? null,
    screen_count: Number(row.screen_count ?? 0),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapProject(row: Record<string, unknown>): SoftwareProject {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    full_description: (row.full_description as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    industry: (row.industry as string | null) ?? null,
    business_type: (row.business_type as string | null) ?? null,
    primary_user: (row.primary_user as string | null) ?? null,
    solution_group: (row.solution_group as string | null) ?? null,
    software_type: (row.software_type as string | null) ?? null,
    platform_type: (row.platform_type as string | null) ?? null,
    modules: Array.isArray(row.modules) ? (row.modules as string[]) : [],
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
    created_by: (row.created_by as string | null) ?? null,
    updated_by: (row.updated_by as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    deleted_at: (row.deleted_at as string | null) ?? null,
  };
}

function mapScreen(row: Record<string, unknown>): SoftwareProjectScreen {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    screen_key: String(row.screen_key),
    screen_name: String(row.screen_name),
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

function mapPackage(row: Record<string, unknown>): SoftwarePackage {
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

export async function listSoftwareCategories(includeInactive = false): Promise<SoftwareCategory[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];
  let query = supabase
    .from('software_categories')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  if (!includeInactive) query = query.eq('active', true);
  const { data } = await query;
  return (data ?? []) as SoftwareCategory[];
}

async function listSoftwareProjectCardsUncached(
  filters: SoftwareListFilters = {},
  options: { includeDrafts?: boolean } = {}
): Promise<SoftwareListResult> {
  const supabase = await getServerClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, Math.min(filters.pageSize ?? SOFTWARE_GALLERY_PAGE_SIZE, 48));
  const offset = (page - 1) * pageSize;

  if (!supabase) {
    return { items: [], total: 0, page, pageSize };
  }

  let query = supabase
    .from('software_project_cards')
    .select(CARD_SELECT, { count: 'exact' })
    .is('deleted_at', null);

  if (!options.includeDrafts) {
    query = query.eq('published', true);
  } else if (filters.published === true) {
    query = query.eq('published', true);
  } else if (filters.published === false) {
    query = query.eq('published', false);
  }

  if (filters.q) {
    const q = filters.q.replace(/,/g, ' ');
    query = query.or(
      `title.ilike.%${q}%,industry.ilike.%${q}%,short_description.ilike.%${q}%,category_name.ilike.%${q}%,category_slug.ilike.%${q}%,business_type.ilike.%${q}%,solution_group.ilike.%${q}%,software_type.ilike.%${q}%`
    );
  }

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category_slug', filters.category);
  }

  const groupSlugs = resolveSoftwareGroupSlugs({
    group: filters.group ?? filters.solutionGroup,
    more: filters.more,
  });
  if (groupSlugs && groupSlugs.length > 0) {
    query = query.in('solution_group', groupSlugs);
  } else if (filters.solutionGroup && filters.solutionGroup !== 'all') {
    // Legacy: raw solution_group slug only if it is not an explore pillar / unknown chip
    const mapped = listingFilterGroups(filters.solutionGroup);
    if (mapped && mapped.length > 0) {
      query = query.in('solution_group', mapped);
    } else if (!['software', 'websites', 'marketing', 'creative-marketing'].includes(filters.solutionGroup)) {
      query = query.eq('solution_group', filters.solutionGroup);
    }
  }

  if (filters.featured) query = query.eq('featured', true);
  if (filters.popular) query = query.eq('popular', true);

  const { data, count, error } = await query
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error('[software-showcase] listSoftwareProjectCards', error.message);
    return { items: [], total: 0, page, pageSize };
  }

  return {
    items: (data ?? []).map((row) => mapCard(row as Record<string, unknown>)),
    total: count ?? 0,
    page,
    pageSize,
  };
}

const listSoftwareProjectCardsCached = cache(async (filtersKey: string, includeDrafts: boolean) => {
  const filters = JSON.parse(filtersKey) as SoftwareListFilters;
  return listSoftwareProjectCardsUncached(filters, { includeDrafts });
});

export async function listSoftwareProjectCards(
  filters: SoftwareListFilters = {},
  options: { includeDrafts?: boolean } = {}
): Promise<SoftwareListResult> {
  const key = JSON.stringify({
    q: filters.q ?? null,
    category: filters.category ?? null,
    solutionGroup: filters.solutionGroup ?? null,
    group: filters.group ?? null,
    more: filters.more ?? null,
    featured: filters.featured ?? null,
    popular: filters.popular ?? null,
    published: filters.published ?? null,
    page: filters.page ?? null,
    pageSize: filters.pageSize ?? null,
  });
  return listSoftwareProjectCardsCached(key, Boolean(options.includeDrafts));
}

async function getSoftwareProjectBySlugUncached(
  slug: string,
  includeDrafts: boolean
): Promise<SoftwareProjectDetail | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let projectQuery = supabase
    .from('software_projects')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null);
  if (!includeDrafts) projectQuery = projectQuery.eq('published', true);

  const { data: projectRow } = await projectQuery.maybeSingle();
  if (!projectRow) return null;
  const project = mapProject(projectRow as Record<string, unknown>);

  const [{ data: screens }, { data: packages }, { data: category }] = await Promise.all([
    supabase
      .from('software_project_screens')
      .select(
        'id, project_id, screen_key, screen_name, image_url, image_path, thumbnail_url, thumbnail_path, image_width, image_height, sort_order, is_featured, published, created_at, updated_at, deleted_at'
      )
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('software_packages')
      .select('*')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    project.category_id
      ? supabase
          .from('software_categories')
          .select('id, name, slug')
          .eq('id', project.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const publicScreens = (screens ?? [])
    .map((row) => mapScreen(row as Record<string, unknown>))
    .filter((screen) => includeDrafts || screen.published);

  return {
    ...project,
    category: (category as Pick<SoftwareCategory, 'id' | 'name' | 'slug'> | null) ?? null,
    screens: publicScreens,
    packages: (packages ?? []).map((row) => mapPackage(row as Record<string, unknown>)),
  };
}

const getSoftwareProjectBySlugCached = cache(getSoftwareProjectBySlugUncached);

export async function getSoftwareProjectBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<SoftwareProjectDetail | null> {
  return getSoftwareProjectBySlugCached(slug, Boolean(options.includeDrafts));
}

function emptyHomepageSections(): SoftwareHomepageSectionsResult {
  return {
    popular: [],
    manufacturing_erp: [],
  };
}

async function listHomepageSoftwareSectionsUncached(): Promise<SoftwareHomepageSectionsResult> {
  const supabase = await getServerClient();
  if (!supabase) return emptyHomepageSections();

  const { data: placements, error } = await supabase
    .from('software_homepage_placements')
    .select('id, section_key, project_id, sort_order')
    .order('section_key', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[software-showcase] listHomepageSoftwareSections', error.message);
    return emptyHomepageSections();
  }

  const rows = placements ?? [];
  if (rows.length === 0) return emptyHomepageSections();

  const projectIds = [...new Set(rows.map((row) => String((row as { project_id: string }).project_id)))];
  const { data: cards } = await supabase
    .from('software_project_cards')
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
    const key = String((row as { section_key: string }).section_key) as SoftwareHomepageSectionKey;
    if (!SOFTWARE_HOMEPAGE_SECTIONS.some((section) => section.key === key)) continue;
    if (grouped[key].length >= SOFTWARE_HOMEPAGE_SECTION_MAX) continue;
    const projectId = String((row as { project_id: string }).project_id);
    const card = cardMap.get(projectId);
    if (!card) continue;
    grouped[key].push(card);
  }

  return grouped;
}

export const listHomepageSoftwareSections = cache(listHomepageSoftwareSectionsUncached);

export { mapCard, mapProject, mapScreen, mapPackage };
