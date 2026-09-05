-- Enterprise Catalog Hierarchy (Phase 1–2)
-- Shared L2 industries + product FK/SEO columns + redirects/FAQs/related.
-- Evolves existing showcase tables; does NOT create catalog_products.

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. catalog_industries
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.catalog_industries (
  id uuid primary key default gen_random_uuid(),
  category_root text not null
    check (category_root in ('software', 'websites', 'marketing')),
  name text not null,
  slug text not null,
  short_description text,
  description text,
  seo_title text,
  seo_description text,
  seo_h1 text,
  seo_intro text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint catalog_industries_root_slug_unique unique (category_root, slug)
);

create index if not exists idx_catalog_industries_root_slug
  on public.catalog_industries (category_root, slug)
  where deleted_at is null;

create index if not exists idx_catalog_industries_root_active_sort
  on public.catalog_industries (category_root, active, sort_order, id)
  where deleted_at is null;

drop trigger if exists catalog_industries_updated_at on public.catalog_industries;
create trigger catalog_industries_updated_at
  before update on public.catalog_industries
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. Additive columns on product tables
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.software_projects
  add column if not exists industry_id uuid references public.catalog_industries (id) on delete set null,
  add column if not exists canonical_path text,
  add column if not exists badge text,
  add column if not exists business_size text,
  add column if not exists package_tier text,
  add column if not exists payment_type text not null default 'one_time',
  add column if not exists primary_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}';

alter table public.ecommerce_projects
  add column if not exists industry_id uuid references public.catalog_industries (id) on delete set null,
  add column if not exists canonical_path text,
  add column if not exists badge text,
  add column if not exists business_size text,
  add column if not exists package_tier text,
  add column if not exists payment_type text not null default 'one_time',
  add column if not exists primary_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}';

alter table public.creative_marketing_projects
  add column if not exists industry_id uuid references public.catalog_industries (id) on delete set null,
  add column if not exists canonical_path text,
  add column if not exists badge text,
  add column if not exists business_size text,
  add column if not exists package_tier text,
  add column if not exists payment_type text not null default 'one_time',
  add column if not exists primary_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}';

-- Unique industry+slug where assigned (partial — allows null industry_id)
create unique index if not exists idx_software_projects_industry_slug
  on public.software_projects (industry_id, slug)
  where deleted_at is null and industry_id is not null;

create unique index if not exists idx_ecommerce_projects_industry_slug
  on public.ecommerce_projects (industry_id, slug)
  where deleted_at is null and industry_id is not null;

create unique index if not exists idx_cm_projects_industry_slug
  on public.creative_marketing_projects (industry_id, slug)
  where deleted_at is null and industry_id is not null;

create index if not exists idx_software_projects_industry_id
  on public.software_projects (industry_id, sort_order, id)
  where deleted_at is null;

create index if not exists idx_ecommerce_projects_industry_id
  on public.ecommerce_projects (industry_id, sort_order, id)
  where deleted_at is null;

create index if not exists idx_cm_projects_industry_id
  on public.creative_marketing_projects (industry_id, sort_order, id)
  where deleted_at is null;

create index if not exists idx_software_projects_canonical_path
  on public.software_projects (canonical_path)
  where deleted_at is null and canonical_path is not null;

create index if not exists idx_ecommerce_projects_canonical_path
  on public.ecommerce_projects (canonical_path)
  where deleted_at is null and canonical_path is not null;

create index if not exists idx_cm_projects_canonical_path
  on public.creative_marketing_projects (canonical_path)
  where deleted_at is null and canonical_path is not null;

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. catalog_related_products
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.catalog_related_products (
  id uuid primary key default gen_random_uuid(),
  source_kind text not null
    check (source_kind in ('software', 'websites', 'marketing')),
  source_id uuid not null,
  related_kind text not null
    check (related_kind in ('software', 'websites', 'marketing')),
  related_id uuid not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_related_products_pair_unique
    unique (source_kind, source_id, related_kind, related_id),
  constraint catalog_related_products_no_self
    check (not (source_kind = related_kind and source_id = related_id))
);

create index if not exists idx_catalog_related_source
  on public.catalog_related_products (source_kind, source_id, sort_order);

create index if not exists idx_catalog_related_target
  on public.catalog_related_products (related_kind, related_id);

