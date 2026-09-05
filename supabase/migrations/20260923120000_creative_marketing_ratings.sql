-- Creative marketing ratings (display averages on portfolio cards)

alter table public.creative_marketing_projects
  add column if not exists rating_avg numeric(2,1) not null default 4.8
    check (rating_avg >= 0 and rating_avg <= 5),
  add column if not exists review_count integer not null default 0
    check (review_count >= 0);

-- Seed stable 4.7–5.0 ratings from slug hash (no render-time randomization)
update public.creative_marketing_projects
set
  rating_avg = (4.7 + (abs(hashtext(slug)) % 4) * 0.1)::numeric(2,1),
  review_count = greatest(review_count, 6 + (abs(hashtext(slug)) % 19))
where deleted_at is null;

-- Allow marketing reviews in catalog_product_reviews (optional future reviews UI)
alter table public.catalog_product_reviews
  drop constraint if exists catalog_product_reviews_kind_check;

alter table public.catalog_product_reviews
  add constraint catalog_product_reviews_kind_check
  check (kind in ('software', 'websites', 'marketing'));

drop view if exists public.creative_marketing_project_cards;

create or replace view public.creative_marketing_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.outcome_line,
  p.service_group,
  p.service_type,
  p.service_subcategory,
  p.target_business,
  p.pricing_model,
  p.industry_id,
  p.canonical_path,
  p.badge,
  p.business_size,
  p.package_tier,
  p.payment_type,
  p.cover_card_url,
  p.cover_detail_url,
  p.starting_price,
  p.price_suffix,
  p.currency,
  p.featured,
  p.popular,
  p.published,
  p.sort_order,
  p.rating_avg,
  p.review_count,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  ci.name as industry_name,
  ci.slug as industry_slug,
  (
    select count(*)::int
    from public.creative_marketing_assets a
    where a.project_id = p.id
      and a.deleted_at is null
      and a.published = true
  ) as asset_count
from public.creative_marketing_projects p
left join public.catalog_industries ci
  on ci.id = p.industry_id
  and ci.deleted_at is null;

grant select on public.creative_marketing_project_cards to anon, authenticated, service_role;

notify pgrst, 'reload schema';
