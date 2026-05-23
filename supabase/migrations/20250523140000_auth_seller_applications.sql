-- Auth: super admin + seller registration tables
-- Safe to re-run (idempotent). Create Auth user first, then run this migration.

-- Super admin promotion
update public.profiles
set role = 'admin', updated_at = now()
where email = 'codebondhuit@gmail.com';

create or replace function public.promote_user_to_admin(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set role = 'admin', updated_at = now()
  where lower(email) = lower(target_email);
end;
$$;

revoke all on function public.promote_user_to_admin(text) from public;
grant execute on function public.promote_user_to_admin(text) to service_role;

-- Seller applications
create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  business_name text not null,
  display_name text not null,
  category_focus text not null,
  services_offered text[] not null default '{}',
  portfolio_url text,
  social_links jsonb not null default '{}'::jsonb,
  phone text not null,
  location text not null,
  bio text not null,
  experience_level text not null,
  ad_interest boolean not null default false,
  ad_budget_range text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'needs_review')
  ),
  admin_note text,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists seller_applications_user_id_idx on public.seller_applications (user_id);
create index if not exists seller_applications_status_idx on public.seller_applications (status);

drop trigger if exists seller_applications_set_updated_at on public.seller_applications;
create trigger seller_applications_set_updated_at
  before update on public.seller_applications
  for each row execute function public.set_updated_at();

create table if not exists public.seller_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.seller_applications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  document_type text not null,
  file_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists seller_documents_application_id_idx on public.seller_documents (application_id);

create table if not exists public.seller_ad_preferences (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.seller_applications (id) on delete cascade,
  category_key text not null,
  promotion_type text not null default 'featured',
  budget_range text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.seller_applications enable row level security;
alter table public.seller_documents enable row level security;
alter table public.seller_ad_preferences enable row level security;

-- RLS policies (drop + recreate so re-run is safe)
drop policy if exists "seller_applications_select_own_or_admin" on public.seller_applications;
drop policy if exists "seller_applications_insert_own" on public.seller_applications;
drop policy if exists "seller_applications_update_own_pending" on public.seller_applications;
drop policy if exists "seller_applications_admin_all" on public.seller_applications;

create policy "seller_applications_select_own_or_admin"
  on public.seller_applications for select
  using (user_id = auth.uid() or public.is_admin());

create policy "seller_applications_insert_own"
  on public.seller_applications for insert
  with check (user_id = auth.uid());

create policy "seller_applications_update_own_pending"
  on public.seller_applications for update
  using (
    user_id = auth.uid()
    and status in ('pending', 'needs_review')
  )
  with check (user_id = auth.uid());

create policy "seller_applications_admin_all"
  on public.seller_applications for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "seller_documents_select_own_or_admin" on public.seller_documents;
drop policy if exists "seller_documents_insert_own" on public.seller_documents;
drop policy if exists "seller_documents_admin_all" on public.seller_documents;

create policy "seller_documents_select_own_or_admin"
  on public.seller_documents for select
  using (user_id = auth.uid() or public.is_admin());

create policy "seller_documents_insert_own"
  on public.seller_documents for insert
  with check (user_id = auth.uid());

create policy "seller_documents_admin_all"
  on public.seller_documents for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "seller_ad_prefs_select_own_or_admin" on public.seller_ad_preferences;
drop policy if exists "seller_ad_prefs_insert_own" on public.seller_ad_preferences;
drop policy if exists "seller_ad_prefs_admin_all" on public.seller_ad_preferences;

create policy "seller_ad_prefs_select_own_or_admin"
  on public.seller_ad_preferences for select
  using (
    exists (
      select 1 from public.seller_applications a
      where a.id = application_id and (a.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "seller_ad_prefs_insert_own"
  on public.seller_ad_preferences for insert
  with check (
    exists (
      select 1 from public.seller_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

create policy "seller_ad_prefs_admin_all"
  on public.seller_ad_preferences for all
  using (public.is_admin())
  with check (public.is_admin());

-- Storage bucket (private seller documents)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'seller-documents',
  'seller-documents',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

drop policy if exists "seller_docs_storage_insert_own" on storage.objects;
drop policy if exists "seller_docs_storage_select_own_or_admin" on storage.objects;
drop policy if exists "seller_docs_storage_delete_own" on storage.objects;

create policy "seller_docs_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'seller-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "seller_docs_storage_select_own_or_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'seller-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "seller_docs_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'seller-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
