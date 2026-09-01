-- Web & App, Digital Marketing, Graphics & Creative — packages, features, requirements, FAQs, delivery stages
-- Idempotent upserts for the 3 remaining major BITP categories.

-- ─── Category polish ───
update public.categories set
  description = 'Professional business websites and custom mobile apps built for performance, SEO, and growth.',
  updated_at = now()
where slug = 'web-app-solutions';

update public.categories set
  description = 'Meta ads, SEO, social media, and full-funnel e-commerce growth — managed by experts with transparent reporting.',
  updated_at = now()
where slug = 'digital-marketing';

update public.categories set
  description = 'Social media creatives, ad designs, logos, and complete brand identity packages for growing brands.',
  updated_at = now()
where slug = 'graphics-creative';

-- ─── Product SEO / metadata refresh ───
update public.products set
  seo_title = case slug
    when 'business-website' then 'Business Website Development | Bridge IT Park'
    when 'mobile-app-development' then 'Mobile App Development | Bridge IT Park'
    when 'meta-ads-management' then 'Meta Ads Management | Bridge IT Park'
    when 'seo-service' then 'SEO Service Bangladesh | Bridge IT Park'
    when 'ecommerce-growth' then 'E-commerce Growth Marketing | Bridge IT Park'
    when 'social-media-design' then 'Social Media Design Packages | Bridge IT Park'
    when 'logo-brand-identity' then 'Logo & Brand Identity Design | Bridge IT Park'
    else seo_title
  end,
  seo_description = case slug
    when 'business-website' then 'Starting from ৳8,000 — professional company websites with SEO basics and mobile-first design.'
    when 'mobile-app-development' then 'Custom Android & iOS apps — MVP to enterprise. Starting from ৳40,000.'
    when 'meta-ads-management' then 'Facebook & Instagram ads managed monthly — strategy, creative, optimization, reporting.'
    when 'seo-service' then 'Technical and on-page SEO to grow organic traffic — monthly packages from ৳7,000.'
    when 'ecommerce-growth' then 'Full-funnel e-commerce growth: ads, SEO, CRO, and analytics.'
    when 'social-media-design' then 'Monthly social media post, story, and ad creative design packages.'
    when 'logo-brand-identity' then 'Logo design and brand identity systems — from logo-only to full guidelines.'
    else seo_description
  end,
  target_customer = case slug
    when 'business-website' then 'SMEs, startups, and service businesses needing a professional online presence.'
    when 'mobile-app-development' then 'Businesses and founders launching a product or internal mobile tool.'
    when 'meta-ads-management' then 'E-commerce brands, local businesses, and agencies needing paid social growth.'
    when 'seo-service' then 'Websites and stores wanting sustainable organic traffic from Google.'
    when 'ecommerce-growth' then 'Online stores ready for integrated ads, SEO, and conversion optimization.'
    when 'social-media-design' then 'Brands needing consistent, on-brand social content every month.'
    when 'logo-brand-identity' then 'New businesses and rebrands needing a memorable visual identity.'
    else target_customer
  end,
  updated_at = now()
where slug in (
  'business-website', 'mobile-app-development',
  'meta-ads-management', 'seo-service', 'ecommerce-growth',
  'social-media-design', 'logo-brand-identity'
);

-- ─── Stage templates ───
insert into public.project_stage_templates (slug, name, description)
values
  ('business-website-delivery', 'Business Website Delivery', 'Corporate / service website build workflow'),
  ('mobile-app-delivery', 'Mobile App Delivery', 'Custom mobile app development workflow'),
  ('meta-ads-delivery', 'Meta Ads Onboarding', 'Campaign setup and monthly optimization workflow'),
  ('seo-delivery', 'SEO Service Delivery', 'Monthly SEO audit and optimization workflow'),
  ('ecommerce-growth-delivery', 'E-commerce Growth Delivery', 'Integrated growth program workflow'),
  ('social-design-delivery', 'Social Media Design Delivery', 'Monthly creative batch workflow'),
  ('brand-identity-delivery', 'Brand Identity Delivery', 'Logo and brand system delivery workflow')
on conflict (slug) do update set name = excluded.name, description = excluded.description, updated_at = now();

