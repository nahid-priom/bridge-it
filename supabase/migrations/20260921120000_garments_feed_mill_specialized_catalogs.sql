-- Specialized Garments + Feed Mill catalogs (in addition to maturity ladder)
-- Idempotent metadata updates for rows that already exist after ensure script.

with map(product_slug, industry_slug, title, starting_price, sort_order, featured) as (
  values
    ('garments-merchandising-management', 'garments', 'Garments Merchandising Management', 60000, 70, false),
    ('garments-cutting-sewing-management', 'garments', 'Garments Cutting & Sewing Management', 75000, 80, true),
    ('garments-inventory-warehouse', 'garments', 'Garments Inventory & Warehouse', 70000, 90, false),
    ('garments-hr-payroll', 'garments', 'Garments HR & Payroll', 80000, 100, false),
    ('garments-commercial-export-management', 'garments', 'Garments Commercial & Export Management', 150000, 110, true),
    ('feed-production-management', 'feed-mill', 'Feed Production Management', 40000, 70, false),
    ('feed-formula-costing-software', 'feed-mill', 'Feed Formula & Costing Software', 50000, 80, true),
    ('feed-dealer-distribution-management', 'feed-mill', 'Feed Dealer & Distribution Management', 75000, 90, true),
    ('feed-mill-inventory-warehouse', 'feed-mill', 'Feed Mill Inventory & Warehouse', 60000, 100, false),
    ('feed-mill-accounts-finance', 'feed-mill', 'Feed Mill Accounts & Finance', 90000, 110, false),
    ('garments-accessories-erp', 'garments', 'Garments Accessories ERP', 70000, 60, false)
)
update public.software_projects p
set
  title = m.title,
  starting_price = m.starting_price,
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

insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
values
  ('/software/garments-merchandising-management', '/software/garments/garments-merchandising-management', true, true),
  ('/software/garments-cutting-sewing-management', '/software/garments/garments-cutting-sewing-management', true, true),
  ('/software/garments-inventory-warehouse', '/software/garments/garments-inventory-warehouse', true, true),
  ('/software/garments-hr-payroll', '/software/garments/garments-hr-payroll', true, true),
  ('/software/garments-commercial-export-management', '/software/garments/garments-commercial-export-management', true, true),
  ('/software/feed-production-management', '/software/feed-mill/feed-production-management', true, true),
  ('/software/feed-formula-costing-software', '/software/feed-mill/feed-formula-costing-software', true, true),
  ('/software/feed-dealer-distribution-management', '/software/feed-mill/feed-dealer-distribution-management', true, true),
  ('/software/feed-mill-inventory-warehouse', '/software/feed-mill/feed-mill-inventory-warehouse', true, true),
  ('/software/feed-mill-accounts-finance', '/software/feed-mill/feed-mill-accounts-finance', true, true)
on conflict (from_path) do update
set to_path = excluded.to_path,
    permanent = excluded.permanent,
    active = excluded.active;
