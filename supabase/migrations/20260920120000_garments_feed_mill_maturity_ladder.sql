-- Garments + Feed Mill maturity ladder: industry map, prices, sort_order, packages
-- Idempotent. Does not regenerate assets. Complements ensure-garments-feed-mill-ladder.ts

-- Remap / update Standards + Accessories sort / prices when rows already exist
with map(product_slug, industry_slug, title, starting_price, sort_order, featured) as (
  values
    ('garments-starter-software', 'garments', 'Garments Starter', 25000, 10, false),
    ('garments-production-management', 'garments', 'Garments Production Management', 50000, 20, true),
    ('garments-erp', 'garments', 'Garments ERP Standard', 100000, 30, true),
    ('garments-erp-professional', 'garments', 'Garments ERP Professional', 200000, 40, true),
    ('garments-enterprise-erp', 'garments', 'Garments Enterprise ERP', 500000, 50, false),
    ('garments-accessories-erp', 'garments', 'Garments Accessories ERP', 70000, 60, false),
    ('feed-mill-mini', 'feed-mill', 'Feed Mill Mini', 10000, 10, false),
    ('feed-mill-basic', 'feed-mill', 'Feed Mill Basic', 25000, 20, false),
    ('feed-mill-erp', 'feed-mill', 'Feed Mill ERP Standard', 50000, 30, true),
    ('feed-mill-erp-professional', 'feed-mill', 'Feed Mill ERP Professional', 100000, 40, true),
    ('feed-mill-enterprise-erp', 'feed-mill', 'Feed Mill Enterprise ERP', 250000, 50, false)
)
update public.software_projects p
set
  title = m.title,
  starting_price = m.starting_price,
  price_suffix = case when m.product_slug in ('garments-enterprise-erp', 'feed-mill-enterprise-erp') then '+' else coalesce(p.price_suffix, '') end,
  sort_order = m.sort_order,
  featured = m.featured,
  industry_id = i.id,
  canonical_path = '/software/' || i.slug || '/' || p.slug,
  updated_at = now()
from map m
join public.catalog_industries i
  on i.slug = m.industry_slug
 and i.category_root = 'software'
 and i.deleted_at is null
where p.slug = m.product_slug
  and p.deleted_at is null;

-- Align standard package prices on flagships
update public.software_packages pkg
set price = p.starting_price,
    updated_at = now()
from public.software_projects p
where pkg.project_id = p.id
  and pkg.deleted_at is null
  and pkg.tier = 'standard'
  and p.slug in ('garments-erp', 'feed-mill-erp')
  and p.deleted_at is null;

-- Redirects for new product URLs (flat → industry nested) if any old paths exist later
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
values
  ('/software/garments-starter-software', '/software/garments/garments-starter-software', true, true),
  ('/software/garments-production-management', '/software/garments/garments-production-management', true, true),
  ('/software/garments-erp-professional', '/software/garments/garments-erp-professional', true, true),
  ('/software/garments-enterprise-erp', '/software/garments/garments-enterprise-erp', true, true),
  ('/software/feed-mill-mini', '/software/feed-mill/feed-mill-mini', true, true),
  ('/software/feed-mill-basic', '/software/feed-mill/feed-mill-basic', true, true),
  ('/software/feed-mill-erp-professional', '/software/feed-mill/feed-mill-erp-professional', true, true),
  ('/software/feed-mill-enterprise-erp', '/software/feed-mill/feed-mill-enterprise-erp', true, true)
on conflict (from_path) do update
set to_path = excluded.to_path,
    permanent = excluded.permanent,
    active = excluded.active;
