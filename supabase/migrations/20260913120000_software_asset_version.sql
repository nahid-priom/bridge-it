-- Canonical software showcase asset versioning + indexes
-- Adapts existing software_projects / software_project_screens (no duplicate product system)

alter table public.software_projects
  add column if not exists asset_version integer not null default 1;

comment on column public.software_projects.asset_version is
  'Bumps when canonical cover/screens change; used for cache-busting storage paths.';

create index if not exists idx_software_projects_published_category
  on public.software_projects (published, category_id, sort_order)
  where deleted_at is null;

create index if not exists idx_software_projects_taxonomy
  on public.software_projects (taxonomy_category_id, published, sort_order)
  where deleted_at is null;

create index if not exists idx_software_projects_child_category
  on public.software_projects (child_category_id, published, sort_order)
  where deleted_at is null;

create index if not exists idx_software_project_screens_published_sort
  on public.software_project_screens (project_id, published, sort_order)
  where deleted_at is null;

create index if not exists idx_software_project_screens_key
  on public.software_project_screens (screen_key)
  where deleted_at is null;
