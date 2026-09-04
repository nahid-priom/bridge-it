-- Expose asset_version on software_project_cards for cache-busting in listing UI

drop view if exists public.software_project_cards;

create or replace view public.software_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.feature_summary,
  p.category_id,
  p.industry,
  p.business_type,
  p.solution_group,
  p.software_type,
  p.platform_type,
  p.main_category_id,
  p.taxonomy_category_id,
  p.child_category_id,
  p.cover_card_url,
  p.cover_detail_url,
  p.starting_price,
  p.price_suffix,
  p.currency,
  p.featured,
  p.popular,
  p.published,
  p.sort_order,
  p.asset_version,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
  sc.name as taxonomy_category_name,
  sc.slug as taxonomy_category_slug,
  ch.name as child_category_name,
  ch.slug as child_category_slug,
  (
    select count(*)::int
    from public.software_project_screens s
    where s.project_id = p.id
      and s.deleted_at is null
      and s.published = true
  ) as screen_count
from public.software_projects p
left join public.software_categories c
  on c.id = p.category_id and c.deleted_at is null
left join public.showcase_categories sc
  on sc.id = p.taxonomy_category_id and sc.deleted_at is null
left join public.showcase_child_categories ch
  on ch.id = p.child_category_id and ch.deleted_at is null;

grant select on public.software_project_cards to anon, authenticated, service_role;
