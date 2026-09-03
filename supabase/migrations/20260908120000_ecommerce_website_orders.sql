-- Simple website package orders (authenticated clients)

create table if not exists public.ecommerce_website_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.ecommerce_projects (id) on delete restrict,
  package_id uuid references public.ecommerce_packages (id) on delete set null,
  project_title text not null,
  package_name text not null,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  customer_name text not null,
  phone text not null,
  business_name text,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ecommerce_website_orders_status_check check (
    status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
  )
);

create index if not exists idx_ecommerce_website_orders_user
  on public.ecommerce_website_orders (user_id, created_at desc);

create index if not exists idx_ecommerce_website_orders_status
  on public.ecommerce_website_orders (status, created_at desc);

drop trigger if exists ecommerce_website_orders_updated_at on public.ecommerce_website_orders;
create trigger ecommerce_website_orders_updated_at
  before update on public.ecommerce_website_orders
  for each row execute function public.set_updated_at();

create or replace function public.place_ecommerce_website_order(
  p_project_id uuid,
  p_package_id uuid,
  p_customer_name text,
  p_phone text,
  p_business_name text default null,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  new_id uuid;
  proj record;
  pkg record;
  clean_name text := trim(coalesce(p_customer_name, ''));
  clean_phone text := trim(coalesce(p_phone, ''));
  next_n int;
  order_no text;
begin
  if uid is null then
    raise exception 'Sign in to place an order';
  end if;
  if length(clean_name) < 2 then
    raise exception 'Name is required';
  end if;
  if clean_phone !~ '^[0-9+\-\s]{8,20}$' then
    raise exception 'A valid phone number is required';
  end if;

  select id, title, published, deleted_at
    into proj
  from public.ecommerce_projects
  where id = p_project_id;

  if proj.id is null or proj.deleted_at is not null or proj.published is not true then
    raise exception 'Website is not available to order';
  end if;

  if p_package_id is null then
    raise exception 'Select a package';
  end if;

  select id, name, price, currency, active, deleted_at, project_id
    into pkg
  from public.ecommerce_packages
  where id = p_package_id;

  if pkg.id is null or pkg.deleted_at is not null or pkg.active is not true or pkg.project_id <> p_project_id then
    raise exception 'Package is not available';
  end if;

  select coalesce(max(nullif(regexp_replace(order_number, '\D', '', 'g'), '')::int), 1000) + 1
    into next_n
  from public.ecommerce_website_orders;

  order_no := 'WEB-' || next_n::text;

  insert into public.ecommerce_website_orders (
    order_number, user_id, project_id, package_id,
    project_title, package_name, amount, currency,
    customer_name, phone, business_name, notes, status
  ) values (
    order_no,
    uid,
    p_project_id,
    p_package_id,
    proj.title,
    pkg.name,
    coalesce(pkg.price, 0),
    coalesce(pkg.currency, 'BDT'),
    clean_name,
    clean_phone,
    nullif(trim(coalesce(p_business_name, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''),
    'pending'
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.place_ecommerce_website_order(uuid, uuid, text, text, text, text)
  to authenticated;

alter table public.ecommerce_website_orders enable row level security;

drop policy if exists "Clients read own website orders" on public.ecommerce_website_orders;
create policy "Clients read own website orders"
  on public.ecommerce_website_orders for select
  using (user_id = auth.uid() or public.is_showcase_viewer());

drop policy if exists "Editors update website orders" on public.ecommerce_website_orders;
create policy "Editors update website orders"
  on public.ecommerce_website_orders for update
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());