drop trigger if exists catalog_related_products_updated_at on public.catalog_related_products;
create trigger catalog_related_products_updated_at
  before update on public.catalog_related_products
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. catalog_faqs
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.catalog_faqs (
  id uuid primary key default gen_random_uuid(),
  category_root text
    check (category_root is null or category_root in ('software', 'websites', 'marketing')),
  industry_id uuid references public.catalog_industries (id) on delete cascade,
  product_kind text
    check (product_kind is null or product_kind in ('software', 'websites', 'marketing')),
  product_id uuid,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_catalog_faqs_category
  on public.catalog_faqs (category_root, sort_order)
  where active = true and category_root is not null;

create index if not exists idx_catalog_faqs_industry
  on public.catalog_faqs (industry_id, sort_order)
  where active = true and industry_id is not null;

create index if not exists idx_catalog_faqs_product
  on public.catalog_faqs (product_kind, product_id, sort_order)
  where active = true and product_kind is not null and product_id is not null;

drop trigger if exists catalog_faqs_updated_at on public.catalog_faqs;
create trigger catalog_faqs_updated_at
  before update on public.catalog_faqs
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. catalog_url_redirects
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.catalog_url_redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null,
  to_path text not null,
  permanent boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_url_redirects_from_unique unique (from_path)
);

create index if not exists idx_catalog_url_redirects_active_from
  on public.catalog_url_redirects (from_path)
  where active = true;

drop trigger if exists catalog_url_redirects_updated_at on public.catalog_url_redirects;
create trigger catalog_url_redirects_updated_at
  before update on public.catalog_url_redirects
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. RLS
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.catalog_industries enable row level security;
alter table public.catalog_related_products enable row level security;
alter table public.catalog_faqs enable row level security;
alter table public.catalog_url_redirects enable row level security;

