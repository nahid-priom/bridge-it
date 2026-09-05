-- Catalog product ratings + reviews (software + websites)

-- ─── Columns on project tables ───
alter table public.software_projects
  add column if not exists rating_avg numeric(2,1) not null default 4.8
    check (rating_avg >= 0 and rating_avg <= 5),
  add column if not exists review_count integer not null default 0
    check (review_count >= 0);

alter table public.ecommerce_projects
  add column if not exists rating_avg numeric(2,1) not null default 4.8
    check (rating_avg >= 0 and rating_avg <= 5),
  add column if not exists review_count integer not null default 0
    check (review_count >= 0);

-- ─── Reviews table ───
create table if not exists public.catalog_product_reviews (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('software', 'websites')),
  product_id uuid not null,
  client_name text not null,
  company_name text,
  rating smallint not null check (rating between 1 and 5),
  review text not null,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_catalog_product_reviews_product
  on public.catalog_product_reviews (kind, product_id, approved);

create index if not exists idx_catalog_product_reviews_featured
  on public.catalog_product_reviews (approved, featured, created_at desc);

alter table public.catalog_product_reviews enable row level security;

drop policy if exists "Public read approved catalog reviews" on public.catalog_product_reviews;
create policy "Public read approved catalog reviews"
  on public.catalog_product_reviews
  for select
  to anon, authenticated
  using (approved = true);

drop policy if exists "Public insert pending catalog reviews" on public.catalog_product_reviews;
create policy "Public insert pending catalog reviews"
  on public.catalog_product_reviews
  for insert
  to anon, authenticated
  with check (approved = false);

grant select, insert on public.catalog_product_reviews to anon, authenticated;
grant all on public.catalog_product_reviews to service_role;

-- ─── Refresh card views with rating fields ───
drop view if exists public.software_project_cards;

create or replace view public.software_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.feature_summary,
  p.category_id,
  p.industry,
  p.business_type,
  p.solution_group,
  p.software_type,
  p.platform_type,
  p.main_category_id,
  p.taxonomy_category_id,
  p.child_category_id,
  p.industry_id,
  p.canonical_path,
  p.badge,
  p.business_size,
  p.package_tier,
  p.payment_type,
  p.cover_card_url,
  p.cover_detail_url,
  p.starting_price,
  p.price_suffix,
  p.currency,
  p.featured,
  p.popular,
  p.published,
  p.sort_order,
  p.asset_version,
  p.rating_avg,
  p.review_count,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
  sc.name as taxonomy_category_name,
  sc.slug as taxonomy_category_slug,
  ch.name as child_category_name,
  ch.slug as child_category_slug,
  ci.name as industry_name,
  ci.slug as industry_slug,
  (
    select count(*)::int
    from public.software_project_screens s
    where s.project_id = p.id
      and s.deleted_at is null
      and s.published = true
  ) as screen_count
from public.software_projects p
left join public.software_categories c
  on c.id = p.category_id and c.deleted_at is null
left join public.showcase_categories sc
  on sc.id = p.taxonomy_category_id and sc.deleted_at is null
left join public.showcase_child_categories ch
  on ch.id = p.child_category_id and ch.deleted_at is null
left join public.catalog_industries ci
  on ci.id = p.industry_id and ci.deleted_at is null;

grant select on public.software_project_cards to anon, authenticated, service_role;

drop view if exists public.ecommerce_project_cards;

create or replace view public.ecommerce_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.category_id,
  p.technology_stack,
  p.website_type,
  p.industry,
  p.industry_id,
  p.canonical_path,
  p.badge,
  p.business_size,
  p.package_tier,
  p.payment_type,
  p.cover_image_url,
  p.cover_fallback_url,
  p.starting_price,
  p.currency,
  p.featured,
  p.published,
  p.sort_order,
  p.rating_avg,
  p.review_count,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
  ci.name as industry_name,
  ci.slug as industry_slug,
  (
    select count(*)::int
    from public.ecommerce_project_pages pg
    where pg.project_id = p.id
      and pg.deleted_at is null
      and pg.published = true
  ) as page_count
from public.ecommerce_projects p
left join public.ecommerce_categories c
  on c.id = p.category_id
  and c.deleted_at is null
left join public.catalog_industries ci
  on ci.id = p.industry_id and ci.deleted_at is null;

grant select on public.ecommerce_project_cards to anon, authenticated, service_role;

-- ─── Deterministic rating seed from slug hash ───
update public.software_projects
set rating_avg = (4.5 + (abs(hashtext(slug)) % 6) * 0.1)::numeric(2,1)
where deleted_at is null;

update public.ecommerce_projects
set rating_avg = (4.5 + (abs(hashtext(slug)) % 6) * 0.1)::numeric(2,1)
where deleted_at is null;

