-- Full marketplace unification: one synchronized operating system
-- Idempotent where possible. Run after existing marketplace + client migrations.

-- ─── Enums ───
do $$ begin
  create type public.marketplace_order_status as enum (
    'pending', 'paid', 'in_progress', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.marketplace_payment_status as enum (
    'pending', 'paid', 'failed', 'refunded'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.marketplace_milestone_status as enum (
    'pending', 'in_review', 'approved', 'paid', 'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.marketplace_seller_status as enum (
    'pending', 'active', 'suspended', 'inactive'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.marketplace_wallet_owner_type as enum ('buyer', 'seller', 'platform');
exception when duplicate_object then null;
end $$;

-- ─── Unify sellers: link auth users to marketplace_sellers ───
alter table public.marketplace_sellers
  add column if not exists user_id uuid unique references auth.users (id) on delete set null,
  add column if not exists legacy_seller_id uuid,
  add column if not exists status public.marketplace_seller_status not null default 'active',
  add column if not exists application_id uuid,
  add column if not exists is_public boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_marketplace_sellers_user_id on public.marketplace_sellers (user_id);
create index if not exists idx_marketplace_sellers_status on public.marketplace_sellers (status);

-- Backfill from legacy sellers table when it exists
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'sellers'
  ) then
    insert into public.marketplace_sellers (
      slug, full_name, username, title, short_bio, about, avatar_url, banner_url,
      city, rating, total_reviews, starting_price, is_verified, is_featured,
      seller_level, primary_category_slug, user_id, legacy_seller_id, status, is_public, member_since
    )
    select
      s.slug,
      s.name,
      split_part(s.slug, '-', 1),
      coalesce(s.tagline, s.name),
      left(coalesce(s.description, ''), 200),
      s.description,
      s.avatar_url,
      s.cover_image_url,
      s.location,
      coalesce(s.rating, 4.5),
      coalesce(s.review_count, 0),
      5000,
      s.verified,
      false,
      coalesce(s.seller_level, 'Level 1 Seller'),
      s.category_key,
      s.user_id,
      s.id,
      case
        when s.status = 'active' then 'active'::public.marketplace_seller_status
        when s.status = 'suspended' then 'suspended'::public.marketplace_seller_status
        else 'inactive'::public.marketplace_seller_status
      end,
      coalesce(s.is_public, true),
      coalesce(s.joined_at::date, current_date)
    from public.sellers s
    where not exists (
      select 1 from public.marketplace_sellers ms
      where ms.legacy_seller_id = s.id or (s.user_id is not null and ms.user_id = s.user_id)
    )
    on conflict (slug) do nothing;

    -- Point profiles at unified seller ids
    update public.profiles p
    set seller_id = ms.id
    from public.sellers s
    join public.marketplace_sellers ms on ms.legacy_seller_id = s.id
    where p.seller_id = s.id and p.seller_id is distinct from ms.id;
  end if;
exception when others then
  raise notice 'Seller backfill skipped: %', sqlerrm;
end $$;

-- Link products to sellers
alter table public.marketplace_products
  add column if not exists seller_id uuid references public.marketplace_sellers (id) on delete set null;

create index if not exists idx_marketplace_products_seller_id on public.marketplace_products (seller_id);

-- ─── Unified orders ───
create table if not exists public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid references public.marketplace_sellers (id) on delete set null,
  status public.marketplace_order_status not null default 'pending',
  payment_status public.marketplace_payment_status not null default 'pending',
  subtotal numeric(12, 2) not null default 0,
  platform_fee numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  delivery_date date,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.marketplace_orders (id) on delete cascade,
  item_type text not null check (item_type in ('product', 'service')),
  product_id uuid references public.marketplace_products (id) on delete set null,
  service_id uuid references public.marketplace_services (id) on delete set null,
  legacy_product_id uuid,
  title text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12, 2) not null default 0,
  total_price numeric(12, 2) not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_milestones (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.marketplace_orders (id) on delete cascade,
  title text not null,
  description text,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  progress smallint not null default 0 check (progress between 0 and 100),
  status public.marketplace_milestone_status not null default 'pending',
  due_date date,
  sort_order integer not null default 0,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_marketplace_orders_buyer on public.marketplace_orders (buyer_id);
create index if not exists idx_marketplace_orders_seller on public.marketplace_orders (seller_id);
create index if not exists idx_marketplace_orders_status on public.marketplace_orders (status);
create index if not exists idx_marketplace_order_items_order on public.marketplace_order_items (order_id);
create index if not exists idx_marketplace_milestones_order on public.marketplace_milestones (order_id);

-- ─── Wallets & transactions ───
create table if not exists public.marketplace_wallets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  owner_type public.marketplace_wallet_owner_type not null,
  seller_id uuid references public.marketplace_sellers (id) on delete set null,
  balance numeric(12, 2) not null default 0,
  pending_balance numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, owner_type)
);

