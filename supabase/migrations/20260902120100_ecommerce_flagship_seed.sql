-- E-commerce flagship seed — 5 showroom solutions
-- Migrates ecommerce-website → automated-ecommerce

-- ─── E-commerce Solutions category ───
insert into public.categories (slug, name, description, icon, sort_order, is_active)
values (
  'ecommerce-solutions',
  'E-commerce Solutions',
  'Live demo storefronts from landing pages to full business suites. Choose your package and explore before you order.',
  '🛒',
  2,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

-- Shift web-app sort order
update public.categories set sort_order = 3, updated_at = now() where slug = 'web-app-solutions';
update public.categories set sort_order = 4, updated_at = now() where slug = 'digital-marketing';
update public.categories set sort_order = 5, updated_at = now() where slug = 'graphics-creative';

-- Remove legacy ecommerce from web-app (archive)
update public.products
set status = 'archived', updated_at = now()
where slug = 'ecommerce-website';

-- ─── Stage templates ───
insert into public.project_stage_templates (slug, name, description)
values
  ('landing-commerce', 'Landing Commerce Delivery', 'Fast landing page delivery workflow'),
  ('starter-store', 'Starter Store Delivery', 'Small store build workflow'),
  ('standard-store', 'Standard Store Delivery', 'Full store with customer accounts'),
  ('automated-store', 'Automated Store Delivery', 'Professional store with integrations'),
  ('premium-suite', 'Premium Suite Delivery', 'Enterprise e-commerce ERP delivery')
on conflict (slug) do update set name = excluded.name, description = excluded.description, updated_at = now();

-- Landing steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Requirements Review', 'Collect business info, product details, and brand assets', 1),
  ('Landing Design', 'Design conversion-focused hero, benefits, and order form', 2),
  ('Development', 'Build mobile-first landing with COD order form', 3),
  ('Client Review', 'Review and approve landing page', 4),
  ('Launch & Delivery', 'Deploy, configure Pixel-ready structure, handover', 5)
) as s(title, description, sort_order)
where t.slug = 'landing-commerce'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Starter steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Requirements', 'Business info, product list, categories', 1),
  ('UI Design', 'Storefront and admin preview design', 2),
  ('Development', 'Build catalog, cart, checkout', 3),
  ('Testing', 'Cross-device testing and QA', 4),
  ('Delivery', 'Deploy and handover admin access', 5)
) as s(title, description, sort_order)
where t.slug = 'starter-store'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Standard steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Requirements', 'Full business and catalog requirements', 1),
  ('Planning', 'Site map, feature scope, timeline', 2),
  ('UI/UX Design', 'Storefront and customer dashboard design', 3),
  ('Development', 'Build store with accounts, wishlist, coupons', 4),
  ('Integration', 'Payment, courier, analytics setup', 5),
  ('Testing', 'QA and client review', 6),
  ('Launch', 'Go live and training', 7)
) as s(title, description, sort_order)
where t.slug = 'standard-store'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Automated steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Requirements', 'Business, catalog, courier, payment preferences', 1),
  ('Planning', 'Workflow design and integration scope', 2),
  ('UI/UX', 'Storefront and operations dashboard', 3),
  ('Development', 'Core store and admin build', 4),
  ('Courier Integration', 'Courier automation architecture setup', 5),
  ('Payment Integration', 'Payment gateway-ready structure', 6),
  ('Tracking Setup', 'Pixel, CAPI-ready tracking', 7),
  ('QA', 'End-to-end testing', 8),
  ('Client Review', 'Review and feedback', 9),
  ('Launch', 'Production deployment', 10)
) as s(title, description, sort_order)
where t.slug = 'automated-store'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Premium steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Requirements', 'Full business audit and scope', 1),
  ('Planning', 'ERP-style workflow planning', 2),
  ('UI/UX Design', 'Advanced storefront and admin UX', 3),
  ('Development', 'Full platform development', 4),
  ('Product Setup', 'Catalog, variants, stock architecture', 5),
  ('Courier Integration', 'Multi-courier automation', 6),
  ('Payment Integration', 'Gateway and fraud checker architecture', 7),
  ('Analytics Setup', 'Revenue and customer analytics', 8),
  ('QA', 'Comprehensive testing', 9),
  ('Client Review', 'Stakeholder review cycles', 10),
  ('Launch', 'Production go-live', 11),
  ('Support Handover', 'Training and support period', 12)
) as s(title, description, sort_order)
where t.slug = 'premium-suite'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- ─── Flagship products ───
insert into public.products (
  category_id, name, slug, short_description, full_description,
  product_type, pricing_type, starting_price, currency, delivery_time,
  status, featured, popular, sort_order, keywords,
  target_customer, internal_demo_slug, showroom_featured,
  demo_url, preview_url, thumbnail, cover_image,
  seo_title, seo_description
)
select
  c.id, v.name, v.slug, v.short_desc, v.full_desc,
  'website', 'fixed', v.price, 'BDT', v.delivery,
  'published', v.featured, v.popular, v.sort_order, v.keywords,
  v.target, v.demo_slug, true,
  '/demo/ecommerce/' || v.demo_slug,
  '/showroom/covers/' || v.slug || '.svg',
  '/showroom/covers/' || v.slug || '.svg',
  '/showroom/covers/' || v.slug || '.svg',
  v.seo_title, v.seo_desc
