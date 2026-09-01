-- E-commerce Solution Showroom — schema extensions
-- Idempotent: safe to re-run.

-- ─── Product extensions ───
alter table public.products add column if not exists target_customer text;
alter table public.products add column if not exists promotional_price numeric(12, 2);
alter table public.products add column if not exists internal_demo_slug text;
alter table public.products add column if not exists showroom_featured boolean not null default false;
alter table public.products add column if not exists metadata jsonb not null default '{}'::jsonb;

create unique index if not exists idx_products_internal_demo_slug
  on public.products (internal_demo_slug)
  where internal_demo_slug is not null;

-- ─── Project stage admin notes ───
alter table public.project_stages add column if not exists admin_note text;

-- ─── E-commerce demo configs ───
create table if not exists public.ecommerce_demo_configs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products (id) on delete cascade,
  package_type text not null,
  feature_flags jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  admin_modules jsonb not null default '[]'::jsonb,
  product_limit integer not null default 12,
  industry text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ecommerce_demo_configs_product_id
  on public.ecommerce_demo_configs (product_id);

-- ─── Demo store categories ───
create table if not exists public.demo_store_categories (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.ecommerce_demo_configs (id) on delete cascade,
  name text not null,
  slug text not null,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (demo_config_id, slug)
);

create index if not exists idx_demo_store_categories_config
  on public.demo_store_categories (demo_config_id, sort_order);

