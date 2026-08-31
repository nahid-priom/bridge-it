-- Bridge IT Park — seed data
-- Idempotent: safe to re-run via ON CONFLICT upserts.

-- ─── Categories ───
insert into public.categories (slug, name, description, icon, sort_order, is_active)
values
  (
    'software-solutions',
    'Software Solutions',
    'Custom ERP, POS, HR & payroll, and business software tailored for growing companies.',
    '💻',
    1,
    true
  ),
  (
    'web-app-solutions',
    'Web & App Solutions',
    'E-commerce websites, business sites, and mobile apps built for performance and growth.',
    '🌐',
    2,
    true
  ),
  (
    'digital-marketing',
    'Digital Marketing',
    'Meta ads, SEO, social media management, and e-commerce growth strategies.',
    '📣',
    3,
    true
  ),
  (
    'graphics-creative',
    'Graphics & Creative',
    'Social media design, ad creatives, logos, and brand identity packages.',
    '🎨',
    4,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

-- ─── Products ───
insert into public.products (
  category_id, name, slug, short_description, full_description,
  product_type, pricing_type, starting_price, currency, delivery_time,
  status, featured, popular, sort_order, keywords
)
select
  c.id,
  v.name,
  v.slug,
  v.short_description,
  v.full_description,
  v.product_type,
  v.pricing_type,
  v.starting_price,
  'BDT',
  v.delivery_time,
  'published',
  v.featured,
  v.popular,
  v.sort_order,
  v.keywords
from public.categories c
cross join (
  values
    -- Software Solutions
    (
      'software-solutions', 'Custom ERP Software', 'custom-erp-software',
      'Tailored ERP systems for inventory, sales, accounting, and operations.',
      'We build custom ERP software that fits your business workflows — from inventory and sales to accounting and reporting. Ideal for SMEs scaling beyond spreadsheets.',
      'software', 'starting_from', 25000.00, '30–45 days', true, true, 1,
      array['erp', 'business software', 'inventory', 'accounting']
    ),
    (
      'software-solutions', 'POS & Inventory Software', 'pos-inventory-software',
      'Point-of-sale and stock management for retail and wholesale businesses.',
      'Complete POS and inventory management with barcode support, sales reports, low-stock alerts, and multi-branch readiness.',
      'software', 'starting_from', 15000.00, '14–21 days', true, true, 2,
      array['pos', 'inventory', 'retail', 'stock management']
    ),
    (
      'software-solutions', 'HR & Payroll Software', 'hr-payroll-software',
      'Employee management, attendance, and payroll automation.',
      'Manage employees, attendance, leave, and payroll calculations with payslip generation and compliance-friendly reporting.',
      'software', 'starting_from', 20000.00, '21–30 days', false, false, 3,
      array['hr', 'payroll', 'attendance', 'employee management']
    ),
    -- Web & App Solutions
    (
      'web-app-solutions', 'E-commerce Website', 'ecommerce-website',
      'Full-featured online store with admin panel, payments, and courier integration.',
      'Launch a high-performance e-commerce website with product management, order tracking, courier automation, and marketing integrations.',
      'website', 'package', 20000.00, '14–21 days', true, true, 1,
      array['ecommerce', 'online store', 'shop', 'woocommerce', 'nextjs']
    ),
    (
      'web-app-solutions', 'Business Website', 'business-website',
      'Professional company website with modern design and SEO basics.',
      'A polished business website with service pages, contact forms, mobile responsiveness, and foundational SEO.',
      'website', 'starting_from', 8000.00, '7–10 days', true, false, 2,
      array['business website', 'corporate', 'company profile']
    ),
    (
      'web-app-solutions', 'Mobile App Development', 'mobile-app-development',
      'Custom Android and iOS apps for your business or product idea.',
      'End-to-end mobile app development — UI/UX, backend APIs, app store deployment support, and post-launch maintenance options.',
      'service', 'custom_quote', 40000.00, '30–60 days', true, true, 3,
      array['mobile app', 'android', 'ios', 'flutter', 'react native']
    ),
    -- Digital Marketing
    (
      'digital-marketing', 'Meta Ads Management', 'meta-ads-management',
      'Facebook & Instagram ad campaigns managed by experts.',
      'Strategy, creative direction, campaign setup, optimization, and monthly performance reporting for Meta platforms.',
      'marketing', 'starting_from', 10000.00, 'Ongoing monthly', true, true, 1,
      array['meta ads', 'facebook ads', 'instagram ads', 'paid social']
    ),
    (
      'digital-marketing', 'SEO Service', 'seo-service',
      'Search engine optimization to grow organic traffic.',
      'Technical SEO audit, on-page optimization, content recommendations, and monthly ranking/traffic reports.',
      'marketing', 'starting_from', 7000.00, 'Ongoing monthly', false, true, 2,
      array['seo', 'google ranking', 'organic traffic', 'search']
    ),
    (
      'digital-marketing', 'Complete E-commerce Growth', 'ecommerce-growth',
      'Full-funnel growth: ads, SEO, CRO, and analytics for online stores.',
      'Integrated e-commerce growth program covering paid ads, SEO, conversion optimization, Meta Pixel, and analytics dashboards.',
      'marketing', 'starting_from', 18000.00, 'Ongoing monthly', true, false, 3,
      array['ecommerce growth', 'cro', 'analytics', 'conversion']
    ),
    -- Graphics & Creative
    (
      'graphics-creative', 'Social Media Creative Design', 'social-media-design',
      'Scroll-stopping posts, stories, and ad creatives for your brand.',
      'Monthly social media design packages — posts, stories, reels covers, and ad creatives aligned with your brand guidelines.',
      'creative', 'starting_from', 2500.00, '3–5 days per batch', false, true, 1,
      array['social media design', 'posts', 'stories', 'creative']
    ),
    (
      'graphics-creative', 'Logo & Brand Identity', 'logo-brand-identity',
      'Logo design and complete brand identity system.',
      'Logo concepts, color palette, typography, brand guidelines, and deliverables for print and digital use.',
      'creative', 'starting_from', 5000.00, '7–14 days', true, true, 2,
      array['logo', 'brand identity', 'branding', 'design']
    )
) as v(
  category_slug, name, slug, short_description, full_description,
  product_type, pricing_type, starting_price, delivery_time,
  featured, popular, sort_order, keywords
)
where c.slug = v.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  product_type = excluded.product_type,
  pricing_type = excluded.pricing_type,
  starting_price = excluded.starting_price,
  currency = excluded.currency,
  delivery_time = excluded.delivery_time,
  status = excluded.status,
  featured = excluded.featured,
  popular = excluded.popular,
  sort_order = excluded.sort_order,
  keywords = excluded.keywords,
  updated_at = now();

-- ─── E-commerce Website packages ───
update public.product_packages pp
set
  subtitle = v.subtitle,
  price = v.price,
  delivery_days = v.delivery_days,
  revision_count = v.revision_count,
  highlighted = v.highlighted,
  badge_text = v.badge_text,
  sort_order = v.sort_order,
  active = true,
  updated_at = now()
from public.products p
cross join (
  values
    ('ecommerce-website', 'Basic', 'Essential store for startups', 20000.00, 14, 2, false, null::text, 1),
    ('ecommerce-website', 'Business', 'Growth-ready with automation', 35000.00, 21, 3, true, 'Most Popular', 2),
    ('ecommerce-website', 'Premium', 'Full-featured enterprise store', 60000.00, 30, 5, false, 'Best Value', 3)
) as v(product_slug, pkg_name, subtitle, price, delivery_days, revision_count, highlighted, badge_text, sort_order)
where p.slug = v.product_slug
  and pp.product_id = p.id
  and pp.name = v.pkg_name;

insert into public.product_packages (
  product_id, name, subtitle, price, currency, billing_type,
  delivery_days, revision_count, highlighted, badge_text, sort_order, active
)
select
  p.id, v.pkg_name, v.subtitle, v.price, 'BDT', 'one_time',
  v.delivery_days, v.revision_count, v.highlighted, v.badge_text, v.sort_order, true
from public.products p
cross join (
  values
    ('ecommerce-website', 'Basic', 'Essential store for startups', 20000.00, 14, 2, false, null::text, 1),
    ('ecommerce-website', 'Business', 'Growth-ready with automation', 35000.00, 21, 3, true, 'Most Popular', 2),
    ('ecommerce-website', 'Premium', 'Full-featured enterprise store', 60000.00, 30, 5, false, 'Best Value', 3)
) as v(product_slug, pkg_name, subtitle, price, delivery_days, revision_count, highlighted, badge_text, sort_order)
where p.slug = v.product_slug
  and not exists (
    select 1 from public.product_packages pp
    where pp.product_id = p.id and pp.name = v.pkg_name
  );

-- ─── Package features (E-commerce Website — all 3 packages) ───
-- Feature matrix: Basic (6/10), Business (8/10), Premium (10/10)
insert into public.package_features (package_id, feature_text, included, sort_order)
select pp.id, f.feature_text, f.included, f.sort_order
from public.product_packages pp
join public.products p on p.id = pp.product_id
cross join (
  values
    ('Basic', 'High Performance', true, 1),
    ('Basic', 'Mobile Responsive', true, 2),
    ('Basic', 'Admin Dashboard', true, 3),
    ('Basic', 'Product Management', true, 4),
    ('Basic', 'Order Management', true, 5),
    ('Basic', 'Courier Automation', true, 6),
    ('Basic', 'Fraud Checker', false, 7),
    ('Basic', 'Meta Pixel', false, 8),
    ('Basic', 'Analytics', false, 9),
    ('Basic', 'Basic SEO', false, 10),
    ('Business', 'High Performance', true, 1),
    ('Business', 'Mobile Responsive', true, 2),
    ('Business', 'Admin Dashboard', true, 3),
    ('Business', 'Product Management', true, 4),
    ('Business', 'Order Management', true, 5),
    ('Business', 'Courier Automation', true, 6),
    ('Business', 'Fraud Checker', true, 7),
    ('Business', 'Meta Pixel', true, 8),
    ('Business', 'Analytics', false, 9),
    ('Business', 'Basic SEO', false, 10),
    ('Premium', 'High Performance', true, 1),
    ('Premium', 'Mobile Responsive', true, 2),
    ('Premium', 'Admin Dashboard', true, 3),
    ('Premium', 'Product Management', true, 4),
    ('Premium', 'Order Management', true, 5),
    ('Premium', 'Courier Automation', true, 6),
    ('Premium', 'Fraud Checker', true, 7),
    ('Premium', 'Meta Pixel', true, 8),
    ('Premium', 'Analytics', true, 9),
    ('Premium', 'Basic SEO', true, 10)
) as f(pkg_name, feature_text, included, sort_order)
where p.slug = 'ecommerce-website'
  and pp.name = f.pkg_name
on conflict (package_id, sort_order) do update set
  feature_text = excluded.feature_text,
  included = excluded.included;

-- ─── Requirement fields (E-commerce Website) ───
insert into public.product_requirement_fields (
  product_id, label, field_key, field_type, placeholder, help_text,
  required, options, sort_order, active
)
select
  p.id,
  v.label,
  v.field_key,
  v.field_type,
  v.placeholder,
  v.help_text,
  v.required,
  v.options::jsonb,
  v.sort_order,
  true
from public.products p
cross join (
  values
    ('Business Name', 'business_name', 'text', 'Your company or store name', null, true, '[]', 1),
    ('Existing Website', 'existing_website', 'url', 'https://example.com', 'Leave blank if this is a new store', false, '[]', 2),
    ('Product Category', 'product_category', 'text', 'e.g. Fashion, Electronics, Grocery', 'What type of products will you sell?', true, '[]', 3),
    ('Approximate Product Count', 'product_count', 'number', '50', 'Rough number of products at launch', true, '[]', 4),
    (
      'Courier Provider', 'courier_provider', 'select', null,
      'Which courier services do you prefer?',
      true,
      '["Steadfast","Pathao","RedX","eCourier","Other"]',
      5
    ),
    ('Preferred Design', 'preferred_design', 'textarea', 'Describe your preferred style, colors, or reference sites', null, false, '[]', 6),
    ('Facebook Page', 'facebook_page', 'url', 'https://facebook.com/yourpage', null, false, '[]', 7),
    ('Additional Requirements', 'additional_requirements', 'textarea', 'Any other details we should know', null, false, '[]', 8)
) as v(label, field_key, field_type, placeholder, help_text, required, options, sort_order)
where p.slug = 'ecommerce-website'
on conflict (product_id, field_key) do update set
  label = excluded.label,
  field_type = excluded.field_type,
  placeholder = excluded.placeholder,
  help_text = excluded.help_text,
  required = excluded.required,
  options = excluded.options,
  sort_order = excluded.sort_order,
  active = true,
  updated_at = now();

-- ─── Portfolio items ───
insert into public.portfolio_items (
  title, slug, category, client_name, description,
  featured, status, sort_order
)
values
  (
    'TechCorp BD E-commerce Store',
    'techcorp-bd-ecommerce',
    'Web & App Solutions',
    'TechCorp BD',
    'Full e-commerce build with product catalog, bKash payments, courier automation, and admin dashboard for a growing electronics retailer.',
    true,
    'published',
    1
  ),
  (
    'ShopBase Brand Identity',
    'shopbase-brand-identity',
    'Graphics & Creative',
    'ShopBase',
    'Complete logo and brand identity system including color palette, typography, and social media templates.',
    true,
    'published',
    2
  ),
  (
    'GreenMart Meta Ads Campaign',
    'greenmart-meta-ads',
    'Digital Marketing',
    'GreenMart',
    'Meta ads strategy and creative management that increased online sales by 3x over six months for a grocery delivery brand.',
    true,
    'published',
    3
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  client_name = excluded.client_name,
  description = excluded.description,
  featured = excluded.featured,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ─── Reviews ───
delete from public.reviews r
using (
  values
    ('Afif Hossain', 1),
    ('Jannatul Ferdous', 2),
    ('Riyad Mahmud', 3)
) as seed(client_name, sort_order)
where r.client_name = seed.client_name
  and r.sort_order = seed.sort_order
  and r.product_id is null;

insert into public.reviews (
  client_name, company_name, designation, rating, review,
  featured, approved, sort_order
)
values
  (
    'Afif Hossain', 'TechCorp BD', 'CEO', 5,
    'Bridge IT Park built our ecommerce website exactly how we needed. Professional team and fast delivery!',
    true, true, 1
  ),
  (
    'Jannatul Ferdous', null, 'Marketing Manager', 5,
    'Their Meta ads management increased our online sales significantly. Highly recommended!',
    true, true, 2
  ),
  (
    'Riyad Mahmud', 'ShopBase', 'Founder', 5,
    'From website to branding — Bridge IT Park handled everything. Great experience throughout.',
    true, true, 3
  );

-- ─── Site settings ───
insert into public.site_settings (key, value, is_public)
values
  ('brand_name', '"Bridge IT Park"'::jsonb, true),
  ('tagline', '"Build. Market. Grow."'::jsonb, true),
  ('hero_badge', '"Your Complete Digital Business Partner"'::jsonb, true),
  (
    'hero_title',
    '["Build. Market. Grow.","Your Business,","All in One Place."]'::jsonb,
    true
  ),
  (
    'hero_description',
    '"Software, Website, Digital Marketing & Creative Solutions for Growing Businesses."'::jsonb,
    true
  ),
  ('hero_primary_cta', '"Explore Solutions"'::jsonb, true),
  ('hero_secondary_cta', '"Get Free Consultation"'::jsonb, true),
  ('phone', '"+880 1XXX-XXXXXX"'::jsonb, true),
  ('email', '"support@bridgeitpark.com"'::jsonb, true),
  ('whatsapp', '"+880 1XXX-XXXXXX"'::jsonb, true),
  ('address', '"Dhaka, Bangladesh"'::jsonb, true),
  ('facebook', '"https://facebook.com/bridgeitpark"'::jsonb, true),
  ('linkedin', '"https://linkedin.com/company/bridgeitpark"'::jsonb, true),
  (
    'footer_description',
    '"Your complete digital business partner. Software, websites, marketing, and creative solutions for growing businesses."'::jsonb,
    true
  ),
  (
    'trust_stats',
    '[
      {"id":"solutions","label":"Digital Solutions","value":null},
      {"id":"projects","label":"Projects Delivered","value":null},
      {"id":"satisfaction","label":"Client Satisfaction","value":null},
      {"id":"support","label":"Dedicated Support","value":null}
    ]'::jsonb,
    true
  ),
  ('cta_title', '"Ready to Take Your Business Digital?"'::jsonb, true),
  (
    'cta_subtitle',
    '"Get a free consultation and discover the right solution for your business."'::jsonb,
    true
  )
on conflict (key) do update set
  value = excluded.value,
  is_public = excluded.is_public,
  updated_at = now();
