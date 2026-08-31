-- Bridge IT Park — core schema (single-provider digital solutions platform)
-- Idempotent: safe to re-run. Does NOT drop or alter marketplace_* / client_* tables.

-- ─── Extensions ───
create extension if not exists "pgcrypto";

-- ─── Profiles (create or extend) ───
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text not null default 'client',
  status text not null default 'active',
  seller_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists seller_id uuid;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Map legacy buyer role to client (preserve seller/admin for marketplace compatibility)
update public.profiles
set role = 'client'
where role = 'buyer';

-- ─── Helper functions ───
create or replace function public.is_admin()
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
      and role in ('admin', 'super_admin')
  );
$$;

create sequence if not exists public.bitp_order_number_seq start 10001;

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  next_num bigint;
begin
  next_num := nextval('public.bitp_order_number_seq');
  return 'BITP-' || lpad(next_num::text, 5, '0');
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'phone',
    coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'client')
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Categories ───
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_active_sort on public.categories (is_active, sort_order);

-- ─── Products ───
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  thumbnail text,
  cover_image text,
  product_type text not null default 'service',
  pricing_type text not null default 'starting_from',
  starting_price numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  delivery_time text,
  status text not null default 'draft',
  featured boolean not null default false,
  popular boolean not null default false,
  sort_order integer not null default 0,
  demo_url text,
  preview_url text,
  seo_title text,
  seo_description text,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_status_check check (status in ('draft', 'published', 'archived')),
  constraint products_pricing_type_check check (
    pricing_type in ('fixed', 'starting_from', 'package', 'custom_quote', 'subscription')
  )
);

create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_featured on public.products (featured) where featured = true;
create index if not exists idx_products_popular on public.products (popular) where popular = true;
create index if not exists idx_products_keywords_gin on public.products using gin (keywords);

-- ─── Product packages ───
create table if not exists public.product_packages (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  subtitle text,
  price numeric(12, 2) not null default 0,
  old_price numeric(12, 2),
  currency text not null default 'BDT',
  billing_type text not null default 'one_time',
  delivery_days integer,
  revision_count integer,
  highlighted boolean not null default false,
  badge_text text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, name)
);

create index if not exists idx_product_packages_product_id on public.product_packages (product_id);
create index if not exists idx_product_packages_active on public.product_packages (product_id, active, sort_order);

-- ─── Package features ───
create table if not exists public.package_features (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.product_packages (id) on delete cascade,
  feature_text text not null,
  included boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (package_id, sort_order)
);

create index if not exists idx_package_features_package_id on public.package_features (package_id);

-- ─── Product requirement fields ───
create table if not exists public.product_requirement_fields (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null,
  field_key text not null,
  field_type text not null default 'text',
  placeholder text,
  help_text text,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, field_key)
);

create index if not exists idx_product_requirement_fields_product_id
  on public.product_requirement_fields (product_id, active, sort_order);

-- ─── Orders ───
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  client_id uuid not null references auth.users (id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  package_id uuid references public.product_packages (id) on delete set null,
  quotation_id uuid,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  payment_status text not null default 'pending',
  order_status text not null default 'pending',
  source text not null default 'website',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_payment_status_check check (
    payment_status in ('pending', 'partial', 'paid', 'refunded', 'failed')
  ),
  constraint orders_order_status_check check (
    order_status in (
      'pending', 'requirements_submitted', 'confirmed', 'in_progress',
      'waiting_client', 'completed', 'cancelled'
    )
  )
);

create index if not exists idx_orders_client_id on public.orders (client_id);
create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_status on public.orders (order_status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- ─── Order items ───
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  package_id uuid references public.product_packages (id) on delete set null,
  title text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

-- ─── Order requirements ───
create table if not exists public.order_requirements (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  field_id uuid references public.product_requirement_fields (id) on delete set null,
  field_key text not null,
  label text not null,
  value text,
  value_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_requirements_order_id on public.order_requirements (order_id);

-- ─── Order status history ───
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  notes text,
  changed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_status_history_order_id
  on public.order_status_history (order_id, created_at desc);

-- ─── Projects ───
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  client_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending',
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  start_date date,
  expected_delivery_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (
    status in ('pending', 'in_progress', 'on_hold', 'completed', 'cancelled')
  )
);

create index if not exists idx_projects_client_id on public.projects (client_id);
create index if not exists idx_projects_order_id on public.projects (order_id);

-- ─── Project stages ───
create table if not exists public.project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending',
  sort_order integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_stages_status_check check (
    status in ('pending', 'in_progress', 'completed', 'skipped')
  )
);