create table if not exists public.marketplace_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.marketplace_wallets (id) on delete cascade,
  order_id uuid references public.marketplace_orders (id) on delete set null,
  milestone_id uuid references public.marketplace_milestones (id) on delete set null,
  transaction_type text not null,
  label text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'BDT',
  status public.marketplace_payment_status not null default 'pending',
  provider text,
  external_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_marketplace_wallets_owner on public.marketplace_wallets (owner_id, owner_type);
create index if not exists idx_marketplace_transactions_wallet on public.marketplace_transactions (wallet_id);

-- ─── Invoices & payouts ───
create table if not exists public.marketplace_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid references public.marketplace_sellers (id) on delete set null,
  order_id uuid references public.marketplace_orders (id) on delete set null,
  amount numeric(12, 2) not null,
  currency text not null default 'BDT',
  status text not null default 'pending' check (status in ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
  issued_at date not null default current_date,
  due_at date,
  pdf_url text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_payouts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.marketplace_sellers (id) on delete cascade,
  amount numeric(12, 2) not null,
  currency text not null default 'BDT',
  status text not null default 'pending' check (status in ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  payout_method text,
  external_reference text,
  processed_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_marketplace_invoices_buyer on public.marketplace_invoices (buyer_id);
create index if not exists idx_marketplace_payouts_seller on public.marketplace_payouts (seller_id);

-- ─── Messaging (realtime-ready) ───
create table if not exists public.marketplace_conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references public.marketplace_sellers (id) on delete cascade,
  order_id uuid references public.marketplace_orders (id) on delete set null,
  subject text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (buyer_id, seller_id, order_id)
);

create table if not exists public.marketplace_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.marketplace_conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  sender_role text not null check (sender_role in ('buyer', 'seller', 'admin', 'support')),
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'file', 'image', 'system')),
  read_at timestamptz,
  attachments jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists idx_marketplace_conversations_buyer on public.marketplace_conversations (buyer_id);
create index if not exists idx_marketplace_conversations_seller on public.marketplace_conversations (seller_id);
create index if not exists idx_marketplace_messages_conversation on public.marketplace_messages (conversation_id, created_at desc);

-- ─── Notifications (centralized) ───
create table if not exists public.marketplace_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  notification_type text not null,
  read_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_marketplace_notifications_user on public.marketplace_notifications (user_id, created_at desc);

-- ─── Analytics snapshots (dashboard sync) ───
create table if not exists public.marketplace_analytics_daily (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null unique,
  gmv numeric(14, 2) not null default 0,
  order_count integer not null default 0,
  active_sellers integer not null default 0,
  active_buyers integer not null default 0,
  revenue numeric(14, 2) not null default 0,
  top_categories jsonb not null default '[]',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── Helper: order number generator ───
create or replace function public.marketplace_generate_order_number()
returns text
language plpgsql
as $$
declare
  seq int;
begin
  select count(*) + 1 into seq from public.marketplace_orders;
  return 'DF-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq::text, 5, '0');
end;
$$;

-- ─── Migrate legacy orders when present ───
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'orders'
  ) then
    insert into public.marketplace_orders (
      order_number, buyer_id, seller_id, status, payment_status,
      subtotal, total_amount, currency, metadata, created_at, updated_at
    )
    select
      'LEG-' || left(o.id::text, 8),
      o.buyer_id,
      ms.id,
      case o.status
        when 'pending' then 'pending'::public.marketplace_order_status
        when 'in-progress' then 'in_progress'::public.marketplace_order_status
        when 'review' then 'in_progress'::public.marketplace_order_status
        when 'completed' then 'completed'::public.marketplace_order_status
        when 'cancelled' then 'cancelled'::public.marketplace_order_status
        else 'pending'::public.marketplace_order_status
      end,
      case
        when o.status = 'completed' then 'paid'::public.marketplace_payment_status
        else 'pending'::public.marketplace_payment_status
      end,
      o.total_amount,
      o.total_amount,
      coalesce(o.currency, 'BDT'),
      coalesce(o.metadata, '{}'),
      o.created_at,
      o.updated_at
    from public.orders o
    left join public.marketplace_sellers ms on ms.legacy_seller_id = o.seller_id
    where not exists (
      select 1 from public.marketplace_orders mo
      where mo.metadata->>'legacy_order_id' = o.id::text
    );
  end if;
exception when others then
  raise notice 'Order backfill skipped: %', sqlerrm;
end $$;

-- ─── RLS ───
alter table public.marketplace_orders enable row level security;
alter table public.marketplace_order_items enable row level security;
alter table public.marketplace_milestones enable row level security;
alter table public.marketplace_wallets enable row level security;
alter table public.marketplace_transactions enable row level security;
alter table public.marketplace_invoices enable row level security;
alter table public.marketplace_payouts enable row level security;
alter table public.marketplace_conversations enable row level security;
alter table public.marketplace_messages enable row level security;
alter table public.marketplace_notifications enable row level security;
alter table public.marketplace_analytics_daily enable row level security;

-- Buyers read own orders
drop policy if exists "Buyers read own marketplace orders" on public.marketplace_orders;
create policy "Buyers read own marketplace orders"
  on public.marketplace_orders for select
  using (auth.uid() = buyer_id);

