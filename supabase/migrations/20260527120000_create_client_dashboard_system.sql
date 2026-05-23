-- Client dashboard system (Deshi Fiverr buyer portal)
-- Idempotent: safe to re-run if types/tables/policies already exist.

-- Enums
do $$ begin
  create type public.client_project_status as enum (
    'in_progress', 'pending_review', 'completed', 'delayed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.client_milestone_status as enum (
    'pending', 'in_review', 'approved', 'paid'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.client_order_status as enum (
    'active', 'delivered', 'cancelled', 'refunded', 'pending'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.client_payment_status as enum (
    'paid', 'pending', 'failed', 'refunded'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.client_invoice_status as enum (
    'paid', 'pending', 'overdue', 'draft'
  );
exception when duplicate_object then null;
end $$;

-- Tables
create table if not exists public.client_wallets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  balance numeric(12, 2) not null default 0,
  pending_balance numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id)
);

create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid references auth.users (id) on delete set null,
  title text not null,
  description text,
  category text,
  budget numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  progress smallint not null default 0 check (progress between 0 and 100),
  status public.client_project_status not null default 'in_progress',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects (id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  progress smallint not null default 0 check (progress between 0 and 100),
  status public.client_milestone_status not null default 'pending',
  due_date date,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid references auth.users (id) on delete set null,
  project_id uuid references public.client_projects (id) on delete set null,
  order_number text not null,
  order_type text not null check (order_type in ('service', 'product')),
  title text not null,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'BDT',
  status public.client_order_status not null default 'pending',
  payment_status public.client_payment_status not null default 'pending',
  delivery_date date,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  wallet_id uuid references public.client_wallets (id) on delete set null,
  order_id uuid references public.client_orders (id) on delete set null,
  transaction_type text not null,
  label text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'BDT',
  status public.client_payment_status not null default 'pending',
  provider text,
  external_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid references auth.users (id) on delete set null,
  order_id uuid references public.client_orders (id) on delete set null,
  invoice_number text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'BDT',
  status public.client_invoice_status not null default 'pending',
  issued_at date not null default current_date,
  due_at date,
  pdf_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_notifications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  notification_type text not null,
  read_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.client_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  sender_role text not null check (sender_role in ('client', 'seller')),
  read_at timestamptz,
  attachments jsonb default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.client_support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  priority text not null default 'medium',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_client_projects_client on public.client_projects (client_id);
create index if not exists idx_client_orders_client on public.client_orders (client_id);
create index if not exists idx_client_transactions_client on public.client_transactions (client_id);
create index if not exists idx_client_invoices_client on public.client_invoices (client_id);
create index if not exists idx_client_notifications_client on public.client_notifications (client_id);
create index if not exists idx_client_messages_client on public.client_messages (client_id, seller_id);

alter table public.client_wallets enable row level security;
alter table public.client_projects enable row level security;
alter table public.client_milestones enable row level security;
alter table public.client_orders enable row level security;
alter table public.client_transactions enable row level security;
alter table public.client_invoices enable row level security;
alter table public.client_notifications enable row level security;
alter table public.client_messages enable row level security;
alter table public.client_support_tickets enable row level security;

-- Policies (drop + recreate so re-run succeeds)
drop policy if exists "Clients manage own wallet" on public.client_wallets;
create policy "Clients manage own wallet"
  on public.client_wallets for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients manage own projects" on public.client_projects;
create policy "Clients manage own projects"
  on public.client_projects for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients manage own orders" on public.client_orders;
create policy "Clients manage own orders"
  on public.client_orders for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients read own milestones" on public.client_milestones;
create policy "Clients read own milestones"
  on public.client_milestones for select
  using (
    exists (
      select 1 from public.client_projects p
      where p.id = project_id and p.client_id = auth.uid()
    )
  );

drop policy if exists "Clients manage own transactions" on public.client_transactions;
create policy "Clients manage own transactions"
  on public.client_transactions for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients manage own invoices" on public.client_invoices;
create policy "Clients manage own invoices"
  on public.client_invoices for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients manage own notifications" on public.client_notifications;
create policy "Clients manage own notifications"
  on public.client_notifications for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients manage own messages" on public.client_messages;
create policy "Clients manage own messages"
  on public.client_messages for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients manage own support tickets" on public.client_support_tickets;
create policy "Clients manage own support tickets"
  on public.client_support_tickets for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);
