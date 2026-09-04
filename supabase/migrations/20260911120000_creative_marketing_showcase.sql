-- Creative & Digital Marketing showcase
-- Parallel to software_showcase. Does NOT modify ecommerce_* tables.

create table if not exists public.creative_marketing_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  short_description text,
  full_description text,
  outcome_line text,
  service_group text not null,
  service_type text,
  service_subcategory text,
  target_business text,
  pricing_model text not null default 'one_time'
    check (pricing_model in ('one_time', 'monthly', 'package', 'custom')),
  deliverables text[] not null default '{}',
  related_slugs text[] not null default '{}',
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

create unique index if not exists idx_cm_projects_slug_active
  on public.creative_marketing_projects (slug)
  where deleted_at is null;

create index if not exists idx_cm_projects_public
  on public.creative_marketing_projects (published, featured, sort_order, id)
  where deleted_at is null;

create index if not exists idx_cm_projects_service_group
  on public.creative_marketing_projects (service_group, sort_order, id)
  where deleted_at is null;

create index if not exists idx_cm_projects_popular
  on public.creative_marketing_projects (popular, sort_order, id)
  where deleted_at is null and published = true;

-- Portfolio / gallery images (design samples or marketing screens)
create table if not exists public.creative_marketing_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.creative_marketing_projects (id) on delete cascade,
  asset_key text not null,
  asset_name text not null,
  asset_kind text not null default 'portfolio'
    check (asset_kind in ('portfolio', 'dashboard', 'mockup', 'other')),
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

create unique index if not exists idx_cm_assets_key_active
  on public.creative_marketing_assets (project_id, asset_key)
  where deleted_at is null;

create index if not exists idx_cm_assets_project
  on public.creative_marketing_assets (project_id, sort_order)
  where deleted_at is null;

-- Packages / pricing tiers
create table if not exists public.creative_marketing_packages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.creative_marketing_projects (id) on delete cascade,
  name text not null,
  price numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  pricing_model text not null default 'one_time'
    check (pricing_model in ('one_time', 'monthly', 'package', 'custom')),
  short_description text,
  features jsonb not null default '[]'::jsonb,
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_cm_packages_project
  on public.creative_marketing_packages (project_id, sort_order)
  where deleted_at is null;

