-- Business Software / Admin Dashboard Showcase
-- Parallel to ecommerce_showcase. Does NOT modify ecommerce_* tables.

-- ─── Categories ───
create table if not exists public.software_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_software_categories_active_sort
  on public.software_categories (active, sort_order)
  where deleted_at is null;

-- ─── Projects ───
create table if not exists public.software_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  short_description text,
  full_description text,
  category_id uuid references public.software_categories (id) on delete set null,
  industry text,
  business_type text,
  primary_user text,
  modules text[] not null default '{}',
  cover_card_url text,
  cover_card_path text,
  cover_detail_url text,
  cover_detail_path text,
  og_image_url text,
  starting_price numeric(12, 2) not null default 0,
  price_suffix text not null default '',
  currency text not null default 'BDT',
  featured boolean not null default false,
  popular boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  seo_keywords text[] not null default '{}',
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists idx_software_projects_slug_active
  on public.software_projects (slug)
  where deleted_at is null;

create index if not exists idx_software_projects_public
  on public.software_projects (published, featured, sort_order, id)
  where deleted_at is null;

create index if not exists idx_software_projects_category
  on public.software_projects (category_id, sort_order, id)
  where deleted_at is null;

create index if not exists idx_software_projects_popular
  on public.software_projects (popular, sort_order, id)
  where deleted_at is null and published = true;

create index if not exists idx_software_projects_industry
  on public.software_projects (industry)
  where deleted_at is null;