-- Business website steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.step_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Order Confirmed', 'Confirm scope, package, and timeline', 1),
  ('Content Collection', 'Gather company info, services, and brand assets', 2),
  ('Wireframe & Design', 'Homepage and key page designs for approval', 3),
  ('Development', 'Build responsive pages with forms and SEO basics', 4),
  ('Client Review', 'Review on staging and collect revisions', 5),
  ('Launch', 'Deploy, connect domain, and handover', 6)
) as s(title, step_description, sort_order)
where t.slug = 'business-website-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Mobile app steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.step_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Order Confirmed', 'Kickoff and assign project team', 1),
  ('Discovery & Scope', 'Define features, users, and platforms', 2),
  ('UI/UX Design', 'App screens and user flow design', 3),
  ('Development Sprint 1', 'Core features and authentication', 4),
  ('Development Sprint 2', 'Remaining features and integrations', 5),
  ('Testing & QA', 'Device testing and bug fixes', 6),
  ('App Store Submission', 'Prepare listings and submit', 7),
  ('Launch & Handover', 'Go live and documentation', 8)
) as s(title, step_description, sort_order)
where t.slug = 'mobile-app-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Meta ads steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.step_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Onboarding', 'Account access, pixel check, goals alignment', 1),
  ('Strategy & Setup', 'Audience, budget, and campaign structure', 2),
  ('Creative Launch', 'Ad sets live with tracking verified', 3),
  ('Optimization', 'Weekly bid, audience, and creative tuning', 4),
  ('Monthly Report', 'Performance summary and next-month plan', 5)
) as s(title, step_description, sort_order)
where t.slug = 'meta-ads-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- SEO steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.step_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Site Audit', 'Technical and on-page baseline audit', 1),
  ('Keyword Strategy', 'Target keywords and content gaps', 2),
  ('On-Page Fixes', 'Meta tags, headings, internal links', 3),
  ('Content Recommendations', 'Blog and landing page suggestions', 4),
  ('Monthly Report', 'Rankings, traffic, and action items', 5)
) as s(title, step_description, sort_order)
where t.slug = 'seo-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Social design steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.step_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Brand Brief', 'Collect brand colors, tone, and references', 1),
  ('Content Calendar', 'Plan posts and formats for the batch', 2),
  ('Design Drafts', 'First creative drafts for review', 3),
  ('Revisions', 'Apply feedback and finalize', 4),
  ('Delivery', 'Export files in required sizes', 5)
) as s(title, step_description, sort_order)
where t.slug = 'social-design-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Brand identity steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.step_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Discovery', 'Brand questionnaire and competitor review', 1),
  ('Concepts', 'Logo concept presentations', 2),
  ('Refinement', 'Selected concept refined', 3),
  ('Brand System', 'Colors, typography, applications', 4),
  ('Guidelines & Delivery', 'Brand guide PDF and source files', 5)
) as s(title, step_description, sort_order)
where t.slug = 'brand-identity-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Copy meta-ads steps to ecommerce-growth delivery
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
join public.project_stage_templates src on src.slug = 'meta-ads-delivery'
join public.project_stage_template_steps s on s.template_id = src.id
where t.slug = 'ecommerce-growth-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- ─── Packages ───
insert into public.product_packages (
  product_id, name, subtitle, price, currency, billing_type,
  delivery_days, revision_count, highlighted, badge_text, sort_order, active
)
select p.id, v.pkg_name, v.subtitle, v.price, 'BDT', v.billing,
  v.days, v.revisions, v.highlighted, v.badge, v.sort_order, true