drop policy if exists "Public read active catalog industries" on public.catalog_industries;
create policy "Public read active catalog industries"
  on public.catalog_industries for select
  to anon, authenticated
  using (
    (active = true and deleted_at is null)
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage catalog industries" on public.catalog_industries;
create policy "Editors manage catalog industries"
  on public.catalog_industries for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read catalog related products" on public.catalog_related_products;
create policy "Public read catalog related products"
  on public.catalog_related_products for select
  to anon, authenticated
  using (true);

drop policy if exists "Editors manage catalog related products" on public.catalog_related_products;
create policy "Editors manage catalog related products"
  on public.catalog_related_products for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read active catalog faqs" on public.catalog_faqs;
create policy "Public read active catalog faqs"
  on public.catalog_faqs for select
  to anon, authenticated
  using (
    active = true
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage catalog faqs" on public.catalog_faqs;
create policy "Editors manage catalog faqs"
  on public.catalog_faqs for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

drop policy if exists "Public read active catalog redirects" on public.catalog_url_redirects;
create policy "Public read active catalog redirects"
  on public.catalog_url_redirects for select
  to anon, authenticated
  using (
    active = true
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage catalog redirects" on public.catalog_url_redirects;
create policy "Editors manage catalog redirects"
  on public.catalog_url_redirects for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

grant select on
  public.catalog_industries,
  public.catalog_related_products,
  public.catalog_faqs,
  public.catalog_url_redirects
to anon, authenticated;

grant insert, update, delete on
  public.catalog_industries,
  public.catalog_related_products,
  public.catalog_faqs,
  public.catalog_url_redirects
to authenticated;

grant all on
  public.catalog_industries,
  public.catalog_related_products,
  public.catalog_faqs,
  public.catalog_url_redirects
to service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. Seed software industries
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.catalog_industries (
  category_root, name, slug, short_description, description,
  seo_title, seo_description, seo_h1, seo_intro, sort_order, active
)
values
  ('software', 'Garments', 'garments',
   'Apparel, textile and dyeing ERP systems.',
   'Business software for garments manufacturing, textile mills, dyeing and accessories.',
   'Garments ERP Software Bangladesh | Bridge IT Park',
   'Garments, textile and dyeing management software for Bangladesh factories and exporters.',
   'Garments Software',
   'ERP and operations systems for garments, textile, dyeing and accessories businesses.',
   10, true),
  ('software', 'Feed Mill', 'feed-mill',
   'Feed mill production and inventory ERP.',
   'End-to-end feed mill management for production, inventory and distribution.',
   'Feed Mill ERP Software Bangladesh | Bridge IT Park',
   'Feed mill ERP for production planning, inventory and sales in Bangladesh.',
   'Feed Mill Software',
   'Purpose-built ERP for feed mill manufacturing and distribution.',
   20, true),
  ('software', 'Agro & Farming', 'agro',
   'Poultry, fish, cattle and farm management.',
   'Farm and agro operations software for poultry, layer, fish and dairy.',
   'Agro & Farm Management Software Bangladesh | Bridge IT Park',
   'Poultry, fish farm, cattle and dairy management software for Bangladesh growers.',
   'Agro & Farming Software',
   'Management systems for poultry, fish, cattle and related agro businesses.',
   30, true),
  ('software', 'Dealership', 'dealership',
   'Vehicle and product dealership management.',
   'Dealership ERP covering sales, inventory, finance and after-sales.',
   'Dealership Management Software Bangladesh | Bridge IT Park',
   'Dealership management software for sales, stock and service operations.',
   'Dealership Software',
   'Systems built for dealer networks and showroom operations.',
   40, true),
  ('software', 'Distribution & Wholesale', 'distribution',
   'Wholesale, trading and distribution ERP.',
   'Distribution, wholesale and trading software for multi-party supply chains.',
   'Distribution & Wholesale ERP Bangladesh | Bridge IT Park',
   'Wholesale, trading and distribution management software for Bangladesh businesses.',
   'Distribution & Wholesale Software',
   'ERP for distributors, wholesalers and trading companies.',
   50, true),
  ('software', 'Manufacturing', 'manufacturing',
   'Factory, packaging, electronics and printing ERP.',
   'Manufacturing ERP for factories, packaging plants, electronics assembly and printing presses.',
   'Manufacturing ERP Software Bangladesh | Bridge IT Park',
   'Factory and manufacturing ERP for production, packaging and plant operations.',
   'Manufacturing Software',
   'Production and plant systems for manufacturers across industries.',
   60, true),
  ('software', 'Inventory & Warehouse', 'inventory',
   'Warehouse and inventory control systems.',
   'Inventory and warehouse ERP for stock accuracy and multi-location control.',
   'Inventory & Warehouse Software Bangladesh | Bridge IT Park',
   'Warehouse and inventory management software for Bangladesh businesses.',
   'Inventory & Warehouse Software',
   'Stock and warehouse systems for accurate multi-location inventory.',
   70, true),
  ('software', 'Retail & POS', 'retail',
   'Retail POS and super shop management.',
   'Point-of-sale and retail management for shops and supermarket chains.',
   'Retail POS Software Bangladesh | Bridge IT Park',
   'Retail POS and super shop management software for Bangladesh stores.',
   'Retail & POS Software',
   'POS and retail operations systems for shops and chains.',
   80, true),
  ('software', 'Pharmacy', 'pharmacy',
   'Pharmacy and medicine retail management.',
   'Pharmacy management covering inventory, expiry, sales and compliance.',
   'Pharmacy Management Software Bangladesh | Bridge IT Park',
   'Pharmacy management software for inventory, sales and medicine tracking.',
   'Pharmacy Software',
   'Retail pharmacy systems for medicine inventory and sales.',
   90, true),
  ('software', 'Hospital & Healthcare', 'hospital',
   'Hospital, clinic and diagnostic systems.',
   'Healthcare software for hospitals, diagnostic centers and clinics.',
   'Hospital Management Software Bangladesh | Bridge IT Park',
   'Hospital, clinic and diagnostic center management software for Bangladesh.',
   'Hospital & Healthcare Software',
   'Clinical and administrative systems for hospitals, clinics and labs.',
   100, true),
  ('software', 'Restaurant & Bakery', 'restaurant',
   'Restaurant and bakery operations software.',
   'F&B management for restaurants, cafes and bakeries.',
   'Restaurant Management Software Bangladesh | Bridge IT Park',
   'Restaurant and bakery management software for orders, kitchen and inventory.',
   'Restaurant & Bakery Software',
   'Operations systems for restaurants, cafes and bakeries.',
   110, true),
  ('software', 'Education', 'school',
   'School, college and coaching management.',
   'Education management for schools, colleges and coaching centers.',
   'School Management Software Bangladesh | Bridge IT Park',
   'School, college and coaching management software for Bangladesh institutions.',
   'Education Software',
   'Student, academic and admin systems for schools and coaching centers.',
   120, true),
  ('software', 'HR & Payroll', 'hr',
   'HR and payroll management systems.',
   'Human resources and payroll software for attendance, salary and compliance.',
   'HR & Payroll Software Bangladesh | Bridge IT Park',
   'HR and payroll management software for Bangladesh companies.',
   'HR & Payroll Software',
   'Workforce and payroll systems for growing organizations.',
   130, true),
  ('software', 'CRM & Sales', 'crm',
   'CRM and sales force automation.',
   'Customer relationship and sales automation platforms.',
   'CRM Software Bangladesh | Bridge IT Park',
   'CRM and sales force automation software for Bangladesh sales teams.',
   'CRM & Sales Software',
   'Pipeline and customer systems for sales-driven organizations.',
   140, true),
  ('software', 'Logistics & Courier', 'logistics',
   'Courier, transport and logistics ERP.',
   'Logistics software for courier, fleet and transport operations.',
   'Logistics & Courier Software Bangladesh | Bridge IT Park',
   'Courier, logistics and transport management software for Bangladesh.',
   'Logistics & Courier Software',
   'Fleet, courier and logistics operations systems.',
   150, true),
  ('software', 'Manpower & Recruiting', 'manpower',
   'Recruiting and manpower agency ERP.',
   'Manpower and recruiting systems for agencies and overseas employment.',
   'Manpower Recruiting Software Bangladesh | Bridge IT Park',
   'Manpower and recruiting ERP for agencies and placement firms.',
   'Manpower & Recruiting Software',
   'Recruiting and agency systems for manpower businesses.',
   160, true),
  ('software', 'Real Estate', 'real-estate',
   'Property and real estate ERP.',
   'Real estate and property management for developers and agencies.',
   'Real Estate Software Bangladesh | Bridge IT Park',
   'Real estate and property management software for Bangladesh developers.',
   'Real Estate Software',
   'Property sales and management systems for real estate businesses.',
   170, true),
  ('software', 'Construction', 'construction',
   'Construction and brick/tiles ERP.',
   'Construction project and materials ERP including brick and tiles plants.',
   'Construction ERP Software Bangladesh | Bridge IT Park',
   'Construction and brick/tiles management software for Bangladesh builders.',
   'Construction Software',
   'Project and plant systems for construction and materials producers.',
   180, true),
  ('software', 'Mills & Processing', 'mills',
   'Rice, flour and oil mill ERP.',
   'Processing mill ERP for rice, flour and edible oil production.',
   'Mill ERP Software Bangladesh | Bridge IT Park',
   'Rice mill, flour mill and oil production ERP for Bangladesh processors.',
   'Mills & Processing Software',
   'Production systems for rice, flour and oil mills.',
   190, true),
  ('software', 'Service Business', 'services',
   'Workshop, salon and service center software.',
   'Service business systems for workshops, service centers and salons.',
   'Service Business Software Bangladesh | Bridge IT Park',
   'Automobile workshop, salon and service center management software.',
   'Service Business Software',
   'Operations systems for workshops, salons and service centers.',
   200, true),
  ('software', 'SaaS & ISP', 'saas',
   'ISP and SaaS billing management.',
   'ISP and SaaS management for subscriptions, billing and subscribers.',
   'ISP & SaaS Management Software Bangladesh | Bridge IT Park',
   'ISP and SaaS management software for billing and subscriber operations.',
   'SaaS & ISP Software',
   'Billing and subscriber systems for ISPs and SaaS providers.',
   210, true),
  ('software', 'Enterprise', 'enterprise',
   'Multi-branch enterprise ERP platforms.',
   'Enterprise multi-branch ERP for organizations operating across locations.',
   'Multi-Branch Enterprise ERP Bangladesh | Bridge IT Park',
   'Multi-branch enterprise ERP for Bangladesh organizations.',
   'Enterprise Software',
   'Cross-branch ERP platforms for growing enterprises.',
   220, true)
on conflict (category_root, slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_h1 = excluded.seo_h1,
  seo_intro = excluded.seo_intro,
  sort_order = excluded.sort_order,
  active = true,
  deleted_at = null,
  updated_at = now();

-- ═══════════════════════════════════════════════════════════════════════════
-- 8. Seed websites industries (from ecommerce_categories + extras)
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.catalog_industries (
  category_root, name, slug, short_description, description,
  seo_title, seo_description, seo_h1, seo_intro, sort_order, active
)
select
  'websites',
  c.name,
  c.slug,
  c.description,
  c.description,
  c.name || ' E-commerce Websites Bangladesh | Bridge IT Park',
  coalesce(c.description, 'Premium ' || c.name || ' e-commerce website designs for Bangladesh brands.'),
  c.name || ' Websites',
  coalesce(c.description, 'Browse ' || lower(c.name) || ' e-commerce website designs ready to customize.'),
  c.sort_order * 10,
  coalesce(c.active, true)
from public.ecommerce_categories c
where c.deleted_at is null
on conflict (category_root, slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_h1 = excluded.seo_h1,
  seo_intro = excluded.seo_intro,
  sort_order = excluded.sort_order,
  active = excluded.active,
  deleted_at = null,
  updated_at = now();

-- Ensure listing industries exist even if not yet in ecommerce_categories
insert into public.catalog_industries (
  category_root, name, slug, short_description, description,
  seo_title, seo_description, seo_h1, seo_intro, sort_order, active
)
values
  ('websites', 'Lifestyle', 'lifestyle',
   'Pets, baby, travel, gifts and lifestyle commerce.',
   'Lifestyle e-commerce website designs for Bangladesh brands.',
   'Lifestyle E-commerce Websites Bangladesh | Bridge IT Park',
   'Lifestyle e-commerce website designs for pets, travel, gifts and more.',
   'Lifestyle Websites',
   'Browse lifestyle e-commerce website designs ready to customize.',
   400, true),
  ('websites', 'Sports', 'sports',
   'Sports equipment and athletic commerce.',
   'Sports e-commerce website designs for athletic and outdoor brands.',
   'Sports E-commerce Websites Bangladesh | Bridge IT Park',
   'Sports e-commerce website designs for equipment and athletic brands.',
   'Sports Websites',
   'Browse sports e-commerce website designs ready to customize.',
   410, true),
  ('websites', 'Specialty', 'specialty',
   'Hardware, agriculture, health and specialty commerce.',
   'Specialty e-commerce website designs for niche Bangladesh businesses.',
   'Specialty E-commerce Websites Bangladesh | Bridge IT Park',
   'Specialty e-commerce website designs for niche product categories.',
   'Specialty Websites',
   'Browse specialty e-commerce website designs ready to customize.',
   420, true)
on conflict (category_root, slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_h1 = excluded.seo_h1,
  seo_intro = excluded.seo_intro,
  sort_order = excluded.sort_order,
  active = true,
  deleted_at = null,
  updated_at = now();

-- ═══════════════════════════════════════════════════════════════════════════
-- 9. Seed marketing industries (from creative service groups)
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.catalog_industries (
  category_root, name, slug, short_description, description,
  seo_title, seo_description, seo_h1, seo_intro, sort_order, active
)
values
  ('marketing', 'Social Media Design', 'social-media-design',
   'Feed posts, stories and social creatives.',
   'Social media graphic design packages for Facebook and Instagram brands.',
   'Social Media Design Bangladesh | Bridge IT Park',
   'Professional social media post and story design services in Bangladesh.',
   'Social Media Design',
   'Creative packages for consistent, on-brand social content.',
   10, true),
  ('marketing', 'Branding & Identity', 'branding-identity',
   'Logo, identity and brand systems.',
   'Brand identity design for logos, guidelines and visual systems.',
   'Brand Identity Design Bangladesh | Bridge IT Park',
   'Logo and brand identity design services for Bangladesh businesses.',
   'Branding & Identity',
   'Identity systems that make brands recognizable across channels.',
   20, true),
  ('marketing', 'Advertising Creative', 'advertising-creative',
   'Campaign and ad creative design.',
   'Advertising creatives for product launches and performance campaigns.',
   'Advertising Creative Design Bangladesh | Bridge IT Park',
   'Ad creative design for Meta, display and campaign advertising.',
   'Advertising Creative',
   'Conversion-focused creatives for paid and campaign advertising.',
   30, true),
  ('marketing', 'Packaging & Print', 'packaging-print',
   'Packaging, labels and print design.',
   'Packaging, label, brochure and print design for product brands.',
   'Packaging & Print Design Bangladesh | Bridge IT Park',
   'Packaging, label and print design services for Bangladesh brands.',
   'Packaging & Print',
   'Print-ready packaging and collateral for physical products.',
   40, true),
  ('marketing', 'Facebook & Instagram Ads', 'facebook-instagram-ads',
   'Meta ads management and setup.',
   'Facebook and Instagram ads management, pixel and campaign services.',
   'Facebook & Instagram Ads Bangladesh | Bridge IT Park',
   'Meta ads management and setup services for Bangladesh advertisers.',
   'Facebook & Instagram Ads',
   'Paid social campaign management and tracking setup.',
   50, true),
  ('marketing', 'E-commerce Marketing', 'ecommerce-marketing',
   'E-commerce growth and marketing packages.',
   'E-commerce marketing packages for online store growth.',
   'E-commerce Marketing Bangladesh | Bridge IT Park',
   'E-commerce marketing packages for Bangladesh online stores.',
   'E-commerce Marketing',
   'Growth packages tailored to online retail brands.',
   60, true),
  ('marketing', 'Lead Generation', 'lead-generation',
   'Lead generation campaigns.',
   'Lead generation campaign services for service and B2B businesses.',
   'Lead Generation Campaigns Bangladesh | Bridge IT Park',
   'Lead generation campaign services for Bangladesh businesses.',
   'Lead Generation',
   'Campaign packages focused on qualified inbound leads.',
   70, true),
  ('marketing', 'Social Media Management', 'social-media-management',
   'Ongoing social media management.',
   'Social media management retainers for content and community.',
   'Social Media Management Bangladesh | Bridge IT Park',
   'Social media management services for Bangladesh brands.',
   'Social Media Management',
   'Retainer packages for content, posting and community management.',
   80, true)
on conflict (category_root, slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_h1 = excluded.seo_h1,
  seo_intro = excluded.seo_intro,
  sort_order = excluded.sort_order,
  active = true,
  deleted_at = null,
  updated_at = now();

-- ═══════════════════════════════════════════════════════════════════════════
-- 10. Backfill software industry_id + canonical_path
-- ═══════════════════════════════════════════════════════════════════════════

with software_map (product_slug, industry_slug) as (
  values
    ('garments-erp', 'garments'),
    ('textile-erp', 'garments'),
    ('dyeing-management', 'garments'),
    ('garments-accessories-erp', 'garments'),
    ('feed-mill-erp', 'feed-mill'),
    ('poultry-management-erp', 'agro'),
    ('layer-farm-management', 'agro'),
    ('fish-farm-management', 'agro'),
    ('cattle-dairy-management', 'agro'),
    ('dealership-management', 'dealership'),
    ('distribution-management', 'distribution'),
    ('wholesale-erp', 'distribution'),
    ('trading-erp', 'distribution'),
    ('manufacturing-erp', 'manufacturing'),
    ('factory-management', 'manufacturing'),
    ('packaging-factory-erp', 'manufacturing'),
    ('electronics-assembly-erp', 'manufacturing'),
    ('printing-press-management', 'manufacturing'),
    ('inventory-warehouse-erp', 'inventory'),
    ('retail-pos', 'retail'),
    ('super-shop-management', 'retail'),
    ('pharmacy-management', 'pharmacy'),
    ('hospital-management', 'hospital'),
    ('diagnostic-center-management', 'hospital'),
    ('clinic-management', 'hospital'),
    ('restaurant-management', 'restaurant'),
    ('bakery-management', 'restaurant'),
    ('school-management', 'school'),
    ('college-management', 'school'),
    ('coaching-management', 'school'),
    ('hr-payroll', 'hr'),
    ('crm-system', 'crm'),
    ('sales-force-automation', 'crm'),
    ('courier-management', 'logistics'),
    ('logistics-erp', 'logistics'),
    ('transport-management', 'logistics'),
    ('manpower-recruiting-erp', 'manpower'),
    ('real-estate-erp', 'real-estate'),
    ('property-management', 'real-estate'),
    ('construction-erp', 'construction'),
    ('brick-tiles-erp', 'construction'),
    ('rice-mill-erp', 'mills'),
    ('flour-mill-erp', 'mills'),
    ('oil-production-erp', 'mills'),
    ('automobile-workshop', 'services'),
    ('service-center-management', 'services'),
    ('salon-management', 'services'),
    ('isp-management', 'saas'),
    ('saas-management', 'saas'),
    ('multi-branch-erp', 'enterprise')
)
update public.software_projects p
set
  industry_id = i.id,
  canonical_path = '/software/' || i.slug || '/' || p.slug,
  payment_type = coalesce(nullif(p.payment_type, ''), 'one_time'),
  updated_at = now()
from software_map m
join public.catalog_industries i
  on i.category_root = 'software'
 and i.slug = m.industry_slug
 and i.deleted_at is null
where p.slug = m.product_slug
  and p.deleted_at is null;

-- ═══════════════════════════════════════════════════════════════════════════
-- 11. Backfill websites industry_id + canonical_path (via ecommerce category)
-- ═══════════════════════════════════════════════════════════════════════════

update public.ecommerce_projects p
set
  industry_id = i.id,
  canonical_path = '/websites/' || i.slug || '/' || p.slug,
  payment_type = coalesce(nullif(p.payment_type, ''), 'one_time'),
  updated_at = now()
from public.ecommerce_categories c
join public.catalog_industries i
  on i.category_root = 'websites'
 and i.slug = c.slug
 and i.deleted_at is null
where p.category_id = c.id
  and p.deleted_at is null
  and c.deleted_at is null;

-- Fallback: match industry text field to websites industry slug
update public.ecommerce_projects p
set
  industry_id = i.id,
  canonical_path = '/websites/' || i.slug || '/' || p.slug,
  payment_type = coalesce(nullif(p.payment_type, ''), 'one_time'),
  updated_at = now()
from public.catalog_industries i
where p.industry_id is null
  and p.deleted_at is null
  and i.category_root = 'websites'
  and i.deleted_at is null
  and p.industry is not null
  and lower(replace(p.industry, ' ', '-')) = i.slug;

-- ═══════════════════════════════════════════════════════════════════════════
-- 12. Backfill marketing industry_id + canonical_path (via service_group)
-- ═══════════════════════════════════════════════════════════════════════════

update public.creative_marketing_projects p
set
  industry_id = i.id,
  canonical_path = '/marketing/' || i.slug || '/' || p.slug,
  payment_type = case
    when p.pricing_model = 'monthly' then 'subscription'
    when p.pricing_model in ('package', 'custom') then p.pricing_model
    else 'one_time'
  end,
  updated_at = now()
from public.catalog_industries i
where i.category_root = 'marketing'
  and i.slug = p.service_group
  and i.deleted_at is null
  and p.deleted_at is null;

-- ═══════════════════════════════════════════════════════════════════════════
-- 13. URL redirects (flat → hierarchical)
-- ═══════════════════════════════════════════════════════════════════════════

-- Software flat product URLs
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
select
  '/software/' || p.slug,
  p.canonical_path,
  true,
  true
from public.software_projects p
where p.deleted_at is null
  and p.canonical_path is not null
on conflict (from_path) do update set
  to_path = excluded.to_path,
  permanent = true,
  active = true,
  updated_at = now();

-- Websites flat product URLs
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
select
  '/websites/' || p.slug,
  p.canonical_path,
  true,
  true
from public.ecommerce_projects p
where p.deleted_at is null
  and p.canonical_path is not null
on conflict (from_path) do update set
  to_path = excluded.to_path,
  permanent = true,
  active = true,
  updated_at = now();

-- Creative-marketing showroom → /marketing
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
values ('/creative-marketing', '/marketing', true, true)
on conflict (from_path) do update set
  to_path = excluded.to_path,
  permanent = true,
  active = true,
  updated_at = now();

-- Creative-marketing product URLs → hierarchical marketing paths
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
select
  '/creative-marketing/' || p.slug,
  p.canonical_path,
  true,
  true
from public.creative_marketing_projects p
where p.deleted_at is null
  and p.canonical_path is not null
on conflict (from_path) do update set
  to_path = excluded.to_path,
  permanent = true,
  active = true,
  updated_at = now();

-- /ecommerce/{category} → /websites/{category}
insert into public.catalog_url_redirects (from_path, to_path, permanent, active)
select
  '/ecommerce/' || i.slug,
  '/websites/' || i.slug,
  true,
  true
from public.catalog_industries i
where i.category_root = 'websites'
  and i.deleted_at is null
  and i.active = true
on conflict (from_path) do update set
  to_path = excluded.to_path,
  permanent = true,
  active = true,
  updated_at = now();

-- ═══════════════════════════════════════════════════════════════════════════
-- 14. Seed same-industry related products (prev/next by sort_order)
-- ═══════════════════════════════════════════════════════════════════════════

-- Software adjacent links
insert into public.catalog_related_products (source_kind, source_id, related_kind, related_id, sort_order)
select
  'software',
  cur.id,
  'software',
  adj.id,
  adj.rel_order
from (
  select
    p.id,
    p.industry_id,
    p.sort_order,
    lag(p.id) over (partition by p.industry_id order by p.sort_order, p.id) as prev_id,
    lead(p.id) over (partition by p.industry_id order by p.sort_order, p.id) as next_id
  from public.software_projects p
  where p.deleted_at is null
    and p.industry_id is not null
) cur
cross join lateral (
  values
    (cur.prev_id, 10),
    (cur.next_id, 20)
) as adj(id, rel_order)
where adj.id is not null
on conflict (source_kind, source_id, related_kind, related_id) do update set
  sort_order = excluded.sort_order,
  updated_at = now();

-- Websites adjacent links
insert into public.catalog_related_products (source_kind, source_id, related_kind, related_id, sort_order)
select
  'websites',
  cur.id,
  'websites',
  adj.id,
  adj.rel_order
from (
  select
    p.id,
    p.industry_id,
    p.sort_order,
    lag(p.id) over (partition by p.industry_id order by p.sort_order, p.id) as prev_id,
    lead(p.id) over (partition by p.industry_id order by p.sort_order, p.id) as next_id
  from public.ecommerce_projects p
  where p.deleted_at is null
    and p.industry_id is not null
) cur
cross join lateral (
  values
    (cur.prev_id, 10),
    (cur.next_id, 20)
) as adj(id, rel_order)
where adj.id is not null
on conflict (source_kind, source_id, related_kind, related_id) do update set
  sort_order = excluded.sort_order,
  updated_at = now();

-- Marketing adjacent links
insert into public.catalog_related_products (source_kind, source_id, related_kind, related_id, sort_order)
select
  'marketing',
  cur.id,
  'marketing',
  adj.id,
  adj.rel_order
from (
  select
    p.id,
    p.industry_id,
    p.sort_order,
    lag(p.id) over (partition by p.industry_id order by p.sort_order, p.id) as prev_id,
    lead(p.id) over (partition by p.industry_id order by p.sort_order, p.id) as next_id
  from public.creative_marketing_projects p
  where p.deleted_at is null
    and p.industry_id is not null
) cur
cross join lateral (
  values
    (cur.prev_id, 10),
    (cur.next_id, 20)
) as adj(id, rel_order)
where adj.id is not null
on conflict (source_kind, source_id, related_kind, related_id) do update set
  sort_order = excluded.sort_order,
  updated_at = now();

-- ═══════════════════════════════════════════════════════════════════════════
-- 15. Update software_project_cards view
-- ═══════════════════════════════════════════════════════════════════════════

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
  ci.name as industry_name,
  ci.slug as industry_slug,
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
  on ch.id = p.child_category_id and ch.deleted_at is null
left join public.catalog_industries ci
  on ci.id = p.industry_id and ci.deleted_at is null;

grant select on public.software_project_cards to anon, authenticated, service_role;

-- ═══════════════════════════════════════════════════════════════════════════
-- 16. Update ecommerce_project_cards + creative_marketing_project_cards views
-- ═══════════════════════════════════════════════════════════════════════════

drop view if exists public.ecommerce_project_cards;

create or replace view public.ecommerce_project_cards
with (security_invoker = true) as
select
  p.id,
  p.title,
  p.slug,
  p.short_description,
  p.category_id,
  p.technology_stack,
  p.website_type,
  p.industry,
  p.industry_id,
  p.canonical_path,
  p.badge,
  p.business_size,
  p.package_tier,
  p.payment_type,
  p.cover_image_url,
  p.cover_fallback_url,
  p.starting_price,
  p.currency,
  p.featured,
  p.published,
  p.sort_order,
  p.created_at,
  p.updated_at,
  p.deleted_at,
  c.name as category_name,
  c.slug as category_slug,
  ci.name as industry_name,
  ci.slug as industry_slug,
  (
    select count(*)::int
    from public.ecommerce_project_pages pg
    where pg.project_id = p.id
      and pg.deleted_at is null
      and pg.published = true
  ) as page_count
from public.ecommerce_projects p
left join public.ecommerce_categories c
  on c.id = p.category_id
  and c.deleted_at is null
left join public.catalog_industries ci
  on ci.id = p.industry_id and ci.deleted_at is null;

grant select on public.ecommerce_project_cards to anon, authenticated, service_role;

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
  on ci.id = p.industry_id and ci.deleted_at is null;

grant select on public.creative_marketing_project_cards to anon, authenticated, service_role;

notify pgrst, 'reload schema';
