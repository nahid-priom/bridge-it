-- Seller onboarding applications (required by final_marketplace_sync)

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  business_name text not null,
  display_name text not null,
  category_focus text not null,
  services_offered text[] not null default '{}',
  portfolio_url text,
  social_links jsonb not null default '{}',
  phone text not null,
  location text not null,
  bio text not null,
  experience_level text not null,
  ad_interest boolean not null default false,
  ad_budget_range text,
  status text not null default 'pending',
  admin_note text,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.seller_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.seller_applications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  document_type text not null,
  file_url text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists idx_seller_applications_user_id
  on public.seller_applications (user_id);

create index if not exists idx_seller_documents_application_id
  on public.seller_documents (application_id);
