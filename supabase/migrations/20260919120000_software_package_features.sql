-- Software package features (normalized) + optional screen↔package mapping
-- + consultation package context for exact-tier leads

create table if not exists public.software_package_features (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.software_packages (id) on delete cascade,
  feature_key text not null,
  label text not null,
  feature_group text not null default 'Operations',
  is_included boolean not null default true,
  is_highlighted boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists software_package_features_pkg_key_uidx
  on public.software_package_features (package_id, feature_key)
  where deleted_at is null;

create index if not exists software_package_features_package_idx
  on public.software_package_features (package_id)
  where deleted_at is null;

alter table public.software_project_screens
  add column if not exists package_id uuid references public.software_packages (id) on delete set null;

create index if not exists software_project_screens_package_idx
  on public.software_project_screens (package_id)
  where deleted_at is null and package_id is not null;

-- Consultation: exact package context (price filled server-side)
alter table public.consultation_requests
  add column if not exists software_project_id uuid,
  add column if not exists package_id uuid,
  add column if not exists package_name text,
  add column if not exists package_tier text,
  add column if not exists package_price numeric(12, 2),
  add column if not exists currency text,
  add column if not exists product_slug text,
  add column if not exists source_url text,
  add column if not exists intent text,
  add column if not exists business_location text;

-- Backfill flat jsonb features → normalized rows (Operations group)
insert into public.software_package_features (
  package_id, feature_key, label, feature_group, is_included, is_highlighted, display_order
)
select
  p.id,
  lower(regexp_replace(trim(feat), '[^a-zA-Z0-9]+', '-', 'g')),
  trim(feat),
  'Operations',
  true,
  (ord.ord <= 3),
  ord.ord
from public.software_packages p
cross join lateral jsonb_array_elements_text(
  case
    when jsonb_typeof(p.features) = 'array' then p.features
    else '[]'::jsonb
  end
) with ordinality as ord(feat, ord)
where p.deleted_at is null
  and trim(feat) <> ''
  and not exists (
    select 1
    from public.software_package_features f
    where f.package_id = p.id
      and f.deleted_at is null
      and f.feature_key = lower(regexp_replace(trim(feat), '[^a-zA-Z0-9]+', '-', 'g'))
  );
