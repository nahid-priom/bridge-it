-- Bridge Smart Virtual IT Park — Supabase schema
-- Run in Supabase SQL Editor or via supabase db push

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Sellers (before profiles — profiles may reference seller_id)
-- ---------------------------------------------------------------------------
create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  slug text not null unique,
  name text not null,
  tagline text,
  avatar_url text,
  cover_image_url text,
  description text,
  location text,
  category_key text,
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  review_count int not null default 0 check (review_count >= 0),
  verified boolean not null default false,
  seller_level text not null default 'Rising Talent',
  completed_projects int not null default 0,
  response_time text,
  joined_at timestamptz not null default now(),
  is_public boolean not null default true,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sellers_slug_idx on public.sellers (slug);
create index if not exists sellers_status_idx on public.sellers (status);
create index if not exists sellers_is_public_idx on public.sellers (is_public);

create trigger sellers_set_updated_at
  before update on public.sellers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  seller_id uuid references public.sellers (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_seller_id_idx on public.profiles (seller_id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_seller_for(seller_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sellers s
    left join public.profiles p on p.id = auth.uid()
    where s.id = seller_uuid
      and (
        s.user_id = auth.uid()
        or p.seller_id = s.id
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  slug text not null unique,
  icon text not null default '📦',
  description text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_key_idx on public.categories (key);
create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_is_active_idx on public.categories (is_active);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  category_id uuid not null references public.categories (id) on delete restrict,
  seller_id uuid not null references public.sellers (id) on delete restrict,
  price numeric(12, 2) not null check (price >= 0),
  old_price numeric(12, 2) check (old_price is null or old_price >= 0),
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  reviews_count int not null default 0 check (reviews_count >= 0),
  delivery_time text not null default '3-5 days',
  image_url text not null default '',
  badge text,
  seller_level text not null default 'Rising Talent',
  is_featured boolean not null default false,
  is_promoted boolean not null default false,
  product_type text not null default 'product' check (
    product_type in ('product', 'service', 'course', 'software', 'ad', 'digital-product')
  ),
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_seller_id_idx on public.products (seller_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_is_featured_idx on public.products (is_featured);
create index if not exists products_is_promoted_idx on public.products (is_promoted);
create index if not exists products_product_type_idx on public.products (product_type);
create index if not exists products_search_vector_idx on public.products using gin (search_vector);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Product images & tags
-- ---------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

create table if not exists public.product_tags (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique (product_id, tag)
);

create index if not exists product_tags_product_id_idx on public.product_tags (product_id);
create index if not exists product_tags_tag_idx on public.product_tags (tag);

-- Full-text search (title, description, tags)
create or replace function public.products_refresh_search_vector(p_product_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tag_text text;
begin
  select coalesce(string_agg(pt.tag, ' '), '')
  into tag_text
  from public.product_tags pt
  where pt.product_id = p_product_id;

  update public.products p
  set search_vector =
    setweight(to_tsvector('english', coalesce(p.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(p.short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(p.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(tag_text, '')), 'B')
  where p.id = p_product_id;
end;
$$;

create or replace function public.products_search_vector_trigger()
returns trigger
language plpgsql
as $$
begin
  perform public.products_refresh_search_vector(
    case when tg_op = 'DELETE' then old.product_id else new.product_id end
  );
  return coalesce(new, old);
end;
$$;

create or replace function public.products_row_search_vector_trigger()
returns trigger
language plpgsql
as $$
begin
  perform public.products_refresh_search_vector(new.id);
  return new;
end;
$$;

create trigger products_refresh_search_vector
  after insert or update of title, short_description, description on public.products
  for each row execute function public.products_row_search_vector_trigger();

create trigger product_tags_search_vector
  after insert or update or delete on public.product_tags
  for each row execute function public.products_search_vector_trigger();

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  reviewer_name text not null,
  reviewer_avatar text,
  rating numeric(3, 2) not null check (rating >= 0 and rating <= 5),
  title text not null default '',
  comment text not null default '',
  verified boolean not null default false,
  helpful_count int not null default 0 check (helpful_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

-- ---------------------------------------------------------------------------
-- Orders & cart
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references public.sellers (id) on delete restrict,
  product_id uuid references public.products (id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'in-progress', 'review', 'completed', 'cancelled')
  ),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text not null default 'USD',
  delivery_date timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_buyer_id_idx on public.orders (buyer_id);
create index if not exists orders_seller_id_idx on public.orders (seller_id);
create index if not exists orders_status_idx on public.orders (status);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists cart_items_user_id_idx on public.cart_items (user_id);

create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Messaging
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references public.sellers (id) on delete cascade,
  subject text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (buyer_id, seller_id)
);

create index if not exists conversations_buyer_id_idx on public.conversations (buyer_id);
create index if not exists conversations_seller_id_idx on public.conversations (seller_id);

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'file', 'image')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_sender_id_idx on public.messages (sender_id);

-- ---------------------------------------------------------------------------
-- Notifications & audit
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null default 'info',
  title text not null,
  body text not null default '',
  read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_read_idx on public.notifications (read);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users (id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_admin_id_idx on public.admin_audit_logs (admin_id);
create index if not exists admin_audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_tags enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.cart_items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin());

-- Sellers — public read for active public sellers
create policy "sellers_select_public"
  on public.sellers for select
  using (is_public = true and status = 'active');

create policy "sellers_select_own_or_admin"
  on public.sellers for select
  using (user_id = auth.uid() or public.is_admin());

create policy "sellers_insert_own_or_admin"
  on public.sellers for insert
  with check (user_id = auth.uid() or public.is_admin());

create policy "sellers_update_own_or_admin"
  on public.sellers for update
  using (user_id = auth.uid() or public.is_admin());

create policy "sellers_delete_admin"
  on public.sellers for delete
  using (public.is_admin());

-- Categories — public read active
create policy "categories_select_active"
  on public.categories for select
  using (is_active = true);

create policy "categories_admin_all"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Products — public read active
create policy "products_select_active"
  on public.products for select
  using (status = 'active');

create policy "products_seller_manage"
  on public.products for all
  using (public.is_seller_for(seller_id))
  with check (public.is_seller_for(seller_id));

create policy "products_admin_all"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Product images & tags — follow product visibility
create policy "product_images_select_active_product"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active'
    )
  );

create policy "product_images_seller_manage"
  on public.product_images for all
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and public.is_seller_for(p.seller_id)
    )
  )
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and public.is_seller_for(p.seller_id)
    )
  );

create policy "product_images_admin_all"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "product_tags_select_active_product"
  on public.product_tags for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active'
    )
  );

