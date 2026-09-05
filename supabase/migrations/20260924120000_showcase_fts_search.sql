-- Full-text search for showcase catalogs (websites / software / marketing).
-- Weighted tsvector on base tables + ranked search RPCs used by list*ProjectCards.

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. search_vector columns + GIN indexes
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.ecommerce_projects
  add column if not exists search_vector tsvector;

alter table public.software_projects
  add column if not exists search_vector tsvector;

alter table public.creative_marketing_projects
  add column if not exists search_vector tsvector;

create index if not exists idx_ecommerce_projects_search_vector
  on public.ecommerce_projects using gin (search_vector);

create index if not exists idx_software_projects_search_vector
  on public.software_projects using gin (search_vector);

create index if not exists idx_creative_marketing_projects_search_vector
  on public.creative_marketing_projects using gin (search_vector);

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. Refresh helpers (weighted A/B/C/D)
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.ecommerce_projects_refresh_search_vector(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category_name text;
  v_category_slug text;
  v_industry_name text;
  v_industry_slug text;
begin
  select c.name, c.slug, ci.name, ci.slug
  into v_category_name, v_category_slug, v_industry_name, v_industry_slug
  from public.ecommerce_projects p
  left join public.ecommerce_categories c
    on c.id = p.category_id and c.deleted_at is null
  left join public.catalog_industries ci
    on ci.id = p.industry_id and ci.deleted_at is null
  where p.id = p_project_id;

  update public.ecommerce_projects p
  set search_vector =
    setweight(to_tsvector('english', coalesce(p.title, '')), 'A')
    || setweight(to_tsvector('english', coalesce(p.short_description, '')), 'B')
    || setweight(
         to_tsvector(
           'english',
           coalesce(p.industry, '') || ' ' ||
           coalesce(v_industry_name, '') || ' ' ||
           coalesce(v_category_name, '') || ' ' ||
           coalesce(v_category_slug, '') || ' ' ||
           coalesce(v_industry_slug, '') || ' ' ||
           coalesce(array_to_string(p.seo_keywords, ' '), '') || ' ' ||
           coalesce(array_to_string(p.technology_stack, ' '), '') || ' ' ||
           coalesce(p.website_type, '')
         ),
         'C'
       )
    || setweight(to_tsvector('english', coalesce(p.full_description, '')), 'D')
  where p.id = p_project_id;
end;
$$;

create or replace function public.software_projects_refresh_search_vector(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category_name text;
  v_category_slug text;
  v_taxonomy_name text;
  v_taxonomy_slug text;
  v_child_name text;
  v_child_slug text;
  v_industry_name text;
  v_industry_slug text;
begin
  select c.name, c.slug, sc.name, sc.slug, ch.name, ch.slug, ci.name, ci.slug
  into
    v_category_name, v_category_slug,
    v_taxonomy_name, v_taxonomy_slug,
    v_child_name, v_child_slug,
    v_industry_name, v_industry_slug
  from public.software_projects p
  left join public.software_categories c
    on c.id = p.category_id and c.deleted_at is null
  left join public.showcase_categories sc
    on sc.id = p.taxonomy_category_id and sc.deleted_at is null
  left join public.showcase_child_categories ch
    on ch.id = p.child_category_id and ch.deleted_at is null
  left join public.catalog_industries ci
    on ci.id = p.industry_id and ci.deleted_at is null
  where p.id = p_project_id;

  update public.software_projects p
  set search_vector =
    setweight(to_tsvector('english', coalesce(p.title, '')), 'A')
    || setweight(
         to_tsvector(
           'english',
           coalesce(p.short_description, '') || ' ' || coalesce(p.feature_summary, '')
         ),
         'B'
       )
    || setweight(
         to_tsvector(
           'english',
           coalesce(p.industry, '') || ' ' ||
           coalesce(v_industry_name, '') || ' ' ||
           coalesce(v_category_name, '') || ' ' ||
           coalesce(v_category_slug, '') || ' ' ||
           coalesce(v_taxonomy_name, '') || ' ' ||
           coalesce(v_taxonomy_slug, '') || ' ' ||
           coalesce(v_child_name, '') || ' ' ||
           coalesce(v_child_slug, '') || ' ' ||
           coalesce(v_industry_slug, '') || ' ' ||
           coalesce(p.business_type, '') || ' ' ||
           coalesce(p.solution_group, '') || ' ' ||
           coalesce(p.software_type, '') || ' ' ||
           coalesce(p.platform_type, '') || ' ' ||
           coalesce(p.business_size, '') || ' ' ||
           coalesce(array_to_string(p.seo_keywords, ' '), '') || ' ' ||
           coalesce(array_to_string(p.modules, ' '), '')
         ),
         'C'
       )
    || setweight(to_tsvector('english', coalesce(p.full_description, '')), 'D')
  where p.id = p_project_id;
end;
$$;

create or replace function public.creative_marketing_projects_refresh_search_vector(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_industry_name text;
  v_industry_slug text;
begin
  select ci.name, ci.slug
  into v_industry_name, v_industry_slug
  from public.creative_marketing_projects p
  left join public.catalog_industries ci
    on ci.id = p.industry_id and ci.deleted_at is null
  where p.id = p_project_id;

  update public.creative_marketing_projects p
  set search_vector =
    setweight(to_tsvector('english', coalesce(p.title, '')), 'A')
    || setweight(
         to_tsvector(
           'english',
           coalesce(p.short_description, '') || ' ' || coalesce(p.outcome_line, '')
         ),
         'B'
       )
    || setweight(
         to_tsvector(
           'english',
           coalesce(p.service_group, '') || ' ' ||
           coalesce(p.service_type, '') || ' ' ||
           coalesce(p.service_subcategory, '') || ' ' ||
           coalesce(p.target_business, '') || ' ' ||
           coalesce(v_industry_name, '') || ' ' ||
           coalesce(v_industry_slug, '') || ' ' ||
           coalesce(array_to_string(p.seo_keywords, ' '), '') || ' ' ||
           coalesce(array_to_string(p.deliverables, ' '), '')
         ),
         'C'
       )
    || setweight(to_tsvector('english', coalesce(p.full_description, '')), 'D')
  where p.id = p_project_id;
end;
$$;

-- Trigger wrappers
create or replace function public.ecommerce_projects_search_vector_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ecommerce_projects_refresh_search_vector(new.id);
  return new;
end;
$$;

create or replace function public.software_projects_search_vector_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.software_projects_refresh_search_vector(new.id);
  return new;
end;
$$;

create or replace function public.creative_marketing_projects_search_vector_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.creative_marketing_projects_refresh_search_vector(new.id);
  return new;
end;
$$;

drop trigger if exists trg_ecommerce_projects_search_vector on public.ecommerce_projects;
create trigger trg_ecommerce_projects_search_vector
  after insert or update of
    title, short_description, full_description, industry, industry_id, category_id,
    seo_keywords, technology_stack, website_type
  on public.ecommerce_projects
  for each row
  execute function public.ecommerce_projects_search_vector_trigger();

drop trigger if exists trg_software_projects_search_vector on public.software_projects;
create trigger trg_software_projects_search_vector
  after insert or update of
    title, short_description, full_description, feature_summary, industry, industry_id,
    category_id, taxonomy_category_id, child_category_id, business_type, solution_group,
    software_type, platform_type, business_size, seo_keywords, modules
  on public.software_projects
  for each row
  execute function public.software_projects_search_vector_trigger();

drop trigger if exists trg_creative_marketing_projects_search_vector on public.creative_marketing_projects;
create trigger trg_creative_marketing_projects_search_vector
  after insert or update of
    title, short_description, full_description, outcome_line, service_group, service_type,
    service_subcategory, target_business, industry_id, seo_keywords, deliverables
  on public.creative_marketing_projects
  for each row
  execute function public.creative_marketing_projects_search_vector_trigger();

-- Backfill
do $$
declare
  r record;
begin
  for r in select id from public.ecommerce_projects loop
    perform public.ecommerce_projects_refresh_search_vector(r.id);
  end loop;
  for r in select id from public.software_projects loop
    perform public.software_projects_refresh_search_vector(r.id);
  end loop;
  for r in select id from public.creative_marketing_projects loop
    perform public.creative_marketing_projects_refresh_search_vector(r.id);
  end loop;
end;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. Ranked search RPCs
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.search_ecommerce_project_cards(
  p_q text default null,
  p_category_slugs text[] default null,
  p_industry_slug text default null,
  p_tech text default null,
  p_industry text default null,
  p_website_type text default null,
  p_featured boolean default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_page_types text[] default null,
  p_include_drafts boolean default false,
  p_published boolean default null,
  p_limit int default 24,
  p_offset int default 0
)
returns table (
  id uuid,
  title text,
  slug text,
  short_description text,
  category_id uuid,
  technology_stack text[],
  website_type text,
  industry text,
  industry_id uuid,
  canonical_path text,
  badge text,
  business_size text,
  package_tier text,
  payment_type text,
  cover_image_url text,
  cover_fallback_url text,
  starting_price numeric,
  currency text,
  featured boolean,
  published boolean,
  sort_order int,
  rating_avg numeric,
  review_count int,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  category_name text,
  category_slug text,
  industry_name text,
  industry_slug text,
  page_count int,
  total_count bigint,
  search_rank real
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_q text := nullif(trim(coalesce(p_q, '')), '');
  v_tsquery tsquery;
  v_limit int := greatest(1, least(coalesce(p_limit, 24), 100));
  v_offset int := greatest(0, coalesce(p_offset, 0));
begin
  if v_q is not null then
    begin
      v_tsquery := websearch_to_tsquery('english', v_q);
    exception when others then
      v_tsquery := plainto_tsquery('english', v_q);
    end;
    if v_tsquery is null or length(trim(v_tsquery::text)) = 0 then
      v_q := null;
      v_tsquery := null;
    end if;
  end if;

  return query
  with filtered as (
    select
      c.id,
      c.title,
      c.slug,
      c.short_description,
      c.category_id,
      c.technology_stack,
      c.website_type,
      c.industry,
      c.industry_id,
      c.canonical_path,
      c.badge,
      c.business_size,
      c.package_tier,
      c.payment_type,
      c.cover_image_url,
      c.cover_fallback_url,
      c.starting_price,
      c.currency,
      c.featured,
      c.published,
      c.sort_order,
      c.rating_avg,
      c.review_count,
      c.created_at,
      c.updated_at,
      c.deleted_at,
      c.category_name,
      c.category_slug,
      c.industry_name,
      c.industry_slug,
      c.page_count,
      case
        when v_tsquery is not null then ts_rank_cd(p.search_vector, v_tsquery)
        else 0::real
      end as search_rank
    from public.ecommerce_project_cards c
    join public.ecommerce_projects p on p.id = c.id
    where c.deleted_at is null
      and (
        case
          when not coalesce(p_include_drafts, false) then c.published = true
          when p_published is true then c.published = true
          when p_published is false then c.published = false
          else true
        end
      )
      and (v_tsquery is null or p.search_vector @@ v_tsquery)
      and (
        p_category_slugs is null
        or cardinality(p_category_slugs) = 0
        or c.category_slug = any (p_category_slugs)
      )
      and (
        p_industry_slug is null
        or p_industry_slug = ''
        or p_industry_slug = 'all'
        or c.industry_slug = p_industry_slug
        or c.category_slug = p_industry_slug
      )
      and (
        p_tech is null
        or p_tech = ''
        or c.technology_stack @> array[p_tech]::text[]
      )
      and (p_industry is null or p_industry = '' or c.industry = p_industry)
      and (p_website_type is null or p_website_type = '' or c.website_type = p_website_type)
      and (p_featured is null or c.featured = p_featured)
      and (p_min_price is null or c.starting_price >= p_min_price)
      and (p_max_price is null or c.starting_price <= p_max_price)
      and (
        p_page_types is null
        or cardinality(p_page_types) = 0
        or exists (
          select 1
          from public.ecommerce_project_pages pg
          where pg.project_id = c.id
            and pg.deleted_at is null
            and pg.published = true
            and pg.page_type = any (p_page_types)
        )
      )
  ),
  counted as (
    select f.*, count(*) over () as total_count
    from filtered f
  )
  select
    counted.id,
    counted.title,
    counted.slug,
    counted.short_description,
    counted.category_id,
    counted.technology_stack,
    counted.website_type,
    counted.industry,
    counted.industry_id,
    counted.canonical_path,
    counted.badge,
    counted.business_size,
    counted.package_tier,
    counted.payment_type,
    counted.cover_image_url,
    counted.cover_fallback_url,
    counted.starting_price,
    counted.currency,
    counted.featured,
    counted.published,
    counted.sort_order,
    counted.rating_avg,
    counted.review_count,
    counted.created_at,
    counted.updated_at,
    counted.deleted_at,
    counted.category_name,
    counted.category_slug,
    counted.industry_name,
    counted.industry_slug,
    counted.page_count,
    counted.total_count,
    counted.search_rank
  from counted
  order by
    case when v_tsquery is not null then counted.search_rank else 0 end desc,
    counted.featured desc,
    counted.sort_order asc,
    counted.created_at desc,
    counted.id asc
  limit v_limit
  offset v_offset;
end;
$$;

create or replace function public.search_software_project_cards(
  p_q text default null,
  p_taxonomy_slug text default null,
  p_child_slug text default null,
  p_industry text default null,
  p_industry_slug text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_business_sizes text[] default null,
  p_solution_groups text[] default null,
  p_child_slugs text[] default null,
  p_featured boolean default null,
  p_popular boolean default null,
  p_include_drafts boolean default false,
  p_published boolean default null,
  p_sort text default 'popular',
  p_limit int default 24,
  p_offset int default 0
)
returns table (
  id uuid,
  title text,
  slug text,
  short_description text,
  feature_summary text,
  category_id uuid,
  industry text,
  business_type text,
  solution_group text,
  software_type text,
  platform_type text,
  main_category_id uuid,
  taxonomy_category_id uuid,
  child_category_id uuid,
  industry_id uuid,
  canonical_path text,
  badge text,
  business_size text,
  package_tier text,
  payment_type text,
  cover_card_url text,
  cover_detail_url text,
  starting_price numeric,
  price_suffix text,
  currency text,
  featured boolean,
  popular boolean,
  published boolean,
  sort_order int,
  asset_version int,
  rating_avg numeric,
  review_count int,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  category_name text,
  category_slug text,
  taxonomy_category_name text,
  taxonomy_category_slug text,
  child_category_name text,
  child_category_slug text,
  industry_name text,
  industry_slug text,
  screen_count int,
  total_count bigint,
  search_rank real
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_q text := nullif(trim(coalesce(p_q, '')), '');
  v_tsquery tsquery;
  v_limit int := greatest(1, least(coalesce(p_limit, 24), 100));
  v_offset int := greatest(0, coalesce(p_offset, 0));
  v_sort text := coalesce(nullif(trim(p_sort), ''), 'popular');
begin
  if v_q is not null then
    begin
      v_tsquery := websearch_to_tsquery('english', v_q);
    exception when others then
      v_tsquery := plainto_tsquery('english', v_q);
    end;
    if v_tsquery is null or length(trim(v_tsquery::text)) = 0 then
      v_q := null;
      v_tsquery := null;
    end if;
  end if;

  -- Searching always ranks by relevance first.
  if v_tsquery is not null then
    v_sort := 'relevance';
  end if;

  return query
  with filtered as (
    select
      c.id,
      c.title,
      c.slug,
      c.short_description,
      c.feature_summary,
      c.category_id,
      c.industry,
      c.business_type,
      c.solution_group,
      c.software_type,
      c.platform_type,
      c.main_category_id,
      c.taxonomy_category_id,
      c.child_category_id,
      c.industry_id,
      c.canonical_path,
      c.badge,
      c.business_size,
      c.package_tier,
      c.payment_type,
      c.cover_card_url,
      c.cover_detail_url,
      c.starting_price,
      c.price_suffix,
      c.currency,
      c.featured,
      c.popular,
      c.published,
      c.sort_order,
      c.asset_version,
      c.rating_avg,
      c.review_count,
      c.created_at,
      c.updated_at,
      c.deleted_at,
      c.category_name,
      c.category_slug,
      c.taxonomy_category_name,
      c.taxonomy_category_slug,
      c.child_category_name,
      c.child_category_slug,
      c.industry_name,
      c.industry_slug,
      c.screen_count,
      case
        when v_tsquery is not null then ts_rank_cd(p.search_vector, v_tsquery)
        else 0::real
      end as search_rank
    from public.software_project_cards c
    join public.software_projects p on p.id = c.id
    where c.deleted_at is null
      and (
        case
          when not coalesce(p_include_drafts, false) then c.published = true
          when p_published is true then c.published = true
          when p_published is false then c.published = false
          else true
        end
      )
      and (v_tsquery is null or p.search_vector @@ v_tsquery)
      and (
        p_taxonomy_slug is null
        or p_taxonomy_slug = ''
        or p_taxonomy_slug = 'all'
        or c.taxonomy_category_slug = p_taxonomy_slug
      )
      and (
        p_child_slug is null
        or p_child_slug = ''
        or p_child_slug = 'all'
        or c.child_category_slug = p_child_slug
      )
      and (
        p_industry is null
        or p_industry = ''
        or p_industry = 'all'
        or c.category_slug = p_industry
      )
      and (
        p_industry_slug is null
        or p_industry_slug = ''
        or p_industry_slug = 'all'
        or c.industry_slug = p_industry_slug
      )
      and (p_min_price is null or c.starting_price >= p_min_price)
      and (p_max_price is null or c.starting_price <= p_max_price)
      and (
        p_business_sizes is null
        or cardinality(p_business_sizes) = 0
        or c.business_size = any (p_business_sizes)
      )
      and (
        p_solution_groups is null
        or cardinality(p_solution_groups) = 0
        or c.solution_group = any (p_solution_groups)
      )
      and (
        p_child_slugs is null
        or cardinality(p_child_slugs) = 0
        or c.child_category_slug = any (p_child_slugs)
      )
      and (p_featured is null or c.featured = p_featured)
      and (p_popular is null or c.popular = p_popular)
  ),
  counted as (
    select f.*, count(*) over () as total_count
    from filtered f
  )
  select
    counted.id,
    counted.title,
    counted.slug,
    counted.short_description,
    counted.feature_summary,
    counted.category_id,
    counted.industry,
    counted.business_type,
    counted.solution_group,
    counted.software_type,
    counted.platform_type,
    counted.main_category_id,
    counted.taxonomy_category_id,
    counted.child_category_id,
    counted.industry_id,
    counted.canonical_path,
    counted.badge,
    counted.business_size,
    counted.package_tier,
    counted.payment_type,
    counted.cover_card_url,
    counted.cover_detail_url,
    counted.starting_price,
    counted.price_suffix,
    counted.currency,
    counted.featured,
    counted.popular,
    counted.published,
    counted.sort_order,
    counted.asset_version,
    counted.rating_avg,
    counted.review_count,
    counted.created_at,
    counted.updated_at,
    counted.deleted_at,
    counted.category_name,
    counted.category_slug,
    counted.taxonomy_category_name,
    counted.taxonomy_category_slug,
    counted.child_category_name,
    counted.child_category_slug,
    counted.industry_name,
    counted.industry_slug,
    counted.screen_count,
    counted.total_count,
    counted.search_rank
  from counted
  order by
    case when v_sort = 'relevance' then counted.search_rank else 0 end desc,
    case when v_sort = 'newest' then extract(epoch from counted.created_at) else 0 end desc,
    case when v_sort = 'price-asc' then counted.starting_price else 0 end asc,
    case when v_sort in ('popular', 'relevance') then case when counted.featured then 1 else 0 end else 0 end desc,
    case when v_sort in ('popular', 'relevance') then counted.sort_order else 0 end asc,
    counted.created_at desc,
    counted.id asc
  limit v_limit
  offset v_offset;
end;
$$;

create or replace function public.search_creative_marketing_project_cards(
  p_q text default null,
  p_service_groups text[] default null,
  p_industry_slug text default null,
  p_featured boolean default null,
  p_popular boolean default null,
  p_include_drafts boolean default false,
  p_published boolean default null,
  p_limit int default 24,
  p_offset int default 0
)
returns table (
  id uuid,
  title text,
  slug text,
  short_description text,
  outcome_line text,
  service_group text,
  service_type text,
  service_subcategory text,
  target_business text,
  pricing_model text,
  industry_id uuid,
  canonical_path text,
  badge text,
  business_size text,
  package_tier text,
  payment_type text,
  cover_card_url text,
  cover_detail_url text,
  starting_price numeric,
  price_suffix text,
  currency text,
  featured boolean,
  popular boolean,
  published boolean,
  sort_order int,
  rating_avg numeric,
  review_count int,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  industry_name text,
  industry_slug text,
  asset_count int,
  total_count bigint,
  search_rank real
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_q text := nullif(trim(coalesce(p_q, '')), '');
  v_tsquery tsquery;
  v_limit int := greatest(1, least(coalesce(p_limit, 24), 100));
  v_offset int := greatest(0, coalesce(p_offset, 0));
begin
  if v_q is not null then
    begin
      v_tsquery := websearch_to_tsquery('english', v_q);
    exception when others then
      v_tsquery := plainto_tsquery('english', v_q);
    end;
    if v_tsquery is null or length(trim(v_tsquery::text)) = 0 then
      v_q := null;
      v_tsquery := null;
    end if;
  end if;

  return query
  with filtered as (
    select
      c.id,
      c.title,
      c.slug,
      c.short_description,
      c.outcome_line,
      c.service_group,
      c.service_type,
      c.service_subcategory,
      c.target_business,
      c.pricing_model,
      c.industry_id,
      c.canonical_path,
      c.badge,
      c.business_size,
      c.package_tier,
      c.payment_type,
      c.cover_card_url,
      c.cover_detail_url,
      c.starting_price,
      c.price_suffix,
      c.currency,
      c.featured,
      c.popular,
      c.published,
      c.sort_order,
      c.rating_avg,
      c.review_count,
      c.created_at,
      c.updated_at,
      c.deleted_at,
      c.industry_name,
      c.industry_slug,
      c.asset_count,
      case
        when v_tsquery is not null then ts_rank_cd(p.search_vector, v_tsquery)
        else 0::real
      end as search_rank
    from public.creative_marketing_project_cards c
    join public.creative_marketing_projects p on p.id = c.id
    where c.deleted_at is null
      and (
        case
          when not coalesce(p_include_drafts, false) then c.published = true
          when p_published is true then c.published = true
          when p_published is false then c.published = false
          else true
        end
      )
      and (v_tsquery is null or p.search_vector @@ v_tsquery)
      and (
        p_service_groups is null
        or cardinality(p_service_groups) = 0
        or c.service_group = any (p_service_groups)
      )
      and (
        p_industry_slug is null
        or p_industry_slug = ''
        or p_industry_slug = 'all'
        or c.industry_slug = p_industry_slug
      )
      and (p_featured is null or c.featured = p_featured)
      and (p_popular is null or c.popular = p_popular)
  ),
  counted as (
    select f.*, count(*) over () as total_count
    from filtered f
  )
  select
    counted.id,
    counted.title,
    counted.slug,
    counted.short_description,
    counted.outcome_line,
    counted.service_group,
    counted.service_type,
    counted.service_subcategory,
    counted.target_business,
    counted.pricing_model,
    counted.industry_id,
    counted.canonical_path,
    counted.badge,
    counted.business_size,
    counted.package_tier,
    counted.payment_type,
    counted.cover_card_url,
    counted.cover_detail_url,
    counted.starting_price,
    counted.price_suffix,
    counted.currency,
    counted.featured,
    counted.popular,
    counted.published,
    counted.sort_order,
    counted.rating_avg,
    counted.review_count,
    counted.created_at,
    counted.updated_at,
    counted.deleted_at,
    counted.industry_name,
    counted.industry_slug,
    counted.asset_count,
    counted.total_count,
    counted.search_rank
  from counted
  order by
    case when v_tsquery is not null then counted.search_rank else 0 end desc,
    counted.featured desc,
    counted.sort_order asc,
    counted.created_at desc,
    counted.id asc
  limit v_limit
  offset v_offset;
end;
$$;

grant execute on function public.ecommerce_projects_refresh_search_vector(uuid) to service_role;
grant execute on function public.software_projects_refresh_search_vector(uuid) to service_role;
grant execute on function public.creative_marketing_projects_refresh_search_vector(uuid) to service_role;

grant execute on function public.search_ecommerce_project_cards(
  text, text[], text, text, text, text, boolean, numeric, numeric, text[], boolean, boolean, int, int
) to anon, authenticated, service_role;

grant execute on function public.search_software_project_cards(
  text, text, text, text, text, numeric, numeric, text[], text[], text[], boolean, boolean, boolean, boolean, text, int, int
) to anon, authenticated, service_role;

grant execute on function public.search_creative_marketing_project_cards(
  text, text[], text, boolean, boolean, boolean, boolean, int, int
) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