from public.products p
cross join (values
  -- Web & App
  ('business-website', 'Starter', 'Up to 5 pages, contact form, mobile responsive', 8000.00, 'one_time', 7, 2, false, null::text, 1),
  ('business-website', 'Business', 'Up to 10 pages, blog, SEO basics, analytics', 15000.00, 'one_time', 10, 3, true, 'Most Popular', 2),
  ('business-website', 'Premium', 'Unlimited pages, CMS, advanced SEO, speed optimization', 25000.00, 'one_time', 14, 5, false, 'Best Value', 3),
  ('mobile-app-development', 'MVP', 'Core features, single platform (Android or iOS)', 40000.00, 'one_time', 30, 2, false, null::text, 1),
  ('mobile-app-development', 'Business', 'Full feature set, both platforms, admin panel', 80000.00, 'one_time', 45, 3, true, 'Most Popular', 2),
  ('mobile-app-development', 'Enterprise', 'Custom scope, API integrations, dedicated support', 150000.00, 'one_time', 60, 5, false, 'Custom Scope', 3),
  -- Digital Marketing
  ('meta-ads-management', 'Starter', '1 campaign, 2 ad sets, basic reporting', 10000.00, 'monthly', 7, 1, false, null::text, 1),
  ('meta-ads-management', 'Growth', '3 campaigns, A/B testing, weekly optimization', 18000.00, 'monthly', 7, 2, true, 'Most Popular', 2),
  ('meta-ads-management', 'Scale', 'Unlimited campaigns, creative strategy, advanced analytics', 30000.00, 'monthly', 7, 3, false, 'Best ROI', 3),
  ('seo-service', 'Basic', '5 pages optimized, monthly audit report', 7000.00, 'monthly', 14, 1, false, null::text, 1),
  ('seo-service', 'Standard', '15 pages, content recommendations, keyword tracking', 12000.00, 'monthly', 14, 2, true, 'Most Popular', 2),
  ('seo-service', 'Advanced', 'Full site, technical SEO, content strategy', 20000.00, 'monthly', 14, 3, false, 'Full Site', 3),
  ('ecommerce-growth', 'Growth', 'Meta ads + basic SEO + monthly CRO review', 18000.00, 'monthly', 14, 2, false, null::text, 1),
  ('ecommerce-growth', 'Accelerate', 'Full funnel: ads, SEO, pixel, analytics dashboard', 35000.00, 'monthly', 14, 3, true, 'Most Popular', 2),
  ('ecommerce-growth', 'Enterprise', 'Dedicated strategist, multi-channel, custom reporting', 60000.00, 'monthly', 14, 5, false, 'Enterprise', 3),
  -- Graphics & Creative
  ('social-media-design', 'Basic', '10 posts + 5 stories per month', 2500.00, 'monthly', 5, 2, false, null::text, 1),
  ('social-media-design', 'Standard', '20 posts + 10 stories + 4 ad creatives', 5000.00, 'monthly', 5, 3, true, 'Most Popular', 2),
  ('social-media-design', 'Premium', '30 posts + 15 stories + 8 ad creatives + reels covers', 10000.00, 'monthly', 5, 4, false, 'Full Coverage', 3),
  ('logo-brand-identity', 'Logo Only', '3 concepts, 2 revision rounds, final files', 5000.00, 'one_time', 7, 2, false, null::text, 1),
  ('logo-brand-identity', 'Brand Starter', 'Logo + colors + typography + social templates', 12000.00, 'one_time', 10, 3, true, 'Most Popular', 2),
  ('logo-brand-identity', 'Full Identity', 'Complete brand system + guidelines PDF + stationery', 25000.00, 'one_time', 14, 5, false, 'Complete', 3)
) as v(product_slug, pkg_name, subtitle, price, billing, days, revisions, highlighted, badge, sort_order)
where p.slug = v.product_slug
on conflict (product_id, name) do update set
  subtitle = excluded.subtitle,
  price = excluded.price,
  billing_type = excluded.billing_type,
  delivery_days = excluded.delivery_days,
  revision_count = excluded.revision_count,
  highlighted = excluded.highlighted,
  badge_text = excluded.badge_text,
  sort_order = excluded.sort_order,
  active = true,
  updated_at = now();

-- Sync starting_price from lowest active package
update public.products p set
  starting_price = sub.min_price,
  updated_at = now()
from (
  select pp.product_id, min(pp.price) as min_price
  from public.product_packages pp
  where pp.active = true
  group by pp.product_id
) sub
where p.id = sub.product_id
  and p.slug in (
    'business-website', 'mobile-app-development',
    'meta-ads-management', 'seo-service', 'ecommerce-growth',
    'social-media-design', 'logo-brand-identity'
  );

