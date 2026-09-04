-- Software Solutions taxonomy: solution_group, software_type, platform_type
-- Extends software_projects; does not modify ecommerce_* tables.

alter table public.software_projects
  add column if not exists solution_group text,
  add column if not exists software_type text,
  add column if not exists platform_type text;

alter table public.software_projects
  drop constraint if exists software_projects_platform_type_check;

alter table public.software_projects
  add constraint software_projects_platform_type_check
  check (
    platform_type is null
    or platform_type in ('web', 'mobile', 'web-mobile', 'saas')
  );

create index if not exists idx_software_projects_solution_group
  on public.software_projects (solution_group, sort_order, id)
  where deleted_at is null;

create index if not exists idx_software_projects_software_type
  on public.software_projects (software_type)
  where deleted_at is null;

-- Homepage placements: keep popular as primary; allow legacy keys for back-compat
alter table public.software_homepage_placements
  drop constraint if exists software_homepage_placements_section_check;

alter table public.software_homepage_placements
  add constraint software_homepage_placements_section_check
  check (
    section_key in ('popular', 'manufacturing_erp', 'agro_distribution', 'services_ops')
  );

drop view if exists public.software_project_cards;

create or replace view public.software_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.category_id,
  p.industry,
  p.business_type,
  p.solution_group,
  p.software_type,
  p.platform_type,
  p.cover_card_url,
  p.cover_detail_url,
  p.starting_price,
  p.price_suffix,
  p.currency,
  p.featured,
  p.popular,
  p.published,
  p.sort_order,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
  (
    select count(*)::int
    from public.software_project_screens s
    where s.project_id = p.id
      and s.deleted_at is null
      and s.published = true
  ) as screen_count
from public.software_projects p
left join public.software_categories c
  on c.id = p.category_id
  and c.deleted_at is null;

grant select on public.software_project_cards to anon, authenticated, service_role;