create policy "product_tags_seller_manage"
  on public.product_tags for all
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and public.is_seller_for(p.seller_id)
    )
  )
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and public.is_seller_for(p.seller_id)
    )
  );

create policy "product_tags_admin_all"
  on public.product_tags for all
  using (public.is_admin())
  with check (public.is_admin());

-- Reviews — public read
create policy "reviews_select_public"
  on public.reviews for select
  using (true);

create policy "reviews_admin_all"
  on public.reviews for all
  using (public.is_admin())
  with check (public.is_admin());

-- Orders — buyer owns
create policy "orders_select_own"
  on public.orders for select
  using (buyer_id = auth.uid() or public.is_seller_for(seller_id) or public.is_admin());

create policy "orders_insert_own"
  on public.orders for insert
  with check (buyer_id = auth.uid());

create policy "orders_update_own_or_seller_or_admin"
  on public.orders for update
  using (buyer_id = auth.uid() or public.is_seller_for(seller_id) or public.is_admin());

create policy "orders_admin_delete"
  on public.orders for delete
  using (public.is_admin());

-- Cart — user owns
create policy "cart_items_select_own"
  on public.cart_items for select
  using (user_id = auth.uid());

create policy "cart_items_insert_own"
  on public.cart_items for insert
  with check (user_id = auth.uid());

create policy "cart_items_update_own"
  on public.cart_items for update
  using (user_id = auth.uid());

create policy "cart_items_delete_own"
  on public.cart_items for delete
  using (user_id = auth.uid());

-- Conversations & messages
create policy "conversations_select_participant"
  on public.conversations for select
  using (
    buyer_id = auth.uid()
    or public.is_seller_for(seller_id)
    or public.is_admin()
  );

create policy "conversations_insert_buyer"
  on public.conversations for insert
  with check (buyer_id = auth.uid());

create policy "messages_select_participant"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (
          c.buyer_id = auth.uid()
          or public.is_seller_for(c.seller_id)
          or public.is_admin()
        )
    )
  );

create policy "messages_insert_participant"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (
          c.buyer_id = auth.uid()
          or public.is_seller_for(c.seller_id)
        )
    )
  );

-- Notifications
create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  using (user_id = auth.uid());

create policy "notifications_admin_all"
  on public.notifications for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admin audit logs — admins only
create policy "admin_audit_logs_admin"
  on public.admin_audit_logs for all
  using (public.is_admin())
  with check (public.is_admin());