from public.categories c
cross join (values
  (
    'Single Product Landing Commerce', 'single-product-landing',
    'Conversion-focused single product landing page with COD order form.',
    'A premium mobile-first landing page built for Facebook/Meta Ads sellers and single-product campaigns. Includes hero section, benefits, gallery, reviews, FAQ, COD order form, WhatsApp CTA, and Pixel-ready architecture.',
    2000.00, '3–5 days', true, true, 1,
    array['landing page', 'single product', 'cod', 'facebook ads', 'meta pixel'],
    'Facebook/Meta Ads sellers, single-product campaigns, COD sellers',
    'landing-commerce',
    'Single Product Landing Commerce | Bridge IT Park',
    'Conversion-focused single product landing page with COD order form for Bangladeshi online sellers.'
  ),
  (
    'Starter E-commerce Store', 'starter-ecommerce',
    'Clean online store with catalog, cart, checkout, and basic admin.',
    'Everything a small online seller needs: homepage, product listing, categories, search, cart, checkout with COD, order confirmation, and basic admin preview for product and order management.',
    5000.00, '7–10 days', true, true, 2,
    array['starter store', 'online shop', 'cod checkout', 'small business'],
    'Small online sellers starting their first store',
    'starter-store',
    'Starter E-commerce Store | Bridge IT Park',
    'Affordable starter online store with catalog, cart, checkout, and admin preview.'
  ),
  (
    'Standard E-commerce', 'standard-ecommerce',
    'Growing store with customer accounts, wishlist, coupons, and analytics.',
    'Full-featured store for growing businesses: customer accounts, wishlist, coupon codes, product variants, stock management, order status tracking, customer order history, basic analytics, and SEO-ready structure.',
    10000.00, '14–21 days', true, true, 3,
    array['standard ecommerce', 'wishlist', 'coupon', 'variants', 'customer account'],
    'Growing online stores ready to scale',
    'standard-store',
    'Standard E-commerce Store | Bridge IT Park',
    'Feature-rich e-commerce with customer accounts, wishlist, coupons, and stock management.'
  ),
  (
    'Automated E-commerce', 'automated-ecommerce',
    'Professional store with courier automation, fraud checker, and analytics.',
    'Built for professional Facebook and online sellers. Includes everything in Standard plus courier automation architecture, fraud checker, Meta Pixel, Conversion API-ready structure, payment gateway-ready setup, invoice generation, sales reports, and order analytics dashboard.',
    20000.00, '21–30 days', true, true, 4,
    array['automated ecommerce', 'courier automation', 'fraud checker', 'meta pixel', 'capi'],
    'Professional Facebook and online sellers',
    'automated-store',
    'Automated E-commerce | Bridge IT Park',
    'Professional e-commerce with courier automation, fraud checker, and conversion tracking.'
  ),
  (
    'Premium E-commerce Business Suite', 'premium-ecommerce',
    'Complete e-commerce ERP with advanced analytics and business management.',
    'Enterprise-grade solution for established brands: advanced catalog, purchase/stock-in architecture, returns management, revenue dashboard, customer analytics, product performance reports, role-ready admin, invoice, reports, Pixel/CAPI, SEO, and full business management tools.',
    50000.00, '30–45 days', true, true, 5,
    array['premium ecommerce', 'erp', 'business suite', 'analytics', 'enterprise'],
    'Established brands and growing online businesses',
    'premium-suite',
    'Premium E-commerce Business Suite | Bridge IT Park',
    'Complete e-commerce ERP with advanced analytics, stock management, and business tools.'
  )
) as v(name, slug, short_desc, full_desc, price, delivery, featured, popular, sort_order, keywords, target, demo_slug, seo_title, seo_desc)
where c.slug = 'ecommerce-solutions'
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  starting_price = excluded.starting_price,
  delivery_time = excluded.delivery_time,
  target_customer = excluded.target_customer,
  internal_demo_slug = excluded.internal_demo_slug,
  showroom_featured = excluded.showroom_featured,
  demo_url = excluded.demo_url,
  preview_url = excluded.preview_url,
  thumbnail = excluded.thumbnail,
  cover_image = excluded.cover_image,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = 'published',
  updated_at = now();