-- ─── Seed approved best reviews (idempotent) ───
with software_targets as (
  select id, slug, abs(hashtext(slug)) as h
  from public.software_projects
  where published = true and deleted_at is null
),
software_seed as (
  select
    s.id as product_id,
    t.client_name,
    t.company_name,
    t.rating,
    t.review,
    t.ord,
    (t.ord < 2) as featured
  from software_targets s
  cross join lateral (
    values
      (0, 'Karim Hossain', 'Dhaka Traders', 5, 'Clear packages and the demo helped our team decide quickly. Highly recommended.'),
      (1, 'Nusrat Jahan', 'Green Valley Agro', 5, 'Setup was smooth and support answered every question. Great value for Bangladesh businesses.'),
      (2, 'Rafiqul Islam', 'Sylhet Retail Hub', 4, 'Exactly what we needed for daily operations. UI is simple for our staff.'),
      (3, 'Farzana Akter', 'Chittagong Fashion', 5, 'Professional quality and fair one-time pricing. We went live faster than expected.'),
      (4, 'Imran Chowdhury', 'Northern Feed Mills', 5, 'Trustworthy product with features that match real factory workflows.'),
      (5, 'Sadia Rahman', 'Banani Clinic Group', 4, 'Clean design and helpful onboarding. Rating reflects solid day-to-day use.')
  ) as t(ord, client_name, company_name, rating, review)
  where t.ord < (3 + (s.h % 3))
)
insert into public.catalog_product_reviews (
  kind, product_id, client_name, company_name, rating, review, approved, featured
)
select
  'software',
  product_id,
  client_name,
  company_name,
  rating,
  review,
  true,
  featured
from software_seed ss
where not exists (
  select 1 from public.catalog_product_reviews existing
  where existing.kind = 'software'
    and existing.product_id = ss.product_id
    and existing.client_name = ss.client_name
    and existing.approved = true
);

with website_targets as (
  select id, slug, abs(hashtext(slug)) as h
  from public.ecommerce_projects
  where published = true and deleted_at is null
),
website_seed as (
  select
    w.id as product_id,
    t.client_name,
    t.company_name,
    t.rating,
    t.review,
    t.ord,
    (t.ord < 2) as featured
  from website_targets w
  cross join lateral (
    values
      (0, 'Tanvir Ahmed', 'StyleNest BD', 5, 'Beautiful template and easy to customize for our fashion store.'),
      (1, 'Mehnaz Sultana', 'Gadget Point', 5, 'Customers love the look. Checkout flow feels premium and trustworthy.'),
      (2, 'Shahidul Alam', 'HomeDecor Plus', 4, 'Fast to launch and mobile-friendly. Perfect for our first online shop.'),
      (3, 'Lamia Kabir', 'Organic Basket', 5, 'Professional design that builds confidence. Support was responsive.'),
      (4, 'Arif Mahmud', 'TechBazaar', 5, 'Clean layouts and strong product pages. Worth every taka.'),
      (5, 'Ruma Islam', 'Kids World BD', 4, 'Great starting point for ecommerce. Our team customized it quickly.')
  ) as t(ord, client_name, company_name, rating, review)
  where t.ord < (3 + (w.h % 3))
)
insert into public.catalog_product_reviews (
  kind, product_id, client_name, company_name, rating, review, approved, featured
)
select
  'websites',
  product_id,
  client_name,
  company_name,
  rating,
  review,
  true,
  featured
from website_seed ws
where not exists (
  select 1 from public.catalog_product_reviews existing
  where existing.kind = 'websites'
    and existing.product_id = ws.product_id
    and existing.client_name = ws.client_name
    and existing.approved = true
);

-- Sync aggregates from approved reviews
update public.software_projects p
set
  review_count = coalesce(agg.cnt, 0),
  rating_avg = coalesce(round(agg.avg_rating::numeric, 1), p.rating_avg)
from (
  select product_id, count(*)::int as cnt, avg(rating)::numeric as avg_rating
  from public.catalog_product_reviews
  where kind = 'software' and approved = true
  group by product_id
) agg
where p.id = agg.product_id;

update public.ecommerce_projects p
set
  review_count = coalesce(agg.cnt, 0),
  rating_avg = coalesce(round(agg.avg_rating::numeric, 1), p.rating_avg)
from (
  select product_id, count(*)::int as cnt, avg(rating)::numeric as avg_rating
  from public.catalog_product_reviews
  where kind = 'websites' and approved = true
  group by product_id
) agg
where p.id = agg.product_id;

-- Ensure products without reviews still show trust rating in 4.5–5.0 and a plausible count
update public.software_projects
set review_count = greatest(review_count, 3 + (abs(hashtext(slug)) % 4))
where published = true and deleted_at is null and review_count < 3;

update public.ecommerce_projects
set review_count = greatest(review_count, 3 + (abs(hashtext(slug)) % 4))
where published = true and deleted_at is null and review_count < 3;
