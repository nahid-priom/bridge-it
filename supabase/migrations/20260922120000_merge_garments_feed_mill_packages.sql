-- Merge Garments/Feed Mill maturity-ladder products into single ERPs with packages.
-- Soft-delete ladder cards; keep garments-accessories-erp. Theme-safe data only.

-- ─── 1. Canonical flagship titles + starting prices ───
update public.software_projects
set
  title = 'Garments ERP',
  short_description = coalesce(
    nullif(trim(short_description), ''),
    'Complete garments production, costing, stock and delivery management.'
  ),
  feature_summary = coalesce(
    nullif(trim(feature_summary), ''),
    'Production, inventory, costing, delivery and accounts for apparel factories.'
  ),
  starting_price = 60000,
  price_suffix = '',
  featured = true,
  popular = true,
  sort_order = 10,
  seo_title = coalesce(nullif(trim(seo_title), ''), 'Garments ERP Software in Bangladesh | Bridge IT Park'),
  seo_description = coalesce(
    nullif(trim(seo_description), ''),
    'Garments ERP for Bangladesh factories — cutting, sewing, finishing, stock, delivery and packages from Starter to Enterprise.'
  ),
  updated_at = now()
where slug = 'garments-erp'
  and deleted_at is null;

update public.software_projects
set
  title = 'Feed Mill ERP',
  short_description = coalesce(
    nullif(trim(short_description), ''),
    'Feed formula, production, raw stock, dealer sales and accounts in one ERP.'
  ),
  feature_summary = coalesce(
    nullif(trim(feature_summary), ''),
    'Raw materials, formulas, production, finished goods, dealer due and P&L.'
  ),
  starting_price = 45000,
  price_suffix = '',
  featured = true,
  popular = true,
  sort_order = 10,
  seo_title = coalesce(nullif(trim(seo_title), ''), 'Feed Mill ERP Software in Bangladesh | Bridge IT Park'),
  seo_description = coalesce(
    nullif(trim(seo_description), ''),
    'Feed Mill ERP for Bangladesh mills — purchase, formula, production, stock, dealer sales and packages from Starter to Enterprise.'
  ),
  updated_at = now()
where slug = 'feed-mill-erp'
  and deleted_at is null;

-- ─── 2. Soft-delete active packages on flagships (re-seed 4 tiers) ───
update public.software_packages pk
set deleted_at = now(), updated_at = now()
from public.software_projects p
where pk.project_id = p.id
  and p.slug in ('garments-erp', 'feed-mill-erp')
  and p.deleted_at is null
  and pk.deleted_at is null;

-- ─── 3. Insert Starter / Standard / Professional / Enterprise ───
insert into public.software_packages (
  project_id, name, tier, price, currency, payment_type,
  short_description, target_business_size, features,
  is_popular, is_recommended, badge, sort_order, active
)
select
  p.id,
  v.name,
  v.tier,
  v.price,
  'BDT',
  'one_time',
  v.short_description,
  v.target_business_size,
  v.features::jsonb,
  v.is_popular,
  v.is_recommended,
  v.badge,
  v.sort_order,
  true
from public.software_projects p
join (
  values
    -- Garments ERP
    ('garments-erp', 'Starter', 'starter', 60000,
     'Ideal for small workshops and buying houses starting digital orders.', 'small',
     '["Buyer & style booking","Order booking","Size/color matrix","Production entry","Basic stock","Delivery","Basic reports"]',
     false, false, null::text, 10),
    ('garments-erp', 'Standard', 'standard', 90000,
     'Best for growing factories that need cutting through delivery.', 'growing',
     '["Everything in Starter","Production planning","Cutting / sewing / finishing","Fabric & trim stock","Costing","Shipment packing","Accounts"]',
     true, true, 'Most Popular', 20),
    ('garments-erp', 'Professional', 'professional', 200000,
     'For large factories needing QC, workforce and advanced control.', 'professional',
     '["Everything in Standard","Quality control","Line efficiency","Multi-warehouse","Attendance & payroll","Approvals & roles","Advanced accounts"]',
     false, false, null, 30),
    ('garments-erp', 'Enterprise', 'enterprise', 500000,
     'Multi-factory enterprise deployments with HR and analytics.', 'enterprise',
     '["Everything in Professional","Multi-factory planning","BOM & material issue","HR & automation","Analytics dashboards","Custom integrations"]',
     false, false, 'Enterprise', 40),
    -- Feed Mill ERP
    ('feed-mill-erp', 'Starter', 'starter', 45000,
     'Ideal for mini mills starting purchase, production and sales.', 'small',
     '["Raw material purchase","Raw stock","Basic production","Sales & delivery","Customer list","Basic reports"]',
     false, false, null, 10),
    ('feed-mill-erp', 'Standard', 'standard', 75000,
     'Best for growing mills with formulas, finished goods and ledgers.', 'growing',
     '["Everything in Starter","Formula / recipe","Production planning","Finished goods stock","Dealer / customer due","Cash & bank","Customer & supplier ledger"]',
     true, true, 'Most Popular', 20),
    ('feed-mill-erp', 'Professional', 'professional', 100000,
     'For professional mills needing warehouse, approvals and advanced accounts.', 'professional',
     '["Everything in Standard","Dealer network","Warehouse control","Approvals & user roles","Advanced accounts","Audit log"]',
     false, false, null, 30),
    ('feed-mill-erp', 'Enterprise', 'enterprise', 250000,
     'Enterprise feed groups with multi-warehouse, QC, HR and analytics.', 'enterprise',
     '["Everything in Professional","BOM / batch planning","QC logs","Multi-warehouse","HR & payroll","Automation","Analytics"]',
     false, false, 'Enterprise', 40)
) as v(product_slug, name, tier, price, short_description, target_business_size, features, is_popular, is_recommended, badge, sort_order)
  on p.slug = v.product_slug
 and p.deleted_at is null
