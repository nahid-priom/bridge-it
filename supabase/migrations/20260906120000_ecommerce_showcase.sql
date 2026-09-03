-- Ecommerce Website Showcase — schema, RLS, storage, role helpers
-- Idempotent. Does NOT drop BITP / marketplace / auth tables.

-- ─── Role helpers ───
create or replace function public.is_showcase_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin', 'marketing_manager')
  );
$$;

create or replace function public.is_showcase_viewer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin', 'marketing_manager', 'viewer')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

comment on function public.is_showcase_editor() is
  'True when current user can create/edit ecommerce showcase content';
comment on function public.is_showcase_viewer() is
  'True when current user can view drafts and leads in admin';
comment on function public.is_super_admin() is
  'True when current user is super_admin (purge / restore)';

-- ─── Categories ───
create table if not exists public.ecommerce_categories (
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

create index if not exists idx_ecommerce_categories_active_sort
  on public.ecommerce_categories (active, sort_order)
  where deleted_at is null;

-- ─── Technologies catalog ───
create table if not exists public.ecommerce_technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Projects ───
create table if not exists public.ecommerce_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  short_description text,
  full_description text,
  category_id uuid references public.ecommerce_categories (id) on delete set null,
  technology_stack text[] not null default '{}',
  website_type text,
  industry text,
  cover_image_url text,
  cover_image_path text,
  cover_fallback_url text,
  cover_fallback_path text,
  og_image_url text,
  starting_price numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  featured boolean not null default false,
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

create unique index if not exists idx_ecommerce_projects_slug_active
  on public.ecommerce_projects (slug)
  where deleted_at is null;

create index if not exists idx_ecommerce_projects_public
  on public.ecommerce_projects (published, featured, sort_order)
  where deleted_at is null;

create index if not exists idx_ecommerce_projects_category
  on public.ecommerce_projects (category_id)
  where deleted_at is null;

create index if not exists idx_ecommerce_projects_tech_gin
  on public.ecommerce_projects using gin (technology_stack);

create index if not exists idx_ecommerce_projects_industry
  on public.ecommerce_projects (industry)
  where deleted_at is null;

-- ─── Project pages (screenshots) ───
create table if not exists public.ecommerce_project_pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.ecommerce_projects (id) on delete cascade,
  page_type text not null,
  page_name text not null,
  slug text not null,
  image_url text,
  image_path text,
  fallback_url text,
  fallback_path text,
  thumbnail_url text,
  thumbnail_path text,
  image_width integer,
  image_height integer,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint ecommerce_project_pages_type_check check (
    page_type in (
      'homepage',
      'landing_page',
      'shop',
      'category',
      'product_details',
      'cart',
      'checkout',
      'about',
      'contact',
      'dashboard',
      'mobile_view',
      'collection',
      'custom'
    )
  )
);

create unique index if not exists idx_ecommerce_project_pages_slug_active
  on public.ecommerce_project_pages (project_id, slug)
  where deleted_at is null;

create index if not exists idx_ecommerce_project_pages_project
  on public.ecommerce_project_pages (project_id, sort_order)
  where deleted_at is null;

create index if not exists idx_ecommerce_project_pages_type
  on public.ecommerce_project_pages (page_type)
  where deleted_at is null and published = true;

-- ─── Packages ───
create table if not exists public.ecommerce_packages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.ecommerce_projects (id) on delete cascade,
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

create index if not exists idx_ecommerce_packages_project
  on public.ecommerce_packages (project_id, sort_order)
  where deleted_at is null;

-- ─── Leads ───
create table if not exists public.project_leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.ecommerce_projects (id) on delete set null,
  package_id uuid references public.ecommerce_packages (id) on delete set null,
  name text not null,
  phone text not null,
  business_name text,
  website_url text,
  message text,
  preferred_contact text,
  status text not null default 'new',
  source text not null default 'project_page',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_leads_status_check check (
    status in ('new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'closed')
  )
);

create index if not exists idx_project_leads_status
  on public.project_leads (status, created_at desc);

create index if not exists idx_project_leads_project
  on public.project_leads (project_id, created_at desc);

-- ─── Public card view (security invoker so RLS on base tables applies) ───
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
  p.cover_image_url,
  p.cover_fallback_url,
  p.starting_price,
  p.currency,
  p.featured,
  p.published,
  p.sort_order,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
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
  and c.deleted_at is null;

grant select on public.ecommerce_project_cards to anon, authenticated, service_role;

-- ─── Updated_at triggers ───
drop trigger if exists ecommerce_categories_updated_at on public.ecommerce_categories;
create trigger ecommerce_categories_updated_at
  before update on public.ecommerce_categories
  for each row execute function public.set_updated_at();

drop trigger if exists ecommerce_projects_updated_at on public.ecommerce_projects;
create trigger ecommerce_projects_updated_at
  before update on public.ecommerce_projects
  for each row execute function public.set_updated_at();