-- ─── Package features ───
insert into public.package_features (package_id, feature_text, included, sort_order)
select pp.id, f.feature_text, f.included, f.sort_order
from public.product_packages pp
join public.products p on p.id = pp.product_id
cross join (values
  -- business-website Starter
  ('business-website', 'Starter', 'Up to 5 pages', true, 1),
  ('business-website', 'Starter', 'Mobile responsive', true, 2),
  ('business-website', 'Starter', 'Contact form', true, 3),
  ('business-website', 'Starter', 'Basic SEO', true, 4),
  ('business-website', 'Starter', 'Blog section', false, 5),
  ('business-website', 'Starter', 'Google Analytics', false, 6),
  ('business-website', 'Starter', 'CMS admin', false, 7),
  -- business-website Business
  ('business-website', 'Business', 'Up to 10 pages', true, 1),
  ('business-website', 'Business', 'Mobile responsive', true, 2),
  ('business-website', 'Business', 'Contact form', true, 3),
  ('business-website', 'Business', 'Basic SEO', true, 4),
  ('business-website', 'Business', 'Blog section', true, 5),
  ('business-website', 'Business', 'Google Analytics', true, 6),
  ('business-website', 'Business', 'CMS admin', false, 7),
  -- business-website Premium
  ('business-website', 'Premium', 'Unlimited pages', true, 1),
  ('business-website', 'Premium', 'Mobile responsive', true, 2),
  ('business-website', 'Premium', 'Contact form', true, 3),
  ('business-website', 'Premium', 'Advanced SEO', true, 4),
  ('business-website', 'Premium', 'Blog section', true, 5),
  ('business-website', 'Premium', 'Google Analytics', true, 6),
  ('business-website', 'Premium', 'CMS admin', true, 7),
  -- mobile-app MVP
  ('mobile-app-development', 'MVP', 'Single platform (Android or iOS)', true, 1),
  ('mobile-app-development', 'MVP', 'Up to 8 screens', true, 2),
  ('mobile-app-development', 'MVP', 'User authentication', true, 3),
  ('mobile-app-development', 'MVP', 'Push notifications', false, 4),
  ('mobile-app-development', 'MVP', 'Admin panel', false, 5),
  ('mobile-app-development', 'MVP', 'Both platforms', false, 6),
  -- mobile-app Business
  ('mobile-app-development', 'Business', 'Both Android & iOS', true, 1),
  ('mobile-app-development', 'Business', 'Up to 20 screens', true, 2),
  ('mobile-app-development', 'Business', 'User authentication', true, 3),
  ('mobile-app-development', 'Business', 'Push notifications', true, 4),
  ('mobile-app-development', 'Business', 'Admin panel', true, 5),
  ('mobile-app-development', 'Business', 'API integrations', true, 6),
  -- meta-ads Starter
  ('meta-ads-management', 'Starter', '1 ad campaign', true, 1),
  ('meta-ads-management', 'Starter', 'Audience research', true, 2),
  ('meta-ads-management', 'Starter', 'Monthly performance report', true, 3),
  ('meta-ads-management', 'Starter', 'A/B testing', false, 4),
  ('meta-ads-management', 'Starter', 'Creative direction', false, 5),
  -- meta-ads Growth
  ('meta-ads-management', 'Growth', 'Up to 3 campaigns', true, 1),
  ('meta-ads-management', 'Growth', 'Audience research', true, 2),
  ('meta-ads-management', 'Growth', 'Weekly optimization', true, 3),
  ('meta-ads-management', 'Growth', 'A/B testing', true, 4),
  ('meta-ads-management', 'Growth', 'Creative direction', true, 5),
  -- seo Basic
  ('seo-service', 'Basic', '5 pages optimized', true, 1),
  ('seo-service', 'Basic', 'Technical audit', true, 2),
  ('seo-service', 'Basic', 'Monthly report', true, 3),
  ('seo-service', 'Basic', 'Content strategy', false, 4),
  ('seo-service', 'Basic', 'Link building', false, 5),
  -- seo Standard
  ('seo-service', 'Standard', '15 pages optimized', true, 1),
  ('seo-service', 'Standard', 'Technical audit', true, 2),
  ('seo-service', 'Standard', 'Keyword tracking', true, 3),
  ('seo-service', 'Standard', 'Content recommendations', true, 4),
  ('seo-service', 'Standard', 'Link building', false, 5),
  -- social-media Basic
  ('social-media-design', 'Basic', '10 feed posts', true, 1),
  ('social-media-design', 'Basic', '5 story designs', true, 2),
  ('social-media-design', 'Basic', 'Brand-aligned colors', true, 3),
  ('social-media-design', 'Basic', 'Ad creatives', false, 4),
  ('social-media-design', 'Basic', 'Reels covers', false, 5),
  -- social-media Standard
  ('social-media-design', 'Standard', '20 feed posts', true, 1),
  ('social-media-design', 'Standard', '10 story designs', true, 2),
  ('social-media-design', 'Standard', '4 ad creatives', true, 3),
  ('social-media-design', 'Standard', 'Brand-aligned colors', true, 4),
  ('social-media-design', 'Standard', 'Reels covers', false, 5),
  -- logo Logo Only
  ('logo-brand-identity', 'Logo Only', '3 logo concepts', true, 1),
  ('logo-brand-identity', 'Logo Only', '2 revision rounds', true, 2),
  ('logo-brand-identity', 'Logo Only', 'PNG, SVG, PDF files', true, 3),
  ('logo-brand-identity', 'Logo Only', 'Color palette', false, 4),
  ('logo-brand-identity', 'Logo Only', 'Brand guidelines', false, 5),
  -- logo Brand Starter
  ('logo-brand-identity', 'Brand Starter', '3 logo concepts', true, 1),
  ('logo-brand-identity', 'Brand Starter', 'Color palette', true, 2),
  ('logo-brand-identity', 'Brand Starter', 'Typography selection', true, 3),
  ('logo-brand-identity', 'Brand Starter', 'Social media templates', true, 4),
  ('logo-brand-identity', 'Brand Starter', 'Full brand guidelines PDF', false, 5)
) as f(product_slug, pkg_name, feature_text, included, sort_order)
where p.slug = f.product_slug and pp.name = f.pkg_name
on conflict (package_id, sort_order) do update set
  feature_text = excluded.feature_text,
  included = excluded.included;