-- ─── Screens (admin UI screenshots) ───
create table if not exists public.software_project_screens (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.software_projects (id) on delete cascade,
  screen_key text not null,
  screen_name text not null,
  image_url text,
  image_path text,
  thumbnail_url text,
  thumbnail_path text,
  image_width integer,
  image_height integer,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists idx_software_project_screens_key_active
  on public.software_project_screens (project_id, screen_key)
  where deleted_at is null;

create index if not exists idx_software_project_screens_project
  on public.software_project_screens (project_id, sort_order)
  where deleted_at is null;

-- ─── Packages ───
create table if not exists public.software_packages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.software_projects (id) on delete cascade,
  name text not null,
  price numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  short_description text,
  features jsonb not null default '[]'::jsonb,
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_software_packages_project
  on public.software_packages (project_id, sort_order)
  where deleted_at is null;

-- ─── Homepage placements ───
create table if not exists public.software_homepage_placements (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  project_id uuid not null references public.software_projects (id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint software_homepage_placements_section_check check (
    section_key in ('popular', 'manufacturing_erp', 'agro_distribution', 'services_ops')
  )
);

create unique index if not exists idx_software_homepage_placement_unique
  on public.software_homepage_placements (section_key, project_id);

create index if not exists idx_software_homepage_placements_section
  on public.software_homepage_placements (section_key, sort_order);

-- ─── Card view ───
create or replace view public.software_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.category_id,
  p.industry,
  p.business_type,
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
  (
    select count(*)::int
    from public.software_project_screens s
    where s.project_id = p.id
      and s.deleted_at is null
      and s.published = true
  ) as screen_count
from public.software_projects p
left join public.software_categories c
  on c.id = p.category_id
  and c.deleted_at is null;

grant select on public.software_project_cards to anon, authenticated, service_role;

-- ─── Updated_at ───
drop trigger if exists software_categories_updated_at on public.software_categories;
create trigger software_categories_updated_at
  before update on public.software_categories
  for each row execute function public.set_updated_at();

drop trigger if exists software_projects_updated_at on public.software_projects;
create trigger software_projects_updated_at
  before update on public.software_projects
  for each row execute function public.set_updated_at();

drop trigger if exists software_project_screens_updated_at on public.software_project_screens;
create trigger software_project_screens_updated_at
  before update on public.software_project_screens
  for each row execute function public.set_updated_at();

drop trigger if exists software_packages_updated_at on public.software_packages;
create trigger software_packages_updated_at
  before update on public.software_packages
  for each row execute function public.set_updated_at();

drop trigger if exists software_homepage_placements_updated_at on public.software_homepage_placements;
create trigger software_homepage_placements_updated_at
  before update on public.software_homepage_placements
  for each row execute function public.set_updated_at();

-- ─── RLS ───
alter table public.software_categories enable row level security;
alter table public.software_projects enable row level security;
alter table public.software_project_screens enable row level security;
alter table public.software_packages enable row level security;
alter table public.software_homepage_placements enable row level security;

drop policy if exists "Public read active software categories" on public.software_categories;
create policy "Public read active software categories"
  on public.software_categories for select
  to anon, authenticated
  using (
    (active = true and deleted_at is null)
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage software categories" on public.software_categories;
create policy "Editors manage software categories"
  on public.software_categories for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read published software projects" on public.software_projects;
create policy "Public read published software projects"
  on public.software_projects for select
  to anon, authenticated
  using (
    (published = true and deleted_at is null)
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors insert software projects" on public.software_projects;
create policy "Editors insert software projects"
  on public.software_projects for insert
  to authenticated
  with check (public.is_showcase_editor());

drop policy if exists "Editors update software projects" on public.software_projects;
create policy "Editors update software projects"
  on public.software_projects for update
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Editors delete software projects" on public.software_projects;
create policy "Editors delete software projects"
  on public.software_projects for delete
  to authenticated
  using (public.is_showcase_editor());

drop policy if exists "Public read published software screens" on public.software_project_screens;
create policy "Public read published software screens"
  on public.software_project_screens for select
  to anon, authenticated
  using (
    (
      deleted_at is null
      and published = true
      and exists (
        select 1 from public.software_projects p
        where p.id = project_id
          and p.published = true
          and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage software screens" on public.software_project_screens;
create policy "Editors manage software screens"
  on public.software_project_screens for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read active software packages" on public.software_packages;
create policy "Public read active software packages"
  on public.software_packages for select
  to anon, authenticated
  using (
    (
      deleted_at is null
      and active = true
      and exists (
        select 1 from public.software_projects p
        where p.id = project_id
          and p.published = true
          and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage software packages" on public.software_packages;
create policy "Editors manage software packages"
  on public.software_packages for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read software homepage placements" on public.software_homepage_placements;
create policy "Public read software homepage placements"
  on public.software_homepage_placements for select
  to anon, authenticated
  using (true);

drop policy if exists "Editors manage software homepage placements" on public.software_homepage_placements;
create policy "Editors manage software homepage placements"
  on public.software_homepage_placements for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

-- ─── Storage bucket (AVIF-first) ───
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-showcase',
  'admin-showcase',
  true,
  10485760,
  array['image/avif', 'image/webp', 'image/png', 'image/jpeg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read admin-showcase" on storage.objects;
create policy "Public read admin-showcase"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'admin-showcase');

drop policy if exists "Editors upload admin-showcase" on storage.objects;
create policy "Editors upload admin-showcase"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'admin-showcase' and public.is_showcase_editor());

drop policy if exists "Editors update admin-showcase" on storage.objects;
create policy "Editors update admin-showcase"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'admin-showcase' and public.is_showcase_editor())
  with check (bucket_id = 'admin-showcase' and public.is_showcase_editor());

drop policy if exists "Editors delete admin-showcase" on storage.objects;
create policy "Editors delete admin-showcase"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'admin-showcase' and public.is_showcase_editor());

-- Seed categories
insert into public.software_categories (name, slug, description, icon, sort_order)
values
  ('Manufacturing', 'manufacturing', 'Factory, production and plant ERP systems.', 'factory', 10),
  ('Trading & Distribution', 'trading-distribution', 'Wholesale, dealership and distribution software.', 'truck', 20),
  ('Retail & POS', 'retail-pos', 'Retail stores, POS and shop management.', 'store', 30),
  ('Agro & Farming', 'agro-farming', 'Feed, poultry, fish, cattle and farm systems.', 'sprout', 40),
  ('Garments & Textile', 'garments-textile', 'Apparel, dyeing and textile ERP.', 'shirt', 50),
  ('Healthcare', 'healthcare', 'Hospital, clinic, diagnostic and pharmacy systems.', 'heart-pulse', 60),
  ('Education', 'education', 'School, college and coaching management.', 'graduation-cap', 70),
  ('Logistics', 'logistics', 'Courier, transport and logistics ERP.', 'package', 80),
  ('Real Estate & Construction', 'real-estate-construction', 'Property, construction and project software.', 'building', 90),
  ('Service Business', 'service-business', 'Salon, workshop, ISP and service ops.', 'wrench', 100),
  ('Enterprise', 'enterprise', 'Multi-branch, CRM, HR and SaaS platforms.', 'building-2', 110)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  active = true,
  deleted_at = null;