where not exists (
  select 1
  from public.software_packages existing
  where existing.project_id = p.id
    and existing.tier = v.tier
    and existing.deleted_at is null
);

-- Sync flagship starting_price from min active package
update public.software_projects p
set
  starting_price = sub.min_price,
  updated_at = now()
from (
  select pk.project_id, min(pk.price)::numeric as min_price
  from public.software_packages pk
  join public.software_projects sp on sp.id = pk.project_id
  where sp.slug in ('garments-erp', 'feed-mill-erp')
    and sp.deleted_at is null
    and pk.deleted_at is null
    and pk.active = true
  group by pk.project_id
) sub
where p.id = sub.project_id;

-- ─── 4. Soft-delete ladder-only products (keep accessories) ───
update public.software_projects
set
  published = false,
  deleted_at = coalesce(deleted_at, now()),
  updated_at = now()
where slug in (
  'garments-starter-software',
  'garments-production-management',
  'garments-erp-professional',
  'garments-enterprise-erp',
  'feed-mill-mini',
  'feed-mill-basic',
  'feed-mill-erp-professional',
  'feed-mill-enterprise-erp'
)
and deleted_at is null;

-- Soft-delete their packages
update public.software_packages pk
set deleted_at = coalesce(pk.deleted_at, now()), updated_at = now()
from public.software_projects p
where pk.project_id = p.id
  and p.slug in (
    'garments-starter-software',
    'garments-production-management',
    'garments-erp-professional',
    'garments-enterprise-erp',
    'feed-mill-mini',
    'feed-mill-basic',
    'feed-mill-erp-professional',
    'feed-mill-enterprise-erp'
  )
  and pk.deleted_at is null;

-- Soft-delete homepage placements pointing at ladder products
delete from public.software_homepage_placements hp
using public.software_projects p
where hp.project_id = p.id
  and p.slug in (
    'garments-starter-software',
    'garments-production-management',
    'garments-erp-professional',
    'garments-enterprise-erp',
    'feed-mill-mini',
    'feed-mill-basic',
    'feed-mill-erp-professional',
    'feed-mill-enterprise-erp'
  );

-- ─── 5. URL redirects (SEO preserve) ───
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
values
  ('/software/garments/garments-starter-software', '/software/garments/garments-erp?package=starter', true, true),
  ('/software/garments/garments-production-management', '/software/garments/garments-erp?package=standard', true, true),
  ('/software/garments/garments-erp-professional', '/software/garments/garments-erp?package=professional', true, true),
  ('/software/garments/garments-enterprise-erp', '/software/garments/garments-erp?package=enterprise', true, true),
  ('/software/feed-mill/feed-mill-mini', '/software/feed-mill/feed-mill-erp?package=starter', true, true),
  ('/software/feed-mill/feed-mill-basic', '/software/feed-mill/feed-mill-erp?package=starter', true, true),
  ('/software/feed-mill/feed-mill-erp-professional', '/software/feed-mill/feed-mill-erp?package=professional', true, true),
  ('/software/feed-mill/feed-mill-enterprise-erp', '/software/feed-mill/feed-mill-erp?package=enterprise', true, true),
  ('/software/garments-starter-software', '/software/garments/garments-erp?package=starter', true, true),
  ('/software/garments-production-management', '/software/garments/garments-erp?package=standard', true, true),
  ('/software/garments-erp-professional', '/software/garments/garments-erp?package=professional', true, true),
  ('/software/garments-enterprise-erp', '/software/garments/garments-erp?package=enterprise', true, true),
  ('/software/feed-mill-mini', '/software/feed-mill/feed-mill-erp?package=starter', true, true),
  ('/software/feed-mill-basic', '/software/feed-mill/feed-mill-erp?package=starter', true, true),
  ('/software/feed-mill-erp-professional', '/software/feed-mill/feed-mill-erp?package=professional', true, true),
  ('/software/feed-mill-enterprise-erp', '/software/feed-mill/feed-mill-erp?package=enterprise', true, true)
on conflict (from_path) do update
set
  to_path = excluded.to_path,
  permanent = excluded.permanent,
  active = excluded.active;

-- ─── 6. Floor starting_price >= 10000 for all published software ───
update public.software_projects
set
  starting_price = greatest(coalesce(starting_price, 0), 10000),
  updated_at = now()
where deleted_at is null
  and published = true
  and coalesce(starting_price, 0) < 10000;

-- Sync starting_price from min package where packages exist
update public.software_projects p
set
  starting_price = greatest(sub.min_price, 10000),
  updated_at = now()
from (
  select project_id, min(price)::numeric as min_price
  from public.software_packages
  where deleted_at is null
    and active = true
  group by project_id
) sub
where p.id = sub.project_id
  and p.deleted_at is null
  and p.published = true;

-- Ecommerce admin flagship example band
update public.software_projects
set
  starting_price = greatest(starting_price, 25000),
  updated_at = now()
where slug = 'ecommerce-admin-dashboard'
  and deleted_at is null;

update public.software_packages pk
set price = greatest(pk.price, 25000), updated_at = now()
from public.software_projects p
where pk.project_id = p.id
  and p.slug = 'ecommerce-admin-dashboard'
  and pk.deleted_at is null
  and pk.tier = 'starter'
  and pk.price < 25000;