-- ─── Demo store products ───
create table if not exists public.demo_store_products (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.ecommerce_demo_configs (id) on delete cascade,
  category_id uuid references public.demo_store_categories (id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  price numeric(12, 2) not null default 0,
  compare_at_price numeric(12, 2),
  image_url text,
  vertical text,
  variants jsonb not null default '[]'::jsonb,
  stock integer not null default 99,
  featured boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (demo_config_id, slug)
);

create index if not exists idx_demo_store_products_config
  on public.demo_store_products (demo_config_id, active, sort_order);

-- ─── Demo orders (isolated from real orders) ───
create table if not exists public.demo_orders (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.ecommerce_demo_configs (id) on delete cascade,
  session_id text not null,
  order_number text not null default public.generate_order_number(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  customer_email text,
  subtotal numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  payment_method text not null default 'cod',
  status text not null default 'placed',
  courier_status text,
  is_demo boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint demo_orders_status_check check (
    status in ('placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
  )
);

create index if not exists idx_demo_orders_config on public.demo_orders (demo_config_id);
create index if not exists idx_demo_orders_session on public.demo_orders (session_id);

-- ─── Demo order items ───
create table if not exists public.demo_order_items (
  id uuid primary key default gen_random_uuid(),
  demo_order_id uuid not null references public.demo_orders (id) on delete cascade,
  product_name text not null,
  product_slug text,
  quantity integer not null default 1,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  variant_label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_demo_order_items_order on public.demo_order_items (demo_order_id);

-- ─── Product FAQs ───
create table if not exists public.product_faqs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_faqs_product on public.product_faqs (product_id, sort_order);

-- ─── Project stage templates ───
create table if not exists public.project_stage_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_stage_template_steps (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.project_stage_templates (id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (template_id, sort_order)
);

create index if not exists idx_project_stage_template_steps
  on public.project_stage_template_steps (template_id, sort_order);

create table if not exists public.product_stage_templates (
  product_id uuid primary key references public.products (id) on delete cascade,
  template_id uuid not null references public.project_stage_templates (id) on delete restrict,
  created_at timestamptz not null default now()
);

-- ─── Consultation product link ───
alter table public.consultation_requests add column if not exists product_id uuid references public.products (id) on delete set null;

-- ─── Updated_at triggers ───
drop trigger if exists ecommerce_demo_configs_updated_at on public.ecommerce_demo_configs;
create trigger ecommerce_demo_configs_updated_at
  before update on public.ecommerce_demo_configs
  for each row execute function public.set_updated_at();

drop trigger if exists demo_store_products_updated_at on public.demo_store_products;
create trigger demo_store_products_updated_at
  before update on public.demo_store_products
  for each row execute function public.set_updated_at();

drop trigger if exists demo_orders_updated_at on public.demo_orders;
create trigger demo_orders_updated_at
  before update on public.demo_orders
  for each row execute function public.set_updated_at();

-- ─── RLS ───
alter table public.ecommerce_demo_configs enable row level security;
alter table public.demo_store_categories enable row level security;
alter table public.demo_store_products enable row level security;
alter table public.demo_orders enable row level security;
alter table public.demo_order_items enable row level security;
alter table public.product_faqs enable row level security;
alter table public.project_stage_templates enable row level security;
alter table public.project_stage_template_steps enable row level security;
alter table public.product_stage_templates enable row level security;

-- Demo configs: public read active configs for published products
drop policy if exists "Public read active demo configs" on public.ecommerce_demo_configs;
create policy "Public read active demo configs"
  on public.ecommerce_demo_configs for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage demo configs" on public.ecommerce_demo_configs;
create policy "Admins manage demo configs"
  on public.ecommerce_demo_configs for all
  using (public.is_admin())
  with check (public.is_admin());

-- Demo catalog
drop policy if exists "Public read demo store categories" on public.demo_store_categories;
create policy "Public read demo store categories"
  on public.demo_store_categories for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.ecommerce_demo_configs c
      join public.products p on p.id = c.product_id
      where c.id = demo_config_id and c.active = true and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage demo store categories" on public.demo_store_categories;
create policy "Admins manage demo store categories"
  on public.demo_store_categories for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read active demo products" on public.demo_store_products;
create policy "Public read active demo products"
  on public.demo_store_products for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.ecommerce_demo_configs c
      join public.products p on p.id = c.product_id
      where c.id = demo_config_id and c.active = true and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage demo store products" on public.demo_store_products;
create policy "Admins manage demo store products"
  on public.demo_store_products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Demo orders: anyone can insert/read own session (via session_id in app layer)
drop policy if exists "Anyone insert demo orders" on public.demo_orders;
create policy "Anyone insert demo orders"
  on public.demo_orders for insert
  to anon, authenticated
  with check (is_demo = true);

drop policy if exists "Anyone read demo orders" on public.demo_orders;
create policy "Anyone read demo orders"
  on public.demo_orders for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage demo orders" on public.demo_orders;
create policy "Admins manage demo orders"
  on public.demo_orders for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone insert demo order items" on public.demo_order_items;
create policy "Anyone insert demo order items"
  on public.demo_order_items for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone read demo order items" on public.demo_order_items;
create policy "Anyone read demo order items"
  on public.demo_order_items for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage demo order items" on public.demo_order_items;
create policy "Admins manage demo order items"
  on public.demo_order_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- FAQs
drop policy if exists "Public read active product faqs" on public.product_faqs;
create policy "Public read active product faqs"
  on public.product_faqs for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage product faqs" on public.product_faqs;
create policy "Admins manage product faqs"
  on public.product_faqs for all
  using (public.is_admin())
  with check (public.is_admin());

-- Stage templates
drop policy if exists "Public read stage templates" on public.project_stage_templates;
create policy "Public read stage templates"
  on public.project_stage_templates for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage stage templates" on public.project_stage_templates;
create policy "Admins manage stage templates"
  on public.project_stage_templates for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read stage template steps" on public.project_stage_template_steps;
create policy "Public read stage template steps"
  on public.project_stage_template_steps for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage stage template steps" on public.project_stage_template_steps;
create policy "Admins manage stage template steps"
  on public.project_stage_template_steps for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read product stage templates" on public.product_stage_templates;
create policy "Public read product stage templates"
  on public.product_stage_templates for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage product stage templates" on public.product_stage_templates;
create policy "Admins manage product stage templates"
  on public.product_stage_templates for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Storage buckets ───
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'project-files',
    'project-files',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/csv', 'application/zip']
  ),
  (
    'client-requirements',
    'client-requirements',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/csv', 'application/zip']
  )
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Clients read own requirement files" on storage.objects;
create policy "Clients read own requirement files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'client-requirements'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Clients upload own requirement files" on storage.objects;
create policy "Clients upload own requirement files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'client-requirements'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Admins manage requirement files" on storage.objects;
create policy "Admins manage requirement files"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'client-requirements' and public.is_admin())
  with check (bucket_id = 'client-requirements' and public.is_admin());

drop policy if exists "Clients read own project files" on storage.objects;
create policy "Clients read own project files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'project-files');

drop policy if exists "Admins manage project files storage" on storage.objects;
create policy "Admins manage project files storage"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'project-files' and public.is_admin())
  with check (bucket_id = 'project-files' and public.is_admin());