-- Link stage templates to products
insert into public.product_stage_templates (product_id, template_id)
select p.id, t.id
from public.products p
join public.project_stage_templates t on t.slug = replace(p.slug, '-ecommerce', '-store')
   or (p.slug = 'single-product-landing' and t.slug = 'landing-commerce')
   or (p.slug = 'automated-ecommerce' and t.slug = 'automated-store')
   or (p.slug = 'premium-ecommerce' and t.slug = 'premium-suite')
where p.slug in ('single-product-landing', 'starter-ecommerce', 'standard-ecommerce', 'automated-ecommerce', 'premium-ecommerce')
on conflict (product_id) do update set template_id = excluded.template_id;

-- Fix product_stage_templates join (cleaner approach)
delete from public.product_stage_templates
where product_id in (select id from public.products where slug in ('single-product-landing','starter-ecommerce','standard-ecommerce','automated-ecommerce','premium-ecommerce'));

insert into public.product_stage_templates (product_id, template_id)
select p.id, t.id from public.products p, public.project_stage_templates t
where (p.slug = 'single-product-landing' and t.slug = 'landing-commerce')
   or (p.slug = 'starter-ecommerce' and t.slug = 'starter-store')
   or (p.slug = 'standard-ecommerce' and t.slug = 'standard-store')
   or (p.slug = 'automated-ecommerce' and t.slug = 'automated-store')
   or (p.slug = 'premium-ecommerce' and t.slug = 'premium-suite');

-- ─── Packages (one per flagship) ───
insert into public.product_packages (product_id, name, subtitle, price, delivery_days, revision_count, highlighted, sort_order, active)
select p.id, 'Complete Package', p.short_description, p.starting_price,
  case p.slug
    when 'single-product-landing' then 5
    when 'starter-ecommerce' then 10
    when 'standard-ecommerce' then 21
    when 'automated-ecommerce' then 30
    else 45
  end,
  case p.slug when 'premium-ecommerce' then 5 else 2 end,
  true, 1, true
from public.products p
where p.slug in ('single-product-landing','starter-ecommerce','standard-ecommerce','automated-ecommerce','premium-ecommerce')
on conflict (product_id, name) do update set
  price = excluded.price,
  delivery_days = excluded.delivery_days,
  updated_at = now();

-- ─── Demo configs with feature flags ───
insert into public.ecommerce_demo_configs (product_id, package_type, feature_flags, admin_modules, product_limit, industry)
select p.id, p.slug,
  case p.slug
    when 'single-product-landing' then '{"landingOnly":true,"catalog":false,"cart":false,"checkout":true,"customerAccount":false,"wishlist":false,"coupon":false,"variants":false,"stock":false,"courierFlow":false,"paymentGatewayUi":false,"fraudCheckerUi":false,"analytics":false,"adminPreview":false,"search":false}'::jsonb
    when 'starter-ecommerce' then '{"landingOnly":false,"catalog":true,"cart":true,"checkout":true,"customerAccount":false,"wishlist":false,"coupon":false,"variants":false,"stock":false,"courierFlow":false,"paymentGatewayUi":false,"fraudCheckerUi":false,"analytics":false,"adminPreview":true,"search":true}'::jsonb
    when 'standard-ecommerce' then '{"landingOnly":false,"catalog":true,"cart":true,"checkout":true,"customerAccount":true,"wishlist":true,"coupon":true,"variants":true,"stock":true,"courierFlow":false,"paymentGatewayUi":false,"fraudCheckerUi":false,"analytics":true,"adminPreview":true,"search":true}'::jsonb
    when 'automated-ecommerce' then '{"landingOnly":false,"catalog":true,"cart":true,"checkout":true,"customerAccount":true,"wishlist":true,"coupon":true,"variants":true,"stock":true,"courierFlow":true,"paymentGatewayUi":true,"fraudCheckerUi":true,"analytics":true,"adminPreview":true,"search":true}'::jsonb
    else '{"landingOnly":false,"catalog":true,"cart":true,"checkout":true,"customerAccount":true,"wishlist":true,"coupon":true,"variants":true,"stock":true,"courierFlow":true,"paymentGatewayUi":true,"fraudCheckerUi":true,"analytics":true,"adminPreview":true,"search":true,"returns":true,"purchaseStock":true,"roleAdmin":true}'::jsonb
  end,
  case p.slug
    when 'single-product-landing' then '[]'::jsonb
    when 'starter-ecommerce' then '["products","orders"]'::jsonb
    when 'standard-ecommerce' then '["products","orders","customers","inventory"]'::jsonb
    when 'automated-ecommerce' then '["products","orders","customers","inventory","courier","analytics"]'::jsonb
    else '["products","orders","customers","inventory","courier","payments","analytics","reports","returns","purchases"]'::jsonb
  end,
  case p.slug when 'single-product-landing' then 1 else 10 end,
  'multi'
