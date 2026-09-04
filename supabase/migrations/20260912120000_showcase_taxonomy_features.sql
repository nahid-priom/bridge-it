-- Features-based Software Catalog: showcase taxonomy, product FKs, features, screen captions
-- Additive / safe. Does not wipe software_projects.

-- ─── Taxonomy tables ───
create table if not exists public.showcase_main_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  cover_url text,
  cover_path text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.showcase_categories (
  id uuid primary key default gen_random_uuid(),
  main_category_id uuid not null references public.showcase_main_categories (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  icon text,
  cover_url text,
  cover_path text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (main_category_id, slug)
);

create index if not exists idx_showcase_categories_main
  on public.showcase_categories (main_category_id, sort_order)
  where deleted_at is null;

create table if not exists public.showcase_child_categories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.showcase_categories (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  icon text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (category_id, slug)
);

create index if not exists idx_showcase_child_categories_cat
  on public.showcase_child_categories (category_id, sort_order)
  where deleted_at is null;

-- ─── Software project taxonomy FKs (keep existing industry category_id) ───
alter table public.software_projects
  add column if not exists main_category_id uuid references public.showcase_main_categories (id) on delete set null,
  add column if not exists taxonomy_category_id uuid references public.showcase_categories (id) on delete set null,
  add column if not exists child_category_id uuid references public.showcase_child_categories (id) on delete set null,
  add column if not exists feature_summary text;

create index if not exists idx_software_projects_taxonomy_category
  on public.software_projects (taxonomy_category_id, sort_order, id)
  where deleted_at is null;

create index if not exists idx_software_projects_child_category
  on public.software_projects (child_category_id, sort_order, id)
  where deleted_at is null;

-- ─── Product features ───
create table if not exists public.software_product_features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.software_projects (id) on delete cascade,
  title text not null,
  short_description text,
  icon_key text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_software_product_features_project
  on public.software_product_features (project_id, sort_order)
  where deleted_at is null;

-- ─── Screen captions ───
alter table public.software_project_screens
  add column if not exists module_name text,
  add column if not exists short_caption text,
  add column if not exists mobile_image_url text,
  add column if not exists mobile_image_path text;

update public.software_project_screens
set
  module_name = coalesce(nullif(module_name, ''), screen_name),
  short_caption = coalesce(nullif(short_caption, ''), screen_name)
where module_name is null or short_caption is null;

-- ─── Seed main categories ───
insert into public.showcase_main_categories (name, slug, description, sort_order)
values
  ('Software', 'software', 'Business software and admin systems', 10),
  ('Websites', 'websites', 'E-commerce and business websites', 20),
  ('Creative & Marketing', 'creative-marketing', 'Design and digital marketing services', 30)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ─── Seed Software L2 categories ───
with main as (
  select id from public.showcase_main_categories where slug = 'software' and deleted_at is null limit 1
)
insert into public.showcase_categories (main_category_id, name, slug, description, sort_order)
select main.id, v.name, v.slug, v.description, v.sort_order
from main
cross join (values
  ('ERP', 'erp', 'Enterprise resource planning systems', 10),
  ('POS', 'pos', 'Point of sale and retail systems', 20),
  ('CRM', 'crm', 'Customer relationship and sales systems', 30),
  ('HRM', 'hrm', 'HR and payroll systems', 40),
  ('Business Automation', 'business-automation', 'Workflow and operations automation', 50),
  ('E-commerce Admin', 'ecommerce-admin', 'Online store admin and operations systems', 60),
  ('Industry Management', 'industry-management', 'Industry-specific management software', 70)
) as v(name, slug, description, sort_order)
on conflict (main_category_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ─── Seed Software L3 children ───
insert into public.showcase_child_categories (category_id, name, slug, sort_order)
select c.id, v.name, v.slug, v.sort_order
from public.showcase_categories c
join public.showcase_main_categories m on m.id = c.main_category_id and m.slug = 'software'
cross join lateral (
  select * from (values
    ('erp', 'Manufacturing ERP', 'manufacturing-erp', 10),
    ('erp', 'Garments ERP', 'garments-erp', 20),
    ('erp', 'Feed Mill ERP', 'feed-mill-erp', 30),
    ('erp', 'Wholesale ERP', 'wholesale-erp', 40),
    ('erp', 'Trading ERP', 'trading-erp', 50),
    ('erp', 'Multi-Branch ERP', 'multi-branch-erp', 60),
    ('pos', 'Retail POS', 'retail-pos', 10),
    ('pos', 'Super Shop', 'super-shop', 20),
    ('pos', 'Restaurant POS', 'restaurant-pos', 30),
    ('crm', 'CRM System', 'crm-system', 10),
    ('crm', 'Sales Force Automation', 'sales-force-automation', 20),
    ('hrm', 'HR Payroll', 'hr-payroll', 10),
    ('hrm', 'Manpower Recruiting', 'manpower-recruiting', 20),
    ('business-automation', 'Inventory Warehouse', 'inventory-warehouse', 10),
    ('business-automation', 'ISP Management', 'isp-management', 20),
    ('business-automation', 'SaaS Management', 'saas-management', 30),
    ('ecommerce-admin', 'E-commerce Admin', 'ecommerce-admin', 10),
    ('industry-management', 'Poultry ERP', 'poultry-erp', 10),
    ('industry-management', 'Dealership Management', 'dealership-management', 20),
    ('industry-management', 'Distribution ERP', 'distribution-erp', 30),
    ('industry-management', 'Hospital Management', 'hospital-management', 40),
    ('industry-management', 'Pharmacy', 'pharmacy', 50),
    ('industry-management', 'School Management', 'school-management', 60),
    ('industry-management', 'Real Estate', 'real-estate', 70),
    ('industry-management', 'Logistics', 'logistics', 80),
    ('industry-management', 'Construction', 'construction', 90)
  ) as x(parent_slug, name, slug, sort_order)
  where x.parent_slug = c.slug
) v
on conflict (category_id, slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ─── Backfill project main/taxonomy/child from solution_group + slug ───
update public.software_projects p
set main_category_id = m.id
from public.showcase_main_categories m
where m.slug = 'software' and m.deleted_at is null and p.deleted_at is null;

-- Map solution_group → L2
update public.software_projects p
set taxonomy_category_id = c.id
from public.showcase_categories c
join public.showcase_main_categories m on m.id = c.main_category_id and m.slug = 'software'
where p.deleted_at is null and c.deleted_at is null and (
  (p.solution_group in ('erp-business-management') and c.slug = 'erp')
  or (p.solution_group in ('pos-retail') and c.slug = 'pos')
  or (p.solution_group in ('crm-sales') and c.slug = 'crm')
  or (p.solution_group in ('hrm-payroll') and c.slug = 'hrm')
  or (p.solution_group in ('business-automation', 'inventory-warehouse', 'saas-platforms', 'mobile-apps') and c.slug = 'business-automation')
  or (p.solution_group in (
      'manufacturing-production','agro-farm-management','distribution-dealership',
      'healthcare-software','education-software','logistics-courier',
      'real-estate-construction','restaurant-hospitality','enterprise-solutions'
    ) and c.slug = 'industry-management')
);

-- Slug → child category
update public.software_projects p
set child_category_id = ch.id
from public.showcase_child_categories ch
join public.showcase_categories c on c.id = ch.category_id
join public.showcase_main_categories m on m.id = c.main_category_id and m.slug = 'software'
where p.deleted_at is null and (
  (p.slug = 'garments-erp' and ch.slug = 'garments-erp')
  or (p.slug in ('manufacturing-erp','factory-management','textile-erp','dyeing-management','garments-accessories-erp','printing-press-management','packaging-factory-erp','electronics-assembly-erp','brick-tiles-erp','rice-mill-erp','flour-mill-erp','oil-production-erp') and ch.slug = 'manufacturing-erp')
  or (p.slug = 'feed-mill-erp' and ch.slug = 'feed-mill-erp')
  or (p.slug in ('wholesale-erp') and ch.slug = 'wholesale-erp')
  or (p.slug in ('trading-erp') and ch.slug = 'trading-erp')
  or (p.slug = 'multi-branch-erp' and ch.slug = 'multi-branch-erp')
  or (p.slug = 'retail-pos' and ch.slug = 'retail-pos')
  or (p.slug = 'super-shop-management' and ch.slug = 'super-shop')
  or (p.slug in ('restaurant-management','bakery-management') and ch.slug = 'restaurant-pos')
  or (p.slug = 'crm-system' and ch.slug = 'crm-system')
  or (p.slug = 'sales-force-automation' and ch.slug = 'sales-force-automation')
  or (p.slug = 'hr-payroll' and ch.slug = 'hr-payroll')
  or (p.slug = 'manpower-recruiting-erp' and ch.slug = 'manpower-recruiting')
  or (p.slug = 'inventory-warehouse-erp' and ch.slug = 'inventory-warehouse')
  or (p.slug = 'isp-management' and ch.slug = 'isp-management')
  or (p.slug = 'saas-management' and ch.slug = 'saas-management')
  or (p.slug in ('poultry-management-erp','layer-farm-management','fish-farm-management','cattle-dairy-management') and ch.slug = 'poultry-erp')
  or (p.slug = 'dealership-management' and ch.slug = 'dealership-management')
  or (p.slug = 'distribution-management' and ch.slug = 'distribution-erp')
  or (p.slug in ('hospital-management','diagnostic-center-management','clinic-management') and ch.slug = 'hospital-management')
  or (p.slug = 'pharmacy-management' and ch.slug = 'pharmacy')
  or (p.slug in ('school-management','college-management','coaching-management') and ch.slug = 'school-management')
  or (p.slug in ('real-estate-erp','property-management') and ch.slug = 'real-estate')
  or (p.slug in ('courier-management','logistics-erp','transport-management') and ch.slug = 'logistics')
  or (p.slug = 'construction-erp' and ch.slug = 'construction')
  or (p.slug in ('automobile-workshop','service-center-management','salon-management') and ch.slug = 'dealership-management')
);

-- Align taxonomy_category from child when missing
update public.software_projects p
set taxonomy_category_id = ch.category_id
from public.showcase_child_categories ch
where p.child_category_id = ch.id
  and p.taxonomy_category_id is null
  and p.deleted_at is null;

-- Feature summary from short_description
update public.software_projects
set feature_summary = coalesce(feature_summary, short_description)
where deleted_at is null and feature_summary is null;

-- ─── Rebuild card view ───
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
  p.cover_card_url,
  p.cover_detail_url,
  p.starting_price,
  p.price_suffix,
  p.currency,
  p.featured,
  p.popular,
  p.published,
  p.sort_order,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
  sc.name as taxonomy_category_name,
  sc.slug as taxonomy_category_slug,
  ch.name as child_category_name,
  ch.slug as child_category_slug,
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
  on ch.id = p.child_category_id and ch.deleted_at is null;

grant select on public.software_project_cards to anon, authenticated, service_role;

-- ─── Triggers ───
drop trigger if exists showcase_main_categories_updated_at on public.showcase_main_categories;
create trigger showcase_main_categories_updated_at
  before update on public.showcase_main_categories
  for each row execute function public.set_updated_at();

drop trigger if exists showcase_categories_updated_at on public.showcase_categories;
create trigger showcase_categories_updated_at
  before update on public.showcase_categories
  for each row execute function public.set_updated_at();

drop trigger if exists showcase_child_categories_updated_at on public.showcase_child_categories;
create trigger showcase_child_categories_updated_at
  before update on public.showcase_child_categories
  for each row execute function public.set_updated_at();

drop trigger if exists software_product_features_updated_at on public.software_product_features;
create trigger software_product_features_updated_at
  before update on public.software_product_features
  for each row execute function public.set_updated_at();

-- ─── RLS ───
alter table public.showcase_main_categories enable row level security;
alter table public.showcase_categories enable row level security;
alter table public.showcase_child_categories enable row level security;
alter table public.software_product_features enable row level security;

drop policy if exists "Public read active showcase main categories" on public.showcase_main_categories;
create policy "Public read active showcase main categories"
  on public.showcase_main_categories for select to anon, authenticated
  using (deleted_at is null and active = true);

drop policy if exists "Public read active showcase categories" on public.showcase_categories;
create policy "Public read active showcase categories"
  on public.showcase_categories for select to anon, authenticated
  using (deleted_at is null and active = true);

drop policy if exists "Public read active showcase child categories" on public.showcase_child_categories;
create policy "Public read active showcase child categories"
  on public.showcase_child_categories for select to anon, authenticated
  using (deleted_at is null and active = true);

drop policy if exists "Public read published software features" on public.software_product_features;
create policy "Public read published software features"
  on public.software_product_features for select to anon, authenticated
  using (
    deleted_at is null
    and published = true
    and exists (
      select 1 from public.software_projects p
      where p.id = project_id and p.deleted_at is null and p.published = true
    )
  );

drop policy if exists "Service role all showcase main categories" on public.showcase_main_categories;
create policy "Service role all showcase main categories"
  on public.showcase_main_categories for all to service_role using (true) with check (true);

drop policy if exists "Service role all showcase categories" on public.showcase_categories;
create policy "Service role all showcase categories"
  on public.showcase_categories for all to service_role using (true) with check (true);

drop policy if exists "Service role all showcase child categories" on public.showcase_child_categories;
create policy "Service role all showcase child categories"
  on public.showcase_child_categories for all to service_role using (true) with check (true);

drop policy if exists "Service role all software features" on public.software_product_features;
create policy "Service role all software features"
  on public.software_product_features for all to service_role using (true) with check (true);

grant select on public.showcase_main_categories to anon, authenticated, service_role;
grant select on public.showcase_categories to anon, authenticated, service_role;
grant select on public.showcase_child_categories to anon, authenticated, service_role;
grant select on public.software_product_features to anon, authenticated, service_role;