drop trigger if exists ecommerce_project_pages_updated_at on public.ecommerce_project_pages;
create trigger ecommerce_project_pages_updated_at
  before update on public.ecommerce_project_pages
  for each row execute function public.set_updated_at();

drop trigger if exists ecommerce_packages_updated_at on public.ecommerce_packages;
create trigger ecommerce_packages_updated_at
  before update on public.ecommerce_packages
  for each row execute function public.set_updated_at();

drop trigger if exists project_leads_updated_at on public.project_leads;
create trigger project_leads_updated_at
  before update on public.project_leads
  for each row execute function public.set_updated_at();

-- ─── Lead RPC (anon insert; staff never exposed via unrestricted INSERT) ───
create or replace function public.submit_project_lead(
  p_name text,
  p_phone text,
  p_business_name text default null,
  p_message text default null,
  p_project_id uuid default null,
  p_package_id uuid default null,
  p_website_url text default null,
  p_preferred_contact text default null,
  p_source text default 'project_page'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  clean_name text := trim(coalesce(p_name, ''));
  clean_phone text := trim(coalesce(p_phone, ''));
begin
  if length(clean_name) < 2 then
    raise exception 'Name is required';
  end if;
  if clean_phone !~ '^[0-9+\-\s]{8,20}$' then
    raise exception 'A valid phone number is required';
  end if;

  if p_project_id is not null then
    if not exists (
      select 1 from public.ecommerce_projects
      where id = p_project_id and deleted_at is null
    ) then
      raise exception 'Project not found';
    end if;
  end if;

  if p_package_id is not null then
    if not exists (
      select 1 from public.ecommerce_packages
      where id = p_package_id and deleted_at is null
    ) then
      raise exception 'Package not found';
    end if;
  end if;

  insert into public.project_leads (
    project_id, package_id, name, phone, business_name,
    website_url, message, preferred_contact, status, source
  ) values (
    p_project_id,
    p_package_id,
    clean_name,
    clean_phone,
    nullif(trim(coalesce(p_business_name, '')), ''),
    nullif(trim(coalesce(p_website_url, '')), ''),
    nullif(trim(coalesce(p_message, '')), ''),
    nullif(trim(coalesce(p_preferred_contact, '')), ''),
    'new',
    coalesce(nullif(trim(coalesce(p_source, '')), ''), 'project_page')
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.submit_project_lead(
  text, text, text, text, uuid, uuid, text, text, text
) to anon, authenticated;

-- ─── RLS ───
alter table public.ecommerce_categories enable row level security;
alter table public.ecommerce_technologies enable row level security;
alter table public.ecommerce_projects enable row level security;
alter table public.ecommerce_project_pages enable row level security;
alter table public.ecommerce_packages enable row level security;
alter table public.project_leads enable row level security;

-- Categories
drop policy if exists "Public read active ecommerce categories" on public.ecommerce_categories;
create policy "Public read active ecommerce categories"
  on public.ecommerce_categories for select
  to anon, authenticated
  using (
    (active = true and deleted_at is null)
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage ecommerce categories" on public.ecommerce_categories;
create policy "Editors manage ecommerce categories"
  on public.ecommerce_categories for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

-- Technologies
drop policy if exists "Public read ecommerce technologies" on public.ecommerce_technologies;
create policy "Public read ecommerce technologies"
  on public.ecommerce_technologies for select
  to anon, authenticated
  using (true);

drop policy if exists "Editors manage ecommerce technologies" on public.ecommerce_technologies;
create policy "Editors manage ecommerce technologies"
  on public.ecommerce_technologies for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

-- Projects
drop policy if exists "Public read published ecommerce projects" on public.ecommerce_projects;
create policy "Public read published ecommerce projects"
  on public.ecommerce_projects for select
  to anon, authenticated
  using (
    (published = true and deleted_at is null)
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors insert ecommerce projects" on public.ecommerce_projects;
create policy "Editors insert ecommerce projects"
  on public.ecommerce_projects for insert
  to authenticated
  with check (public.is_showcase_editor());

drop policy if exists "Editors update ecommerce projects" on public.ecommerce_projects;
create policy "Editors update ecommerce projects"
  on public.ecommerce_projects for update
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Editors delete ecommerce projects" on public.ecommerce_projects;
create policy "Editors delete ecommerce projects"
  on public.ecommerce_projects for delete
  to authenticated
  using (public.is_showcase_editor());

-- Pages
drop policy if exists "Public read published project pages" on public.ecommerce_project_pages;
create policy "Public read published project pages"
  on public.ecommerce_project_pages for select
  to anon, authenticated
  using (
    (
      deleted_at is null
      and published = true
      and exists (
        select 1 from public.ecommerce_projects p
        where p.id = project_id
          and p.published = true
          and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage project pages" on public.ecommerce_project_pages;
create policy "Editors manage project pages"
  on public.ecommerce_project_pages for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

-- Packages
drop policy if exists "Public read active project packages" on public.ecommerce_packages;
create policy "Public read active project packages"
  on public.ecommerce_packages for select
  to anon, authenticated
  using (
    (
      deleted_at is null
      and active = true
      and exists (
        select 1 from public.ecommerce_projects p
        where p.id = project_id
          and p.published = true
          and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage project packages" on public.ecommerce_packages;
create policy "Editors manage project packages"
  on public.ecommerce_packages for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

-- Leads: no public SELECT/UPDATE/DELETE; insert only via RPC
drop policy if exists "Staff read project leads" on public.project_leads;
create policy "Staff read project leads"
  on public.project_leads for select
  to authenticated
  using (public.is_showcase_viewer());

drop policy if exists "Staff update project leads" on public.project_leads;
create policy "Staff update project leads"
  on public.project_leads for update
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Super admin delete project leads" on public.project_leads;
create policy "Super admin delete project leads"
  on public.project_leads for delete
  to authenticated
  using (public.is_super_admin());

-- ─── Storage bucket ───
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ecommerce-showcase',
  'ecommerce-showcase',
  true,
  15728640,
  array['image/avif', 'image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read ecommerce showcase" on storage.objects;
create policy "Public read ecommerce showcase"
  on storage.objects for select
  to public
  using (bucket_id = 'ecommerce-showcase');

drop policy if exists "Editors insert ecommerce showcase" on storage.objects;
create policy "Editors insert ecommerce showcase"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'ecommerce-showcase' and public.is_showcase_editor());

drop policy if exists "Editors update ecommerce showcase" on storage.objects;
create policy "Editors update ecommerce showcase"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'ecommerce-showcase' and public.is_showcase_editor())
  with check (bucket_id = 'ecommerce-showcase' and public.is_showcase_editor());

drop policy if exists "Editors delete ecommerce showcase" on storage.objects;
create policy "Editors delete ecommerce showcase"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'ecommerce-showcase' and public.is_showcase_editor());

-- ─── Catalog seeds ───
insert into public.ecommerce_categories (slug, name, description, icon, sort_order, active)
values
  ('fashion', 'Fashion', 'Apparel, lookbooks, and premium clothing stores.', '👗', 1, true),
  ('electronics', 'Electronics', 'Gadgets, devices, and tech storefronts.', '💻', 2, true),
  ('grocery', 'Grocery', 'Fresh grocery and everyday essentials shops.', '🛒', 3, true),
  ('cosmetics', 'Cosmetics', 'Skincare, beauty, and cosmetics boutiques.', '✨', 4, true),
  ('furniture', 'Furniture', 'Furniture and home decor commerce.', '🛋️', 5, true),
  ('restaurant', 'Restaurant', 'Restaurant ordering and food commerce.', '🍽️', 6, true),
  ('organic-food', 'Organic Food', 'Organic and natural food stores.', '🥬', 7, true),
  ('jewellery', 'Jewellery', 'Fine jewellery and accessories stores.', '💎', 8, true),
  ('multi-vendor', 'Multi Vendor', 'Marketplace-style multi-seller stores.', '🏪', 9, true),
  ('single-product', 'Single Product', 'Focused single-SKU landing stores.', '📦', 10, true),
  ('wholesale', 'Wholesale', 'B2B wholesale and bulk ordering.', '📦', 11, true),
  ('b2b', 'B2B', 'Business-to-business commerce platforms.', '🏢', 12, true),
  ('local-shop', 'Local Shop', 'Neighbourhood and local retail stores.', '🏬', 13, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  active = excluded.active,
  updated_at = now();

insert into public.ecommerce_technologies (slug, name, sort_order)
values
  ('nextjs', 'Next.js', 1),
  ('react', 'React', 2),
  ('laravel', 'Laravel', 3),
  ('typescript', 'TypeScript', 4),
  ('supabase', 'Supabase', 5),
  ('postgresql', 'PostgreSQL', 6),
  ('tailwindcss', 'Tailwind CSS', 7),
  ('nodejs', 'Node.js', 8)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

-- Privileges (PostgREST needs explicit GRANTs on new tables)
grant select on
  public.ecommerce_categories,
  public.ecommerce_technologies,
  public.ecommerce_projects,
  public.ecommerce_project_pages,
  public.ecommerce_packages,
  public.ecommerce_project_cards
to anon, authenticated;

grant insert, update, delete on
  public.ecommerce_categories,
  public.ecommerce_technologies,
  public.ecommerce_projects,
  public.ecommerce_project_pages,
  public.ecommerce_packages
to authenticated;

grant select, update on public.project_leads to authenticated;

grant all on
  public.ecommerce_categories,
  public.ecommerce_technologies,
  public.ecommerce_projects,
  public.ecommerce_project_pages,
  public.ecommerce_packages,
  public.project_leads
to service_role;

grant execute on function public.is_showcase_editor() to anon, authenticated, service_role;
grant execute on function public.is_showcase_viewer() to anon, authenticated, service_role;
grant execute on function public.is_super_admin() to authenticated, service_role;

comment on column public.profiles.role is
  'client | buyer | seller | admin | super_admin | marketing_manager | viewer';

notify pgrst, 'reload schema';