from public.products p
where p.slug in ('single-product-landing','starter-ecommerce','standard-ecommerce','automated-ecommerce','premium-ecommerce')
on conflict (product_id) do update set
  feature_flags = excluded.feature_flags,
  admin_modules = excluded.admin_modules,
  product_limit = excluded.product_limit,
  updated_at = now();

-- ─── Package features ───
insert into public.package_features (package_id, feature_text, included, sort_order)
select pk.id, f.text, f.included, f.ord
from public.product_packages pk
join public.products p on p.id = pk.product_id
cross join (values
  ('single-product-landing', 'Premium landing page', true, 1),
  ('single-product-landing', 'Hero product section', true, 2),
  ('single-product-landing', 'COD order form', true, 3),
  ('single-product-landing', 'WhatsApp CTA', true, 4),
  ('single-product-landing', 'Facebook Pixel-ready', true, 5),
  ('single-product-landing', 'Mobile-first design', true, 6),
  ('starter-ecommerce', 'Homepage & catalog', true, 1),
  ('starter-ecommerce', 'Cart & checkout', true, 2),
  ('starter-ecommerce', 'COD payment', true, 3),
  ('starter-ecommerce', 'Basic admin preview', true, 4),
  ('starter-ecommerce', 'Product management', true, 5),
  ('starter-ecommerce', 'Order management', true, 6),
  ('standard-ecommerce', 'Customer accounts', true, 1),
  ('standard-ecommerce', 'Wishlist', true, 2),
  ('standard-ecommerce', 'Coupon codes', true, 3),
  ('standard-ecommerce', 'Product variants', true, 4),
  ('standard-ecommerce', 'Stock management', true, 5),
  ('standard-ecommerce', 'Basic analytics', true, 6),
  ('standard-ecommerce', 'SEO-ready structure', true, 7),
  ('automated-ecommerce', 'Courier automation', true, 1),
  ('automated-ecommerce', 'Fraud checker', true, 2),
  ('automated-ecommerce', 'Meta Pixel & CAPI-ready', true, 3),
  ('automated-ecommerce', 'Payment gateway-ready', true, 4),
  ('automated-ecommerce', 'Invoice & reports', true, 5),
  ('automated-ecommerce', 'Order analytics', true, 6),
  ('premium-ecommerce', 'Advanced catalog & variants', true, 1),
  ('premium-ecommerce', 'Purchase/stock-in', true, 2),
  ('premium-ecommerce', 'Returns management', true, 3),
  ('premium-ecommerce', 'Revenue dashboard', true, 4),
  ('premium-ecommerce', 'Customer analytics', true, 5),
  ('premium-ecommerce', 'Role-ready admin', true, 6),
  ('premium-ecommerce', 'Business management tools', true, 7)
) as f(slug, text, included, ord)
where p.slug = f.slug and pk.name = 'Complete Package'
on conflict (package_id, sort_order) do update set feature_text = excluded.feature_text, included = excluded.included;