create index if not exists idx_project_stages_project_id
  on public.project_stages (project_id, sort_order);

-- ─── Quotations ───
create sequence if not exists public.bitp_quotation_number_seq start 1001;

create or replace function public.generate_quotation_number()
returns text
language plpgsql
as $$
declare
  next_num bigint;
begin
  next_num := nextval('public.bitp_quotation_number_seq');
  return 'QUOTE-' || lpad(next_num::text, 5, '0');
end;
$$;

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text not null unique default public.generate_quotation_number(),
  client_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  title text not null,
  description text,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  status text not null default 'draft',
  valid_until date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quotations_status_check check (
    status in ('draft', 'sent', 'accepted', 'rejected', 'expired')
  )
);

create index if not exists idx_quotations_client_id on public.quotations (client_id);
create index if not exists idx_quotations_status on public.quotations (status);

-- FK from orders to quotations (added after quotations table exists)
do $$ begin
  alter table public.orders
    add constraint orders_quotation_id_fkey
    foreign key (quotation_id) references public.quotations (id) on delete set null;
exception when duplicate_object then null;
end $$;

-- ─── Quotation items ───
create table if not exists public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_quotation_items_quotation_id on public.quotation_items (quotation_id);

-- ─── Payments ───
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  quotation_id uuid references public.quotations (id) on delete set null,
  client_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  payment_method text,
  transaction_reference text,
  payment_status text not null default 'pending',
  proof_url text,
  notes text,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references auth.users (id) on delete set null,
  constraint payments_status_check check (
    payment_status in ('pending', 'verified', 'rejected', 'refunded')
  )
);

create index if not exists idx_payments_client_id on public.payments (client_id);
create index if not exists idx_payments_order_id on public.payments (order_id);
create index if not exists idx_payments_status on public.payments (payment_status);

-- ─── Conversation threads ───
create table if not exists public.conversation_threads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  quotation_id uuid references public.quotations (id) on delete set null,
  subject text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_conversation_threads_client_id on public.conversation_threads (client_id);
create index if not exists idx_conversation_threads_last_message_at
  on public.conversation_threads (last_message_at desc);

-- ─── Messages ───
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.conversation_threads (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  sender_role text not null check (sender_role in ('client', 'admin', 'system')),
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'file', 'image', 'system')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_thread_id on public.messages (thread_id, created_at);

-- ─── Project files ───
create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  uploaded_by uuid references auth.users (id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  visibility text not null default 'both' check (visibility in ('client', 'admin', 'both')),
  created_at timestamptz not null default now()
);

create index if not exists idx_project_files_project_id on public.project_files (project_id);

-- ─── Portfolio items ───
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  client_name text,
  description text,
  thumbnail text,
  cover_image text,
  project_url text,
  case_study text,
  featured boolean not null default false,
  status text not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_items_status_check check (status in ('draft', 'published', 'archived'))
);

create index if not exists idx_portfolio_items_slug on public.portfolio_items (slug);
create index if not exists idx_portfolio_items_featured on public.portfolio_items (featured) where featured = true;

-- ─── Reviews ───
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  client_name text not null,
  company_name text,
  designation text,
  avatar_url text,
  rating smallint not null check (rating between 1 and 5),
  review text not null,
  featured boolean not null default false,
  approved boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reviews_approved on public.reviews (approved, sort_order);
create index if not exists idx_reviews_product_id on public.reviews (product_id);

-- ─── Site settings ───
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_site_settings_public on public.site_settings (is_public) where is_public = true;

-- ─── Consultation requests ───
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  business_name text,
  service_interested_in text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint consultation_requests_status_check check (
    status in ('new', 'contacted', 'qualified', 'converted', 'closed')
  )
);

create index if not exists idx_consultation_requests_status on public.consultation_requests (status);

-- ─── Notifications ───
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  message text,
  type text not null default 'info',
  reference_type text,
  reference_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on public.notifications (user_id, is_read, created_at desc);

