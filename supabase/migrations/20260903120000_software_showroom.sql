-- Software Solutions Showroom — schema (separate from ecommerce demos)
-- Idempotent: safe to re-run.

-- ─── Software demo configs ───
create table if not exists public.software_demo_configs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products (id) on delete cascade,
  internal_demo_slug text not null,
  demo_title text not null,
  business_type text not null default 'general',
  demo_description text,
  package_level integer not null default 1,
  theme_config jsonb not null default '{}'::jsonb,
  feature_flags jsonb not null default '{}'::jsonb,
  workflow_config jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_software_demo_configs_slug
  on public.software_demo_configs (internal_demo_slug);
create index if not exists idx_software_demo_configs_product
  on public.software_demo_configs (product_id);

-- ─── Demo modules (sidebar nav) ───
create table if not exists public.software_demo_modules (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  module_key text not null,
  label text not null,
  icon text,
  sort_order integer not null default 0,
  route_key text not null default 'dashboard',
  permissions jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (demo_config_id, module_key)
);

create index if not exists idx_software_demo_modules_config
  on public.software_demo_modules (demo_config_id, sort_order);

-- ─── Seed sets (reference data applied on first session) ───
create table if not exists public.software_demo_seed_sets (
  id uuid primary key default gen_random_uuid(),
  business_type text not null unique,
  name text not null,
  seed_data jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Session marker (tracks initialized sessions) ───
create table if not exists public.software_demo_sessions (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  business_type text not null,
  initialized boolean not null default false,
  created_at timestamptz not null default now(),
  unique (demo_config_id, session_id)
);

create index if not exists idx_software_demo_sessions_lookup
  on public.software_demo_sessions (demo_config_id, session_id);

-- ─── Demo products (inventory items) ───
create table if not exists public.software_demo_products (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  sku text not null,
  name text not null,
  product_type text not null default 'finished',
  unit text not null default 'pcs',
  opening_qty numeric(14, 3) not null default 0,
  current_qty numeric(14, 3) not null default 0,
  unit_cost numeric(14, 2) not null default 0,
  sale_price numeric(14, 2) not null default 0,
  is_demo boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_software_demo_products_session
  on public.software_demo_products (demo_config_id, session_id);

-- ─── Parties (customers / suppliers) ───
create table if not exists public.software_demo_parties (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  party_type text not null,
  name text not null,
  phone text,
  balance numeric(14, 2) not null default 0,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_software_demo_parties_session
  on public.software_demo_parties (demo_config_id, session_id);

-- ─── Purchases ───
create table if not exists public.software_demo_purchases (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  reference_no text not null,
  supplier_id uuid references public.software_demo_parties (id) on delete set null,
  total_amount numeric(14, 2) not null default 0,
  status text not null default 'completed',
  notes text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.software_demo_purchase_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.software_demo_purchases (id) on delete cascade,
  product_id uuid not null references public.software_demo_products (id) on delete cascade,
  quantity numeric(14, 3) not null default 0,
  unit_cost numeric(14, 2) not null default 0,
  line_total numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Sales ───
create table if not exists public.software_demo_sales (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  reference_no text not null,
  customer_id uuid references public.software_demo_parties (id) on delete set null,
  total_amount numeric(14, 2) not null default 0,
  paid_amount numeric(14, 2) not null default 0,
  due_amount numeric(14, 2) not null default 0,
  status text not null default 'completed',
  notes text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.software_demo_sale_lines (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.software_demo_sales (id) on delete cascade,
  product_id uuid not null references public.software_demo_products (id) on delete cascade,
  quantity numeric(14, 3) not null default 0,
  unit_price numeric(14, 2) not null default 0,
  line_total numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Stock movements ledger ───
create table if not exists public.software_demo_stock_movements (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  product_id uuid not null references public.software_demo_products (id) on delete cascade,
  movement_type text not null,
  quantity numeric(14, 3) not null default 0,
  reference_type text,
  reference_id uuid,
  notes text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_software_demo_stock_movements_session
  on public.software_demo_stock_movements (demo_config_id, session_id);

-- ─── Payments (collection / disbursement) ───
create table if not exists public.software_demo_payments (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  party_id uuid references public.software_demo_parties (id) on delete set null,
  payment_type text not null,
  amount numeric(14, 2) not null default 0,
  reference_no text,
  notes text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Expenses ───
create table if not exists public.software_demo_expenses (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  category text not null,
  amount numeric(14, 2) not null default 0,
  notes text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── BOM ───
create table if not exists public.software_demo_boms (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  finished_product_id uuid not null references public.software_demo_products (id) on delete cascade,
  name text not null,
  batch_size numeric(14, 3) not null default 1,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.software_demo_bom_lines (
  id uuid primary key default gen_random_uuid(),
  bom_id uuid not null references public.software_demo_boms (id) on delete cascade,
  raw_product_id uuid not null references public.software_demo_products (id) on delete cascade,
  quantity_per_batch numeric(14, 3) not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Production orders ───
create table if not exists public.software_demo_production_orders (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  bom_id uuid references public.software_demo_boms (id) on delete set null,
  reference_no text not null,
  batch_count numeric(14, 3) not null default 1,
  status text not null default 'planned',
  total_cost numeric(14, 2) not null default 0,
  wastage_qty numeric(14, 3) not null default 0,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ─── Requisitions (enterprise) ───
create table if not exists public.software_demo_requisitions (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  reference_no text not null,
  department text not null,
  description text,
  amount numeric(14, 2) not null default 0,
  status text not null default 'pending',
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Sales orders (enterprise SO before delivery) ───
create table if not exists public.software_demo_sales_orders (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  reference_no text not null,
  customer_id uuid references public.software_demo_parties (id) on delete set null,
  total_amount numeric(14, 2) not null default 0,
  status text not null default 'pending',
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Activity log ───
create table if not exists public.software_demo_activity_log (
  id uuid primary key default gen_random_uuid(),
  demo_config_id uuid not null references public.software_demo_configs (id) on delete cascade,
  session_id text not null,
  action_type text not null,
  entity_type text,
  entity_id uuid,
  summary text not null,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_software_demo_activity_session
  on public.software_demo_activity_log (demo_config_id, session_id, created_at desc);

-- ─── Updated_at triggers ───
drop trigger if exists software_demo_configs_updated_at on public.software_demo_configs;
create trigger software_demo_configs_updated_at
  before update on public.software_demo_configs
  for each row execute function public.set_updated_at();

drop trigger if exists software_demo_products_updated_at on public.software_demo_products;
create trigger software_demo_products_updated_at
  before update on public.software_demo_products
  for each row execute function public.set_updated_at();

-- ─── RLS ───
alter table public.software_demo_configs enable row level security;
alter table public.software_demo_modules enable row level security;
alter table public.software_demo_seed_sets enable row level security;
alter table public.software_demo_sessions enable row level security;
alter table public.software_demo_products enable row level security;
alter table public.software_demo_parties enable row level security;
alter table public.software_demo_purchases enable row level security;
alter table public.software_demo_purchase_lines enable row level security;
alter table public.software_demo_sales enable row level security;
alter table public.software_demo_sale_lines enable row level security;
alter table public.software_demo_stock_movements enable row level security;
alter table public.software_demo_payments enable row level security;
alter table public.software_demo_expenses enable row level security;
alter table public.software_demo_boms enable row level security;
alter table public.software_demo_bom_lines enable row level security;
alter table public.software_demo_production_orders enable row level security;
alter table public.software_demo_requisitions enable row level security;
alter table public.software_demo_sales_orders enable row level security;
alter table public.software_demo_activity_log enable row level security;

-- Public read configs for published products
drop policy if exists "Public read active software demo configs" on public.software_demo_configs;
create policy "Public read active software demo configs"
  on public.software_demo_configs for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

drop policy if exists "Admins manage software demo configs" on public.software_demo_configs;
create policy "Admins manage software demo configs"
  on public.software_demo_configs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Modules & seed sets: public read when parent config is active
drop policy if exists "Public read software demo modules" on public.software_demo_modules;
create policy "Public read software demo modules"
  on public.software_demo_modules for select
  to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.software_demo_configs c
      join public.products p on p.id = c.product_id
      where c.id = demo_config_id and c.active = true and p.status = 'published'
    )
  );

drop policy if exists "Admins manage software demo modules" on public.software_demo_modules;
create policy "Admins manage software demo modules"
  on public.software_demo_modules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read software demo seed sets" on public.software_demo_seed_sets;
create policy "Public read software demo seed sets"
  on public.software_demo_seed_sets for select
  to anon, authenticated
  using (active = true);

drop policy if exists "Admins manage software demo seed sets" on public.software_demo_seed_sets;
create policy "Admins manage software demo seed sets"
  on public.software_demo_seed_sets for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Demo entity tables: server actions use service role / authenticated inserts
-- Tables WITH is_demo column
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'software_demo_products',
    'software_demo_parties',
    'software_demo_purchases',
    'software_demo_sales',
    'software_demo_stock_movements',
    'software_demo_payments',
    'software_demo_expenses',
    'software_demo_boms',
    'software_demo_production_orders',
    'software_demo_requisitions',
    'software_demo_sales_orders',
    'software_demo_activity_log'
  ]
  loop
    execute format('drop policy if exists "Anyone read software demo data" on public.%I', tbl);
    execute format(
      'create policy "Anyone read software demo data" on public.%I for select to anon, authenticated using (is_demo = true)',
      tbl
    );
    execute format('drop policy if exists "Anyone insert software demo data" on public.%I', tbl);
    execute format(
      'create policy "Anyone insert software demo data" on public.%I for insert to anon, authenticated with check (is_demo = true)',
      tbl
    );
    execute format('drop policy if exists "Anyone update software demo data" on public.%I', tbl);
    execute format(
      'create policy "Anyone update software demo data" on public.%I for update to anon, authenticated using (is_demo = true) with check (is_demo = true)',
      tbl
    );
    execute format('drop policy if exists "Admins manage software demo data" on public.%I', tbl);
    execute format(
      'create policy "Admins manage software demo data" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      tbl
    );
  end loop;
end $$;

-- Sessions (no is_demo — scoped by demo_config_id + session_id in app layer)
drop policy if exists "Anyone read software demo sessions" on public.software_demo_sessions;
create policy "Anyone read software demo sessions"
  on public.software_demo_sessions for select to anon, authenticated using (true);
drop policy if exists "Anyone insert software demo sessions" on public.software_demo_sessions;
create policy "Anyone insert software demo sessions"
  on public.software_demo_sessions for insert to anon, authenticated with check (true);
drop policy if exists "Anyone update software demo sessions" on public.software_demo_sessions;
create policy "Anyone update software demo sessions"
  on public.software_demo_sessions for update to anon, authenticated using (true) with check (true);
drop policy if exists "Admins manage software demo sessions" on public.software_demo_sessions;
create policy "Admins manage software demo sessions"
  on public.software_demo_sessions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Line-item tables (no is_demo — always demo-only child rows)
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'software_demo_purchase_lines',
    'software_demo_sale_lines',
    'software_demo_bom_lines'
  ]
  loop
    execute format('drop policy if exists "Anyone read software demo lines" on public.%I', tbl);
    execute format(
      'create policy "Anyone read software demo lines" on public.%I for select to anon, authenticated using (true)',
      tbl
    );
    execute format('drop policy if exists "Anyone insert software demo lines" on public.%I', tbl);
    execute format(
      'create policy "Anyone insert software demo lines" on public.%I for insert to anon, authenticated with check (true)',
      tbl
    );
    execute format('drop policy if exists "Anyone update software demo lines" on public.%I', tbl);
    execute format(
      'create policy "Anyone update software demo lines" on public.%I for update to anon, authenticated using (true) with check (true)',
      tbl
    );
    execute format('drop policy if exists "Admins manage software demo lines" on public.%I', tbl);
    execute format(
      'create policy "Admins manage software demo lines" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      tbl
    );
  end loop;
end $$;
