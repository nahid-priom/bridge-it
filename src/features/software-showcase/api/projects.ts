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
  ShowcaseCategory,
  ShowcaseChildCategory,
  ShowcaseMainCategory,
  SoftwareCategory,
  SoftwareHomepageSectionsResult,
  SoftwareListFilters,
  SoftwareListResult,
  SoftwarePackage,
  SoftwareProductFeature,
  SoftwareProject,
  SoftwareProjectCard,
  SoftwareProjectDetail,
  SoftwareProjectScreen,
} from '../types';

const CARD_SELECT =
  'id, title, slug, short_description, feature_summary, category_id, category_name, category_slug, industry, business_type, solution_group, software_type, platform_type, main_category_id, taxonomy_category_id, taxonomy_category_name, taxonomy_category_slug, child_category_id, child_category_name, child_category_slug, cover_card_url, cover_detail_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, created_at, updated_at, deleted_at, screen_count';

function mapCard(row: Record<string, unknown>): SoftwareProjectCard {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    short_description: (row.short_description as string | null) ?? null,
    feature_summary: (row.feature_summary as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    industry: (row.industry as string | null) ?? null,
    business_type: (row.business_type as string | null) ?? null,
    solution_group: (row.solution_group as string | null) ?? null,
    software_type: (row.software_type as string | null) ?? null,
    platform_type: (row.platform_type as string | null) ?? null,
    main_category_id: (row.main_category_id as string | null) ?? null,
    taxonomy_category_id: (row.taxonomy_category_id as string | null) ?? null,
    child_category_id: (row.child_category_id as string | null) ?? null,
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
    taxonomy_category_name: (row.taxonomy_category_name as string | null) ?? null,
    taxonomy_category_slug: (row.taxonomy_category_slug as string | null) ?? null,
    child_category_name: (row.child_category_name as string | null) ?? null,
    child_category_slug: (row.child_category_slug as string | null) ?? null,
    screen_count: Number(row.screen_count ?? 0),
    primary_features: [],
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
    feature_summary: (row.feature_summary as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    main_category_id: (row.main_category_id as string | null) ?? null,
    taxonomy_category_id: (row.taxonomy_category_id as string | null) ?? null,
    child_category_id: (row.child_category_id as string | null) ?? null,
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
    module_name: (row.module_name as string | null) ?? null,
    short_caption: (row.short_caption as string | null) ?? null,
    image_url: (row.image_url as string | null) ?? null,
    image_path: (row.image_path as string | null) ?? null,
    thumbnail_url: (row.thumbnail_url as string | null) ?? null,
    thumbnail_path: (row.thumbnail_path as string | null) ?? null,
    mobile_image_url: (row.mobile_image_url as string | null) ?? null,
    mobile_image_path: (row.mobile_image_path as string | null) ?? null,
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

function mapFeature(row: Record<string, unknown>): SoftwareProductFeature {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    title: String(row.title),
    short_description: (row.short_description as string | null) ?? null,
    icon_key: (row.icon_key as string | null) ?? null,
    sort_order: Number(row.sort_order ?? 0),
    is_primary: Boolean(row.is_primary),
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

async function attachPrimaryFeatures(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerClient>>>,
  cards: SoftwareProjectCard[]
): Promise<SoftwareProjectCard[]> {
  if (cards.length === 0) return cards;
  const ids = cards.map((c) => c.id);
  const { data } = await supabase
    .from('software_product_features')
    .select('id, project_id, title, short_description, sort_order, is_primary, published, deleted_at')
    .in('project_id', ids)
    .eq('is_primary', true)
    .eq('published', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  const byProject = new Map<string, SoftwareProjectCard['primary_features']>();
  for (const row of data ?? []) {
    const projectId = String(row.project_id);
    const list = byProject.get(projectId) ?? [];
    if (list.length >= 3) continue;
    list.push({
      id: String(row.id),
      title: String(row.title),
      short_description: (row.short_description as string | null) ?? null,
    });
    byProject.set(projectId, list);
  }

  return cards.map((card) => ({
    ...card,
    primary_features: byProject.get(card.id) ?? [],
  }));
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

export async function listShowcaseTaxonomy(): Promise<{
  mains: ShowcaseMainCategory[];
  categories: ShowcaseCategory[];
  children: ShowcaseChildCategory[];
}> {
  const supabase = await getServerClient();
  if (!supabase) return { mains: [], categories: [], children: [] };

  const [mains, categories, children] = await Promise.all([
    supabase
      .from('showcase_main_categories')
      .select('*')
      .is('deleted_at', null)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('showcase_categories')
      .select('*')
      .is('deleted_at', null)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('showcase_child_categories')
      .select('*')
      .is('deleted_at', null)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ]);

  return {
    mains: (mains.data ?? []) as ShowcaseMainCategory[],
    categories: (categories.data ?? []) as ShowcaseCategory[],
    children: (children.data ?? []) as ShowcaseChildCategory[],
  };
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
      `title.ilike.%${q}%,industry.ilike.%${q}%,short_description.ilike.%${q}%,feature_summary.ilike.%${q}%,category_name.ilike.%${q}%,taxonomy_category_name.ilike.%${q}%,child_category_name.ilike.%${q}%,business_type.ilike.%${q}%,solution_group.ilike.%${q}%,software_type.ilike.%${q}%`
    );
  }

  const taxonomySlug =
    filters.taxonomyCategory && filters.taxonomyCategory !== 'all'
      ? filters.taxonomyCategory
      : filters.group && filters.group !== 'all'
        ? filters.group
        : undefined;

  if (taxonomySlug) {
    query = query.eq('taxonomy_category_slug', taxonomySlug);
  }

  if (filters.child && filters.child !== 'all') {
    query = query.eq('child_category_slug', filters.child);
  }

  if (filters.industry && filters.industry !== 'all') {
    query = query.eq('category_slug', filters.industry);
  }

  // Legacy more filters → solution_group OR when no taxonomy/child set
  if (!taxonomySlug && !filters.child) {
    const groupSlugs = resolveSoftwareGroupSlugs({
      group: filters.group ?? filters.solutionGroup,
      more: filters.more,
    });
    if (groupSlugs && groupSlugs.length > 0) {
      query = query.in('solution_group', groupSlugs);
    } else if (filters.solutionGroup && filters.solutionGroup !== 'all') {
      const mapped = listingFilterGroups(filters.solutionGroup);
      if (mapped && mapped.length > 0) {
        query = query.in('solution_group', mapped);
      } else if (!['software', 'websites', 'marketing', 'creative-marketing'].includes(filters.solutionGroup)) {
        query = query.eq('solution_group', filters.solutionGroup);
      }
    }
  } else if (filters.more && filters.more.length > 0 && !filters.child) {
    // Treat more as child category slug candidates when taxonomy is set
    query = query.in('child_category_slug', filters.more);
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

  const cards = (data ?? []).map((row) => mapCard(row as Record<string, unknown>));
  const withFeatures = await attachPrimaryFeatures(supabase, cards);

  return {
    items: withFeatures,
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
    industry: filters.industry ?? null,
    taxonomyCategory: filters.taxonomyCategory ?? null,
    child: filters.child ?? null,
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

  const [{ data: screens }, { data: packages }, { data: category }, { data: features }, { data: taxCat }, { data: childCat }] =
    await Promise.all([
      supabase
        .from('software_project_screens')
        .select(
          'id, project_id, screen_key, screen_name, module_name, short_caption, image_url, image_path, thumbnail_url, thumbnail_path, mobile_image_url, mobile_image_path, image_width, image_height, sort_order, is_featured, published, created_at, updated_at, deleted_at'
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
      supabase
        .from('software_product_features')
        .select('*')
        .eq('project_id', project.id)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true }),
      project.taxonomy_category_id
        ? supabase
            .from('showcase_categories')
            .select('id, name, slug')
            .eq('id', project.taxonomy_category_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      project.child_category_id
        ? supabase
            .from('showcase_child_categories')
            .select('id, name, slug')
            .eq('id', project.child_category_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const publicScreens = (screens ?? [])
    .map((row) => mapScreen(row as Record<string, unknown>))
    .filter((screen) => includeDrafts || screen.published);

  const publicFeatures = (features ?? [])
    .map((row) => mapFeature(row as Record<string, unknown>))
    .filter((feature) => includeDrafts || feature.published);

  const isEcommerceAdmin =
    childCat?.slug === 'ecommerce-admin' ||
    taxCat?.slug === 'ecommerce-admin' ||
    project.slug.includes('ecommerce-admin');

  return {
    ...project,
    category: (category as Pick<SoftwareCategory, 'id' | 'name' | 'slug'> | null) ?? null,
    taxonomy_category: (taxCat as Pick<ShowcaseCategory, 'id' | 'name' | 'slug'> | null) ?? null,
    child_category: (childCat as Pick<ShowcaseChildCategory, 'id' | 'name' | 'slug'> | null) ?? null,
    features: publicFeatures,
    screens: publicScreens,
    packages: (packages ?? []).map((row) => mapPackage(row as Record<string, unknown>)),
    related_websites_cta: Boolean(isEcommerceAdmin),
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

  const mapped = await attachPrimaryFeatures(
    supabase,
    (cards ?? []).map((row) => mapCard(row as Record<string, unknown>))
  );

  const cardMap = new Map(mapped.map((card) => [card.id, card] as const));

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

export { mapCard, mapProject, mapScreen, mapPackage, mapFeature };