-- ─── updated_at triggers ───
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'profiles', 'categories', 'products', 'product_packages',
    'product_requirement_fields', 'orders', 'projects', 'project_stages',
    'quotations', 'conversation_threads', 'portfolio_items', 'reviews',
    'site_settings', 'consultation_requests'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', tbl, tbl);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      tbl, tbl
    );
  end loop;
end $$;

-- ─── Row Level Security ───
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_packages enable row level security;
alter table public.package_features enable row level security;
alter table public.product_requirement_fields enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_requirements enable row level security;
alter table public.order_status_history enable row level security;
alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.payments enable row level security;
alter table public.conversation_threads enable row level security;
alter table public.messages enable row level security;
alter table public.project_files enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.notifications enable row level security;

-- Profiles
drop policy if exists "Public profiles are not exposed" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Categories (public read active)
drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories"
  on public.categories for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Products (public read published)
drop policy if exists "Public read published products" on public.products;
create policy "Public read published products"
  on public.products for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Product packages (public read active on published products)
drop policy if exists "Public read active packages" on public.product_packages;
create policy "Public read active packages"
  on public.product_packages for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage packages" on public.product_packages;
create policy "Admins manage packages"
  on public.product_packages for all
  using (public.is_admin())
  with check (public.is_admin());

-- Package features
drop policy if exists "Public read package features" on public.package_features;
create policy "Public read package features"
  on public.package_features for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.product_packages pp
      join public.products p on p.id = pp.product_id
      where pp.id = package_id and pp.active = true and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage package features" on public.package_features;
create policy "Admins manage package features"
  on public.package_features for all
  using (public.is_admin())
  with check (public.is_admin());

-- Product requirement fields
drop policy if exists "Public read active requirement fields" on public.product_requirement_fields;
create policy "Public read active requirement fields"
  on public.product_requirement_fields for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage requirement fields" on public.product_requirement_fields;
create policy "Admins manage requirement fields"
  on public.product_requirement_fields for all
  using (public.is_admin())
  with check (public.is_admin());

-- Orders
drop policy if exists "Clients read own orders" on public.orders;
create policy "Clients read own orders"
  on public.orders for select
  using (auth.uid() = client_id or public.is_admin());

drop policy if exists "Clients create own orders" on public.orders;
create policy "Clients create own orders"
  on public.orders for insert
  with check (auth.uid() = client_id);

drop policy if exists "Clients update own pending orders" on public.orders;
create policy "Clients update own pending orders"
  on public.orders for update
  using (auth.uid() = client_id and order_status in ('pending', 'requirements_submitted'))
  with check (auth.uid() = client_id);

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- Order items
drop policy if exists "Clients read own order items" on public.order_items;
create policy "Clients read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Clients insert own order items" on public.order_items;
create policy "Clients insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.client_id = auth.uid()
    )
  );

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items"
  on public.order_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- Order requirements
drop policy if exists "Clients manage own order requirements" on public.order_requirements;
create policy "Clients manage own order requirements"
  on public.order_requirements for all
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.client_id = auth.uid()
    )
    or public.is_admin()
  )
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.client_id = auth.uid()
    )
    or public.is_admin()
  );

-- Order status history
drop policy if exists "Clients read own order status history" on public.order_status_history;
create policy "Clients read own order status history"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage order status history" on public.order_status_history;
create policy "Admins manage order status history"
  on public.order_status_history for all
  using (public.is_admin())
  with check (public.is_admin());

-- Projects
drop policy if exists "Clients read own projects" on public.projects;
create policy "Clients read own projects"
  on public.projects for select
  using (auth.uid() = client_id or public.is_admin());

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
  on public.projects for all
  using (public.is_admin())
  with check (public.is_admin());

-- Project stages
drop policy if exists "Clients read own project stages" on public.project_stages;
create policy "Clients read own project stages"
  on public.project_stages for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage project stages" on public.project_stages;
create policy "Admins manage project stages"
  on public.project_stages for all
  using (public.is_admin())
  with check (public.is_admin());

-- Quotations
drop policy if exists "Clients read own quotations" on public.quotations;
create policy "Clients read own quotations"
  on public.quotations for select
  using (auth.uid() = client_id or public.is_admin());

drop policy if exists "Clients update own sent quotations" on public.quotations;
create policy "Clients update own sent quotations"
  on public.quotations for update
  using (auth.uid() = client_id and status in ('sent', 'accepted', 'rejected'))
  with check (auth.uid() = client_id);

