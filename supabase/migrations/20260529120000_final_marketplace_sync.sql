-- Final marketplace sync: unify seller activation, wallets, and orphan repair
-- Source of truth: profiles.role + marketplace_sellers.status

-- ─── Repoint profiles.seller_id FK: sellers → marketplace_sellers ───
alter table public.profiles drop constraint if exists profiles_seller_id_fkey;

-- Map legacy sellers.id → marketplace_sellers.id before new FK
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'sellers'
  ) then
    update public.profiles p
    set seller_id = ms.id
    from public.sellers s
    join public.marketplace_sellers ms on ms.legacy_seller_id = s.id
    where p.seller_id = s.id
      and p.seller_id is distinct from ms.id;
  end if;
end $$;

-- Clear orphan seller_id values (not in marketplace_sellers)
update public.profiles p
set seller_id = null
where p.seller_id is not null
  and not exists (
    select 1 from public.marketplace_sellers ms where ms.id = p.seller_id
  );

alter table public.profiles
  add constraint profiles_seller_id_fkey
  foreign key (seller_id) references public.marketplace_sellers (id) on delete set null;

-- Approved applications → seller role + active marketplace_seller
update public.profiles p
set role = 'seller'
from public.seller_applications sa
where sa.user_id = p.id
  and sa.status = 'approved'
  and p.role is distinct from 'seller'
  and p.role is distinct from 'admin';

update public.marketplace_sellers ms
set status = 'active'::public.marketplace_seller_status,
    updated_at = now()
from public.seller_applications sa
where sa.user_id = ms.user_id
  and sa.status = 'approved'
  and ms.status is distinct from 'active';

-- Link profiles.seller_id to marketplace_sellers (safe after FK repoint)
update public.profiles p
set seller_id = ms.id
from public.marketplace_sellers ms
where ms.user_id = p.id
  and p.role = 'seller'
  and (p.seller_id is null or p.seller_id is distinct from ms.id);

-- Pending applications → pending seller row when missing
insert into public.marketplace_sellers (
  user_id, slug, full_name, username, title, status, is_public, application_id
)
select
  sa.user_id,
  'pending-' || left(sa.user_id::text, 8),
  sa.display_name,
  left(sa.display_name, 12),
  coalesce(sa.business_name, sa.display_name),
  'pending'::public.marketplace_seller_status,
  false,
  sa.id
from public.seller_applications sa
where sa.status in ('pending', 'needs_review')
  and not exists (
    select 1 from public.marketplace_sellers ms where ms.user_id = sa.user_id
  )
on conflict (user_id) do nothing;

-- Buyer wallets for all buyers/sellers
insert into public.marketplace_wallets (owner_id, owner_type)
select p.id, 'buyer'::public.marketplace_wallet_owner_type
from public.profiles p
where p.role in ('buyer', 'seller')
  and not exists (
    select 1 from public.marketplace_wallets w
    where w.owner_id = p.id and w.owner_type = 'buyer'
  );

-- Seller wallets
insert into public.marketplace_wallets (owner_id, owner_type, seller_id)
select ms.user_id, 'seller'::public.marketplace_wallet_owner_type, ms.id
from public.marketplace_sellers ms
where ms.user_id is not null
  and ms.status = 'active'
  and not exists (
    select 1 from public.marketplace_wallets w
    where w.owner_id = ms.user_id and w.owner_type = 'seller'
  );

create index if not exists idx_seller_applications_user_status
  on public.seller_applications (user_id, status);

create index if not exists idx_marketplace_orders_buyer_type
  on public.marketplace_orders (buyer_id, ((metadata->>'order_type')));

comment on column public.marketplace_sellers.status is 'Activation truth with profiles.role for seller dashboard access';