drop policy if exists "Buyers insert own marketplace orders" on public.marketplace_orders;
create policy "Buyers insert own marketplace orders"
  on public.marketplace_orders for insert
  with check (auth.uid() = buyer_id);

-- Sellers read orders for their shop
drop policy if exists "Sellers read their marketplace orders" on public.marketplace_orders;
create policy "Sellers read their marketplace orders"
  on public.marketplace_orders for select
  using (
    exists (
      select 1 from public.marketplace_sellers ms
      where ms.id = seller_id and ms.user_id = auth.uid()
    )
  );

-- Order items follow order access
drop policy if exists "Order participants read items" on public.marketplace_order_items;
create policy "Order participants read items"
  on public.marketplace_order_items for select
  using (
    exists (
      select 1 from public.marketplace_orders o
      where o.id = order_id
        and (
          o.buyer_id = auth.uid()
          or exists (
            select 1 from public.marketplace_sellers ms
            where ms.id = o.seller_id and ms.user_id = auth.uid()
          )
        )
    )
  );

-- Milestones
drop policy if exists "Order participants read milestones" on public.marketplace_milestones;
create policy "Order participants read milestones"
  on public.marketplace_milestones for select
  using (
    exists (
      select 1 from public.marketplace_orders o
      where o.id = order_id
        and (
          o.buyer_id = auth.uid()
          or exists (
            select 1 from public.marketplace_sellers ms
            where ms.id = o.seller_id and ms.user_id = auth.uid()
          )
        )
    )
  );

-- Wallets
drop policy if exists "Users manage own wallets" on public.marketplace_wallets;
create policy "Users manage own wallets"
  on public.marketplace_wallets for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users read own transactions" on public.marketplace_transactions;
create policy "Users read own transactions"
  on public.marketplace_transactions for select
  using (
    exists (
      select 1 from public.marketplace_wallets w
      where w.id = wallet_id and w.owner_id = auth.uid()
    )
  );

-- Invoices
drop policy if exists "Buyers read own invoices" on public.marketplace_invoices;
create policy "Buyers read own invoices"
  on public.marketplace_invoices for select
  using (auth.uid() = buyer_id);

-- Conversations & messages
drop policy if exists "Participants read conversations" on public.marketplace_conversations;
create policy "Participants read conversations"
  on public.marketplace_conversations for select
  using (
    auth.uid() = buyer_id
    or exists (
      select 1 from public.marketplace_sellers ms
      where ms.id = seller_id and ms.user_id = auth.uid()
    )
  );

drop policy if exists "Participants manage conversations" on public.marketplace_conversations;
create policy "Participants manage conversations"
  on public.marketplace_conversations for all
  using (
    auth.uid() = buyer_id
    or exists (
      select 1 from public.marketplace_sellers ms
      where ms.id = seller_id and ms.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = buyer_id
    or exists (
      select 1 from public.marketplace_sellers ms
      where ms.id = seller_id and ms.user_id = auth.uid()
    )
  );

drop policy if exists "Participants read messages" on public.marketplace_messages;
create policy "Participants read messages"
  on public.marketplace_messages for select
  using (
    exists (
      select 1 from public.marketplace_conversations c
      where c.id = conversation_id
        and (
          c.buyer_id = auth.uid()
          or exists (
            select 1 from public.marketplace_sellers ms
            where ms.id = c.seller_id and ms.user_id = auth.uid()
          )
        )
    )
  );

drop policy if exists "Participants send messages" on public.marketplace_messages;
create policy "Participants send messages"
  on public.marketplace_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.marketplace_conversations c
      where c.id = conversation_id
        and (
          c.buyer_id = auth.uid()
          or exists (
            select 1 from public.marketplace_sellers ms
            where ms.id = c.seller_id and ms.user_id = auth.uid()
          )
        )
    )
  );

-- Notifications
drop policy if exists "Users manage own marketplace notifications" on public.marketplace_notifications;
create policy "Users manage own marketplace notifications"
  on public.marketplace_notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Analytics: public read for admins via service role; authenticated read aggregate
drop policy if exists "Authenticated read analytics" on public.marketplace_analytics_daily;
create policy "Authenticated read analytics"
  on public.marketplace_analytics_daily for select
  to authenticated
  using (true);

-- Sellers update own profile fields
drop policy if exists "Sellers update own marketplace profile" on public.marketplace_sellers;
create policy "Sellers update own marketplace profile"
  on public.marketplace_sellers for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Realtime publication (Supabase)
do $$
begin
  alter publication supabase_realtime add table public.marketplace_messages;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.marketplace_notifications;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.marketplace_orders;
exception when others then null;
end $$;

comment on table public.marketplace_orders is 'Unified marketplace order engine — products, services, milestones';
comment on table public.marketplace_sellers is 'Single seller system — auth-linked public profiles';
comment on table public.marketplace_wallets is 'Buyer and seller wallets with pending balances';
comment on table public.marketplace_conversations is 'Buyer-seller messaging threads (realtime-ready)';