drop policy if exists "Admins manage quotations" on public.quotations;
create policy "Admins manage quotations"
  on public.quotations for all
  using (public.is_admin())
  with check (public.is_admin());

-- Quotation items
drop policy if exists "Clients read own quotation items" on public.quotation_items;
create policy "Clients read own quotation items"
  on public.quotation_items for select
  using (
    exists (
      select 1 from public.quotations q
      where q.id = quotation_id and q.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage quotation items" on public.quotation_items;
create policy "Admins manage quotation items"
  on public.quotation_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- Payments
drop policy if exists "Clients read own payments" on public.payments;
create policy "Clients read own payments"
  on public.payments for select
  using (auth.uid() = client_id or public.is_admin());

drop policy if exists "Clients submit own payments" on public.payments;
create policy "Clients submit own payments"
  on public.payments for insert
  with check (auth.uid() = client_id);

drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());

-- Conversation threads
drop policy if exists "Clients manage own threads" on public.conversation_threads;
create policy "Clients manage own threads"
  on public.conversation_threads for all
  using (auth.uid() = client_id or public.is_admin())
  with check (auth.uid() = client_id or public.is_admin());

-- Messages
drop policy if exists "Participants read thread messages" on public.messages;
create policy "Participants read thread messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversation_threads t
      where t.id = thread_id and t.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Participants send thread messages" on public.messages;
create policy "Participants send thread messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and (
      exists (
        select 1 from public.conversation_threads t
        where t.id = thread_id and t.client_id = auth.uid()
      )
      or public.is_admin()
    )
  );

drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages"
  on public.messages for all
  using (public.is_admin())
  with check (public.is_admin());

-- Project files
drop policy if exists "Clients read permitted project files" on public.project_files;
create policy "Clients read permitted project files"
  on public.project_files for select
  using (
    visibility in ('client', 'both')
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Admins manage project files" on public.project_files;
create policy "Admins manage project files"
  on public.project_files for all
  using (public.is_admin())
  with check (public.is_admin());

-- Portfolio
drop policy if exists "Public read published portfolio" on public.portfolio_items;
create policy "Public read published portfolio"
  on public.portfolio_items for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage portfolio" on public.portfolio_items;
create policy "Admins manage portfolio"
  on public.portfolio_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- Reviews
drop policy if exists "Public read approved reviews" on public.reviews;
create policy "Public read approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (approved = true or public.is_admin());

drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews"
  on public.reviews for all
  using (public.is_admin())
  with check (public.is_admin());

-- Site settings
drop policy if exists "Public read public site settings" on public.site_settings;
create policy "Public read public site settings"
  on public.site_settings for select
  to anon, authenticated
  using (is_public = true or public.is_admin());

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Consultation requests (public insert, admin read/manage)
drop policy if exists "Anyone can submit consultation request" on public.consultation_requests;
create policy "Anyone can submit consultation request"
  on public.consultation_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins manage consultation requests" on public.consultation_requests;
create policy "Admins manage consultation requests"
  on public.consultation_requests for all
  using (public.is_admin())
  with check (public.is_admin());

-- Notifications
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications"
  on public.notifications for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Storage bucket policy notes (apply in Supabase Dashboard or storage migration) ───
-- Bucket: product-media
--   SELECT: public read for published product media paths
--   INSERT/UPDATE/DELETE: is_admin() only
--
-- Bucket: portfolio
--   SELECT: public read for published portfolio assets
--   INSERT/UPDATE/DELETE: is_admin() only
--
-- Bucket: payment-proofs
--   SELECT: client reads own proofs (path prefix auth.uid()); admin reads all
--   INSERT: authenticated client uploads to own folder auth.uid()/...
--   UPDATE/DELETE: admin only
--
-- Bucket: project-files
--   SELECT: client reads files for own projects (via project_files metadata + signed URLs)
--   INSERT/UPDATE/DELETE: is_admin() (admin uploads deliverables)

comment on function public.is_admin() is 'Returns true when current user has admin or super_admin role';
comment on function public.generate_order_number() is 'Generates sequential BITP-##### order numbers';
comment on table public.products is 'Bridge IT Park digital solutions catalog';
comment on table public.orders is 'Client service orders with BITP order numbering';