-- Homepage placements
create table if not exists public.creative_marketing_homepage_placements (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  project_id uuid not null references public.creative_marketing_projects (id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cm_homepage_placements_section_check check (section_key in ('popular'))
);

create unique index if not exists idx_cm_homepage_placement_unique
  on public.creative_marketing_homepage_placements (section_key, project_id);

create index if not exists idx_cm_homepage_placements_section
  on public.creative_marketing_homepage_placements (section_key, sort_order);

-- Cross-service bundles (configurable relationships)
create table if not exists public.service_bundles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  short_description text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists idx_service_bundles_slug_active
  on public.service_bundles (slug)
  where deleted_at is null;

create table if not exists public.service_bundle_items (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references public.service_bundles (id) on delete cascade,
  item_kind text not null
    check (item_kind in ('website', 'software', 'creative_marketing', 'bitp_product', 'external')),
  item_slug text not null,
  label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_service_bundle_items_bundle
  on public.service_bundle_items (bundle_id, sort_order);

-- Card view
create or replace view public.creative_marketing_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.outcome_line,
  p.service_group,
  p.service_type,
  p.service_subcategory,
  p.target_business,
  p.pricing_model,
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
  (
    select count(*)::int
    from public.creative_marketing_assets a
    where a.project_id = p.id
      and a.deleted_at is null
      and a.published = true
  ) as asset_count
from public.creative_marketing_projects p;

grant select on public.creative_marketing_project_cards to anon, authenticated, service_role;

-- Triggers
drop trigger if exists cm_projects_updated_at on public.creative_marketing_projects;
create trigger cm_projects_updated_at
  before update on public.creative_marketing_projects
  for each row execute function public.set_updated_at();

drop trigger if exists cm_assets_updated_at on public.creative_marketing_assets;
create trigger cm_assets_updated_at
  before update on public.creative_marketing_assets
  for each row execute function public.set_updated_at();

drop trigger if exists cm_packages_updated_at on public.creative_marketing_packages;
create trigger cm_packages_updated_at
  before update on public.creative_marketing_packages
  for each row execute function public.set_updated_at();

drop trigger if exists cm_homepage_placements_updated_at on public.creative_marketing_homepage_placements;
create trigger cm_homepage_placements_updated_at
  before update on public.creative_marketing_homepage_placements
  for each row execute function public.set_updated_at();

-- RLS
alter table public.creative_marketing_projects enable row level security;
alter table public.creative_marketing_assets enable row level security;
alter table public.creative_marketing_packages enable row level security;
alter table public.creative_marketing_homepage_placements enable row level security;
alter table public.service_bundles enable row level security;
alter table public.service_bundle_items enable row level security;

drop policy if exists "Public read published cm projects" on public.creative_marketing_projects;
create policy "Public read published cm projects"
  on public.creative_marketing_projects for select
  to anon, authenticated
  using (
    (published = true and deleted_at is null)
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage cm projects" on public.creative_marketing_projects;
create policy "Editors manage cm projects"
  on public.creative_marketing_projects for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read published cm assets" on public.creative_marketing_assets;
create policy "Public read published cm assets"
  on public.creative_marketing_assets for select
  to anon, authenticated
  using (
    (
      deleted_at is null
      and published = true
      and exists (
        select 1 from public.creative_marketing_projects p
        where p.id = project_id and p.published = true and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage cm assets" on public.creative_marketing_assets;
create policy "Editors manage cm assets"
  on public.creative_marketing_assets for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read active cm packages" on public.creative_marketing_packages;
create policy "Public read active cm packages"
  on public.creative_marketing_packages for select
  to anon, authenticated
  using (
    (
      deleted_at is null
      and active = true
      and exists (
        select 1 from public.creative_marketing_projects p
        where p.id = project_id and p.published = true and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage cm packages" on public.creative_marketing_packages;
create policy "Editors manage cm packages"
  on public.creative_marketing_packages for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read cm homepage placements" on public.creative_marketing_homepage_placements;
create policy "Public read cm homepage placements"
  on public.creative_marketing_homepage_placements for select
  to anon, authenticated
  using (true);

drop policy if exists "Editors manage cm homepage placements" on public.creative_marketing_homepage_placements;
create policy "Editors manage cm homepage placements"
  on public.creative_marketing_homepage_placements for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read published service bundles" on public.service_bundles;
create policy "Public read published service bundles"
  on public.service_bundles for select
  to anon, authenticated
  using ((published = true and deleted_at is null) or public.is_showcase_viewer());

drop policy if exists "Editors manage service bundles" on public.service_bundles;
create policy "Editors manage service bundles"
  on public.service_bundles for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read service bundle items" on public.service_bundle_items;
create policy "Public read service bundle items"
  on public.service_bundle_items for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.service_bundles b
      where b.id = bundle_id and b.published = true and b.deleted_at is null
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage service bundle items" on public.service_bundle_items;
create policy "Editors manage service bundle items"
  on public.service_bundle_items for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

-- Storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'creative-marketing-showcase',
  'creative-marketing-showcase',
  true,
  10485760,
  array['image/avif', 'image/webp', 'image/png', 'image/jpeg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read creative-marketing-showcase" on storage.objects;
create policy "Public read creative-marketing-showcase"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'creative-marketing-showcase');

drop policy if exists "Editors upload creative-marketing-showcase" on storage.objects;
create policy "Editors upload creative-marketing-showcase"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'creative-marketing-showcase' and public.is_showcase_editor());

drop policy if exists "Editors update creative-marketing-showcase" on storage.objects;
create policy "Editors update creative-marketing-showcase"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'creative-marketing-showcase' and public.is_showcase_editor())
  with check (bucket_id = 'creative-marketing-showcase' and public.is_showcase_editor());

drop policy if exists "Editors delete creative-marketing-showcase" on storage.objects;
create policy "Editors delete creative-marketing-showcase"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'creative-marketing-showcase' and public.is_showcase_editor());