-- ─── Stage template links ───
insert into public.product_stage_templates (product_id, template_id)
select p.id, t.id
from public.products p
join public.project_stage_templates t on t.slug = case p.slug
  when 'business-website' then 'business-website-delivery'
  when 'mobile-app-development' then 'mobile-app-delivery'
  when 'meta-ads-management' then 'meta-ads-delivery'
  when 'seo-service' then 'seo-delivery'
  when 'ecommerce-growth' then 'ecommerce-growth-delivery'
  when 'social-media-design' then 'social-design-delivery'
  when 'logo-brand-identity' then 'brand-identity-delivery'
end
where p.slug in (
  'business-website', 'mobile-app-development',
  'meta-ads-management', 'seo-service', 'ecommerce-growth',
  'social-media-design', 'logo-brand-identity'
)
on conflict (product_id) do update set template_id = excluded.template_id;

-- ─── Requirement fields ───
insert into public.product_requirement_fields (
  product_id, label, field_key, field_type, placeholder, help_text,
  required, options, sort_order, active
)
select p.id, v.label, v.field_key, v.field_type, v.placeholder, v.help_text,
  v.required, v.options::jsonb, v.sort_order, true
from public.products p
cross join (values
  -- business-website
  ('business-website', 'Company Name', 'company_name', 'text', 'Your business name', null, true, '[]', 1),
  ('business-website', 'Industry / Services', 'industry', 'text', 'e.g. Law firm, Restaurant, IT services', null, true, '[]', 2),
  ('business-website', 'Pages Needed', 'pages_needed', 'textarea', 'Home, About, Services, Contact, etc.', null, true, '[]', 3),
  ('business-website', 'Existing Domain', 'domain', 'text', 'example.com or leave blank', null, false, '[]', 4),
  ('business-website', 'Reference Websites', 'reference_sites', 'textarea', 'Sites you like the look of', null, false, '[]', 5),
  ('business-website', 'Brand Colors / Logo', 'brand_assets', 'textarea', 'Describe colors or attach logo later', null, false, '[]', 6),
  -- mobile-app
  ('mobile-app-development', 'App Name & Idea', 'app_idea', 'textarea', 'Describe your app concept', null, true, '[]', 1),
  ('mobile-app-development', 'Target Platform', 'platform', 'select', null, null, true, '["Android","iOS","Both"]', 2),
  ('mobile-app-development', 'Core Features List', 'features_list', 'textarea', 'List must-have features', null, true, '[]', 3),
  ('mobile-app-development', 'Existing Backend/API', 'existing_api', 'text', 'URL or none', null, false, '[]', 4),
  ('mobile-app-development', 'Design References', 'design_refs', 'textarea', 'Apps or designs you admire', null, false, '[]', 5),
  -- meta-ads
  ('meta-ads-management', 'Business / Brand Name', 'brand_name', 'text', 'Your brand name', null, true, '[]', 1),
  ('meta-ads-management', 'Facebook Page URL', 'facebook_page', 'url', 'https://facebook.com/yourpage', null, true, '[]', 2),
  ('meta-ads-management', 'Monthly Ad Budget (BDT)', 'ad_budget', 'number', '10000', 'Approximate monthly spend on ads', true, '[]', 3),
  ('meta-ads-management', 'Target Audience', 'target_audience', 'textarea', 'Who should see your ads?', null, true, '[]', 4),
  ('meta-ads-management', 'Primary Goal', 'campaign_goal', 'select', null, null, true, '["Sales","Leads","Traffic","Brand Awareness"]', 5),
  -- seo
  ('seo-service', 'Website URL', 'website_url', 'url', 'https://yoursite.com', null, true, '[]', 1),
  ('seo-service', 'Target Keywords', 'target_keywords', 'textarea', 'Keywords you want to rank for', null, true, '[]', 2),
  ('seo-service', 'Target Location', 'target_location', 'text', 'e.g. Dhaka, Bangladesh', null, true, '[]', 3),
  ('seo-service', 'Competitor Websites', 'competitors', 'textarea', 'Main competitors online', null, false, '[]', 4),
  -- ecommerce-growth
  ('ecommerce-growth', 'Store URL', 'store_url', 'url', 'https://yourstore.com', null, true, '[]', 1),
  ('ecommerce-growth', 'Monthly Revenue (approx)', 'monthly_revenue', 'text', 'e.g. ৳5 lakh', null, false, '[]', 2),
  ('ecommerce-growth', 'Current Marketing Channels', 'current_channels', 'multi_select', null, null, true, '["Meta Ads","Google Ads","SEO","Email","Influencer","None"]', 3),
  ('ecommerce-growth', 'Growth Goals', 'growth_goals', 'textarea', 'What results do you want in 3–6 months?', null, true, '[]', 4),
  -- social-media-design
  ('social-media-design', 'Brand Name', 'brand_name', 'text', 'Your brand', null, true, '[]', 1),
  ('social-media-design', 'Platforms', 'platforms', 'multi_select', null, null, true, '["Facebook","Instagram","LinkedIn","TikTok"]', 2),
  ('social-media-design', 'Content Themes', 'content_themes', 'textarea', 'Products, offers, tips, behind-the-scenes', null, true, '[]', 3),
  ('social-media-design', 'Brand Guidelines Link', 'brand_guide', 'url', 'Google Drive or Figma link', null, false, '[]', 4),
  -- logo-brand
  ('logo-brand-identity', 'Brand / Company Name', 'brand_name', 'text', 'Name for the logo', null, true, '[]', 1),
  ('logo-brand-identity', 'Industry', 'industry', 'text', 'e.g. Food, Tech, Fashion', null, true, '[]', 2),
  ('logo-brand-identity', 'Brand Personality', 'brand_personality', 'textarea', 'Modern, trustworthy, playful, premium…', null, true, '[]', 3),
  ('logo-brand-identity', 'Color Preferences', 'color_prefs', 'text', 'Preferred or avoided colors', null, false, '[]', 4),
  ('logo-brand-identity', 'Reference Logos', 'logo_refs', 'textarea', 'Logos or brands you admire', null, false, '[]', 5)
) as v(product_slug, label, field_key, field_type, placeholder, help_text, required, options, sort_order)
where p.slug = v.product_slug
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