-- ─── Requirement fields (tier-scoped) ───
insert into public.product_requirement_fields (product_id, label, field_key, field_type, required, sort_order, options)
select p.id, r.label, r.field_key, r.field_type, r.required, r.sort_order, r.options::jsonb
from public.products p
cross join (values
  ('single-product-landing', 'Business Name', 'business_name', 'text', true, 1, '[]'),
  ('single-product-landing', 'Product Name', 'product_name', 'text', true, 2, '[]'),
  ('single-product-landing', 'Facebook Page URL', 'facebook_page', 'url', false, 3, '[]'),
  ('single-product-landing', 'Brand Colors', 'brand_colors', 'text', false, 4, '[]'),
  ('starter-ecommerce', 'Business Name', 'business_name', 'text', true, 1, '[]'),
  ('starter-ecommerce', 'Expected Product Count', 'product_count', 'number', true, 2, '[]'),
  ('starter-ecommerce', 'Product Category', 'product_category', 'text', true, 3, '[]'),
  ('starter-ecommerce', 'COD Required', 'cod_required', 'radio', true, 4, '["Yes","No"]'),
  ('standard-ecommerce', 'Business Name', 'business_name', 'text', true, 1, '[]'),
  ('standard-ecommerce', 'Business Type', 'business_type', 'select', true, 2, '["Retail","Wholesale","D2C","Other"]'),
  ('standard-ecommerce', 'Expected Product Count', 'product_count', 'number', true, 3, '[]'),
  ('standard-ecommerce', 'Courier Provider', 'courier_provider', 'select', false, 4, '["Steadfast","Pathao","RedX","eCourier","Other"]'),
  ('standard-ecommerce', 'Payment Gateway Preference', 'payment_gateway', 'select', false, 5, '["bKash","SSLCommerz","Both","COD Only"]'),
  ('automated-ecommerce', 'Business Name', 'business_name', 'text', true, 1, '[]'),
  ('automated-ecommerce', 'Facebook Page', 'facebook_page', 'url', true, 2, '[]'),
  ('automated-ecommerce', 'Current Website', 'existing_website', 'url', false, 3, '[]'),
  ('automated-ecommerce', 'Courier Provider', 'courier_provider', 'select', true, 4, '["Steadfast","Pathao","RedX","eCourier","Other"]'),
  ('automated-ecommerce', 'Payment Gateway', 'payment_gateway', 'select', true, 5, '["bKash","SSLCommerz","Both"]'),
  ('automated-ecommerce', 'Brand Colors', 'brand_colors', 'text', false, 6, '[]'),
  ('automated-ecommerce', 'Reference Website', 'reference_website', 'url', false, 7, '[]'),
  ('premium-ecommerce', 'Business Name', 'business_name', 'text', true, 1, '[]'),
  ('premium-ecommerce', 'Business Type', 'business_type', 'select', true, 2, '["Retail","Wholesale","D2C","Enterprise","Other"]'),
  ('premium-ecommerce', 'Expected Product Count', 'product_count', 'number', true, 3, '[]'),
  ('premium-ecommerce', 'Facebook Page', 'facebook_page', 'url', true, 4, '[]'),
  ('premium-ecommerce', 'Current Website', 'existing_website', 'url', false, 5, '[]'),
  ('premium-ecommerce', 'Courier Provider', 'courier_provider', 'select', true, 6, '["Steadfast","Pathao","RedX","eCourier","Multiple"]'),
  ('premium-ecommerce', 'Payment Gateway', 'payment_gateway', 'select', true, 7, '["bKash","SSLCommerz","Both","International"]'),
  ('premium-ecommerce', 'Required Integrations', 'integrations', 'textarea', false, 8, '[]'),
  ('premium-ecommerce', 'Additional Notes', 'additional_notes', 'textarea', false, 9, '[]')
) as r(slug, label, field_key, field_type, required, sort_order, options)
where p.slug = r.slug
on conflict (product_id, field_key) do update set
  label = excluded.label, field_type = excluded.field_type, required = excluded.required,
  sort_order = excluded.sort_order, options = excluded.options;

-- ─── FAQs ───
insert into public.product_faqs (product_id, question, answer, sort_order)
select p.id, f.q, f.a, f.ord
from public.products p
cross join (values
  ('single-product-landing', 'Can I run Facebook Ads to this page?', 'Yes. The landing is built Pixel-ready for Meta Ads campaigns.', 1),
  ('single-product-landing', 'Does it support COD?', 'Yes. Customers can place COD orders directly from the landing form.', 2),
  ('starter-ecommerce', 'How many products can I add?', 'The starter package supports up to 50 products. Contact us for more.', 1),
  ('starter-ecommerce', 'Is admin panel included?', 'Yes. You get a basic admin panel for products and orders.', 2),
  ('standard-ecommerce', 'Can customers create accounts?', 'Yes. Customer registration, order history, and wishlist are included.', 1),
  ('automated-ecommerce', 'Which couriers are supported?', 'We set up architecture for Steadfast, Pathao, RedX, and eCourier.', 1),
  ('premium-ecommerce', 'Is this suitable for large catalogs?', 'Yes. Premium supports advanced stock, variants, and ERP-style management.', 1)
) as f(slug, q, a, ord)
where p.slug = f.slug;

-- ─── Demo store categories (for store demos) ───
insert into public.demo_store_categories (demo_config_id, name, slug, icon, sort_order)
select c.id, cat.name, cat.slug, cat.icon, cat.ord
from public.ecommerce_demo_configs c
join public.products p on p.id = c.product_id
cross join (values
  ('Fashion', 'fashion', '👗', 1),
  ('Gadgets', 'gadgets', '📱', 2),
  ('Cosmetics', 'cosmetics', '💄', 3),
  ('Lifestyle', 'lifestyle', '🏠', 4)
) as cat(name, slug, icon, ord)
where p.slug != 'single-product-landing'
on conflict (demo_config_id, slug) do nothing;

-- ─── Demo store products ───
insert into public.demo_store_products (demo_config_id, category_id, name, slug, description, price, vertical, featured, sort_order)
select c.id, dc.id, pr.name, pr.slug, pr.product_desc, pr.price, pr.vert, pr.feat, pr.ord
from public.ecommerce_demo_configs c
join public.products p on p.id = c.product_id
cross join (values
  ('fashion', 'Premium Cotton Panjabi', 'cotton-panjabi', 'Handcrafted premium cotton panjabi for Eid and daily wear.', 2490.00, 'fashion', true, 1),
  ('fashion', 'Silk Sharee Collection', 'silk-sharee', 'Elegant silk sharee with matching blouse piece.', 4500.00, 'fashion', false, 2),
  ('gadgets', 'Wireless Earbuds Pro', 'wireless-earbuds', 'Premium noise-cancelling wireless earbuds with 24hr battery.', 1890.00, 'gadget', true, 3),
  ('gadgets', 'Smart Watch Series X', 'smart-watch-x', 'Fitness tracking smartwatch with heart rate monitor.', 3200.00, 'gadget', false, 4),
  ('cosmetics', 'Vitamin C Serum', 'vitamin-c-serum', 'Brightening vitamin C serum for glowing skin.', 890.00, 'cosmetics', true, 5),
  ('cosmetics', 'Matte Lipstick Set', 'matte-lipstick-set', 'Long-lasting matte lipstick set of 6 shades.', 650.00, 'cosmetics', false, 6),
  ('lifestyle', 'Scented Candle Set', 'scented-candles', 'Hand-poured soy wax candles in 3 fragrances.', 1200.00, 'lifestyle', false, 7),
  ('lifestyle', 'Bamboo Desk Organizer', 'desk-organizer', 'Eco-friendly bamboo desk organizer with phone stand.', 750.00, 'lifestyle', false, 8),
  ('fashion', 'Casual Polo T-Shirt', 'polo-tshirt', 'Breathable cotton polo for everyday comfort.', 890.00, 'fashion', false, 9),
  ('gadgets', 'Phone Ring Light', 'ring-light', 'Clip-on LED ring light for content creators.', 450.00, 'gadget', false, 10)
) as pr(cat, name, slug, product_desc, price, vert, feat, ord)
join public.demo_store_categories dc on dc.demo_config_id = c.id and dc.slug = pr.cat
where p.slug != 'single-product-landing'
on conflict (demo_config_id, slug) do nothing;

-- Landing demo hero product
insert into public.demo_store_products (demo_config_id, name, slug, description, price, vertical, featured, sort_order)
select c.id, 'Premium Wireless Earbuds', 'hero-earbuds',
  'Crystal-clear sound with active noise cancellation. Perfect for your Facebook ad campaign.',
  1290.00, 'gadget', true, 1
from public.ecommerce_demo_configs c
join public.products p on p.id = c.product_id
where p.slug = 'single-product-landing'
on conflict (demo_config_id, slug) do nothing;