-- ─── FAQs ───
insert into public.product_faqs (product_id, question, answer, sort_order, active)
select p.id, f.question, f.answer, f.sort_order, true
from public.products p
cross join (values
  ('business-website', 'Do you provide domain and hosting?', 'We can guide you on domain and hosting setup. Hosting is typically billed separately or you can use your existing provider.', 1),
  ('business-website', 'How many revisions are included?', 'Revision rounds depend on your package — Starter (2), Business (3), Premium (5).', 2),
  ('mobile-app-development', 'Do you publish to App Store and Play Store?', 'Yes — Business and Enterprise packages include submission support. Store fees are paid by the client.', 1),
  ('mobile-app-development', 'Can you maintain the app after launch?', 'Yes — we offer optional monthly maintenance and feature update retainers after delivery.', 2),
  ('meta-ads-management', 'Is ad spend included in the price?', 'No — our fee covers management only. You pay Meta directly for ad spend (bKash/card).', 1),
  ('meta-ads-management', 'How soon will campaigns go live?', 'Typically within 5–7 business days after onboarding and asset collection.', 2),
  ('seo-service', 'How long until I see SEO results?', 'Meaningful organic improvements usually take 3–6 months depending on competition and site age.', 1),
  ('ecommerce-growth', 'Do I need an existing online store?', 'Yes — this service is for stores already selling online or ready to launch with a BITP e-commerce solution.', 1),
  ('social-media-design', 'Do you write captions too?', 'Copywriting can be added as an optional add-on. Standard packages focus on visual design.', 1),
  ('logo-brand-identity', 'Who owns the final logo files?', 'You receive full ownership of approved final deliverables upon project completion.', 1)
) as f(product_slug, question, answer, sort_order)
where p.slug = f.product_slug
on conflict do nothing;
