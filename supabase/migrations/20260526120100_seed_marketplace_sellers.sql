-- Seed 10 BD marketplace sellers + link services
-- Uses ON CONFLICT for idempotent local runs

INSERT INTO marketplace_sellers (
  slug, full_name, username, title, short_bio, about,
  avatar_url, banner_url, country, city, languages,
  experience_years, response_time, response_rate, delivery_rate,
  total_orders, happy_clients, queue_orders, rating, total_reviews,
  starting_price, availability_status, is_top_rated, is_verified, is_featured,
  member_since, seller_level, primary_category_slug
) VALUES
(
  'tanvir-ahmed', 'Tanvir Ahmed', 'tanvirahmed', 'Full Stack Web Developer',
  'Building fast, scalable websites and web apps for Bangladeshi startups.',
  'I am a Dhaka-based full stack developer with 6+ years shipping production websites, SaaS dashboards, and ecommerce platforms. I specialize in React, Next.js, and Node.js with a focus on performance, SEO, and clean UX for Bangladeshi businesses.',
  'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=10b981&color=fff&size=256',
  NULL, 'Bangladesh', 'Dhaka', ARRAY['English', 'Bengali'],
  6, '1 hour', 99, 98, 420, 380, 3, 4.9, 312, 8000, 'available', true, true, true,
  '2019-03-15', 'Top Rated Seller', 'web-development'
),
(
  'mahin-studio', 'Mahin Studio', 'mahinstudio', 'WordPress Expert',
  'Premium WordPress & WooCommerce stores for SMEs across Bangladesh.',
  'Mahin Studio delivers conversion-focused WordPress websites, WooCommerce shops, and landing pages. Based in Chattogram, we help brands launch online quickly with secure hosting, payment gateways, and ongoing support.',
  'https://ui-avatars.com/api/?name=Mahin+Studio&background=8b5cf6&color=fff&size=256',
  NULL, 'Bangladesh', 'Chattogram', ARRAY['English', 'Bengali'],
  5, '2 hours', 97, 96, 310, 290, 2, 4.8, 198, 6000, 'available', true, true, true,
  '2020-01-10', 'Top Rated Seller', 'web-development'
),
(
  'jahid-hasan', 'Jahid Hasan', 'jahidhasan', 'Shopify Expert',
  'Shopify & ecommerce growth specialist for D2C brands in Bangladesh.',
  'Jahid helps founders launch and scale Shopify stores with custom themes, apps, and CRO. Experienced with bKash, SSLCommerz, and international shipping setups for Bangladeshi ecommerce.',
  'https://ui-avatars.com/api/?name=Jahid+Hasan&background=06b6d4&color=fff&size=256',
  NULL, 'Bangladesh', 'Dhaka', ARRAY['English', 'Bengali'],
  4, '3 hours', 96, 95, 185, 170, 4, 4.9, 156, 12000, 'available', true, true, false,
  '2021-06-01', 'Level 2 Seller', 'web-development'
),
(
  'ux-studio', 'UX Studio', 'uxstudio', 'UI/UX Designer',
  'Modern product design for web and mobile — Figma to pixel-perfect UI.',
  'UX Studio is a Sylhet-based design team crafting intuitive interfaces for startups and agencies. We deliver design systems, prototypes, and developer-ready Figma files.',
  'https://ui-avatars.com/api/?name=UX+Studio&background=ec4899&color=fff&size=256',
  NULL, 'Bangladesh', 'Sylhet', ARRAY['English', 'Bengali'],
  5, '4 hours', 98, 97, 240, 220, 2, 4.7, 89, 6000, 'available', false, true, true,
  '2020-08-20', 'Level 2 Seller', 'app-development'
),
(
  'code-factory', 'Code Factory', 'codefactory', 'Software Architect',
  'Enterprise software, ERP, and SaaS for Bangladeshi businesses.',
  'Code Factory builds custom ERP, CRM, POS, and SaaS platforms. Our Rajshahi team ships maintainable code with Laravel, React, and PostgreSQL for SMEs scaling beyond spreadsheets.',
  'https://ui-avatars.com/api/?name=Code+Factory&background=6366f1&color=fff&size=256',
  NULL, 'Bangladesh', 'Rajshahi', ARRAY['English', 'Bengali'],
  8, '6 hours', 95, 96, 95, 88, 1, 5.0, 74, 15000, 'available', true, true, true,
  '2017-11-01', 'Top Rated Seller', 'software-development'
),
(
  'ai-experts-bd', 'AI Experts BD', 'aiexpertsbd', 'AI Automation Specialist',
  'Chatbots, WhatsApp automation, and AI workflows for local businesses.',
  'We implement practical AI for Bangladesh: customer support bots, lead qualification, CRM automation, and n8n/Make workflows integrated with your existing stack.',
  'https://ui-avatars.com/api/?name=AI+Experts&background=7c3aed&color=fff&size=256',
  NULL, 'Bangladesh', 'Dhaka', ARRAY['English', 'Bengali'],
  3, '2 hours', 97, 94, 120, 110, 5, 4.7, 88, 5000, 'available', false, true, true,
  '2022-04-12', 'Level 2 Seller', 'ai-automations'
),
(
  'design-hub', 'Design Hub', 'designhub', 'Creative Brand Designer',
  'Logos, brand identity, and social creatives for growing brands.',
  'Design Hub creates memorable brand identities, packaging, and social media kits. We work with restaurants, fashion, and tech startups across Bangladesh.',
  'https://ui-avatars.com/api/?name=Design+Hub&background=f59e0b&color=fff&size=256',
  NULL, 'Bangladesh', 'Dhaka', ARRAY['English', 'Bengali'],
  4, '5 hours', 94, 93, 165, 150, 3, 4.6, 42, 3500, 'available', false, true, false,
  '2023-02-01', 'New Seller', 'digital-marketing'
),
(
  'appcraft-studio', 'AppCraft Studio', 'appcraft', 'Mobile App Developer',
  'Flutter & React Native apps for delivery, booking, and marketplaces.',
  'AppCraft ships cross-platform mobile apps with clean architecture, push notifications, and payment integration. From MVPs to production apps on Play Store and App Store.',
  'https://ui-avatars.com/api/?name=AppCraft&background=3b82f6&color=fff&size=256',
  NULL, 'Bangladesh', 'Chattogram', ARRAY['English', 'Bengali'],
  5, '3 hours', 96, 95, 78, 72, 2, 4.8, 58, 50000, 'available', true, true, false,
  '2021-09-01', 'Level 2 Seller', 'app-development'
),
(
  'seo-pro-bd', 'SEO Pro BD', 'seoprobot', 'SEO Specialist',
  'Technical SEO, content strategy, and local search for BD businesses.',
  'SEO Pro BD helps websites rank on Google with audits, on-page fixes, content plans, and link building tailored for Bangladeshi search behavior and Bengali keywords.',
  'https://ui-avatars.com/api/?name=SEO+Pro&background=14b8a6&color=fff&size=256',
  NULL, 'Bangladesh', 'Dhaka', ARRAY['English', 'Bengali'],
  6, '4 hours', 98, 97, 290, 265, 1, 4.8, 221, 3000, 'available', true, true, false,
  '2018-05-20', 'Level 2 Seller', 'digital-marketing'
),
(
  'web-builders', 'Web Builders', 'webbuilders', 'Business Website Expert',
  'Professional business websites delivered fast with ongoing support.',
  'Web Builders focuses on corporate sites, portfolios, and service business websites with WhatsApp integration, bilingual content, and easy admin panels.',
  'https://ui-avatars.com/api/?name=Web+Builders&background=059669&color=fff&size=256',
  NULL, 'Bangladesh', 'Sylhet', ARRAY['English', 'Bengali'],
  7, '2 hours', 99, 98, 350, 320, 4, 4.9, 167, 10000, 'available', true, true, true,
  '2018-01-08', 'Top Rated Seller', 'web-development'
)
ON CONFLICT (slug) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  short_bio = EXCLUDED.short_bio,
  about = EXCLUDED.about,
  avatar_url = EXCLUDED.avatar_url,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  starting_price = EXCLUDED.starting_price,
  seller_level = EXCLUDED.seller_level,
  primary_category_slug = EXCLUDED.primary_category_slug;

DELETE FROM marketplace_seller_clients WHERE seller_id IN (SELECT id FROM marketplace_sellers);
DELETE FROM marketplace_seller_portfolio WHERE seller_id IN (SELECT id FROM marketplace_sellers);
DELETE FROM marketplace_seller_reviews WHERE seller_id IN (SELECT id FROM marketplace_sellers);
DELETE FROM marketplace_seller_verifications WHERE seller_id IN (SELECT id FROM marketplace_sellers);
DELETE FROM marketplace_seller_skills WHERE seller_id IN (SELECT id FROM marketplace_sellers);

-- Skills (sample per seller)
INSERT INTO marketplace_seller_skills (seller_id, skill_name, skill_percentage, sort_order)
SELECT s.id, v.skill, v.pct, v.ord
FROM marketplace_sellers s
CROSS JOIN (VALUES
  ('tanvir-ahmed', 'React / Next.js', 96, 1),
  ('tanvir-ahmed', 'Node.js', 92, 2),
  ('tanvir-ahmed', 'TypeScript', 90, 3),
  ('tanvir-ahmed', 'PostgreSQL', 85, 4),
  ('mahin-studio', 'WordPress', 98, 1),
  ('mahin-studio', 'WooCommerce', 94, 2),
  ('mahin-studio', 'Elementor', 92, 3),
  ('jahid-hasan', 'Shopify', 97, 1),
  ('jahid-hasan', 'Ecommerce CRO', 88, 2),
  ('ux-studio', 'Figma', 99, 1),
  ('ux-studio', 'UI Design', 96, 2),
  ('ux-studio', 'UX Research', 88, 3),
  ('code-factory', 'Laravel', 94, 1),
  ('code-factory', 'System Design', 92, 2),
  ('code-factory', 'React', 90, 3),
  ('ai-experts-bd', 'AI Chatbots', 95, 1),
  ('ai-experts-bd', 'Automation', 92, 2),
  ('design-hub', 'Brand Identity', 94, 1),
  ('design-hub', 'Logo Design', 96, 2),
  ('appcraft-studio', 'Flutter', 95, 1),
  ('appcraft-studio', 'React Native', 90, 2),
  ('seo-pro-bd', 'Technical SEO', 96, 1),
  ('seo-pro-bd', 'Content SEO', 92, 2),
  ('web-builders', 'Business Websites', 97, 1),
  ('web-builders', 'WordPress', 88, 2)
) AS v(slug, skill, pct, ord)
WHERE s.slug = v.slug;

-- Verifications
INSERT INTO marketplace_seller_verifications (seller_id, verification_type, verified)
SELECT s.id, v.vtype, true
FROM marketplace_sellers s
CROSS JOIN (VALUES
  ('Identity Verified'), ('Email Verified'), ('Phone Verified'), ('Payment Verified')
) AS v(vtype);

-- Clients
INSERT INTO marketplace_seller_clients (seller_id, client_name, sort_order)
SELECT s.id, v.cname, v.ord
FROM marketplace_sellers s
CROSS JOIN (VALUES
  ('tanvir-ahmed', 'bKash', 1), ('tanvir-ahmed', 'Pathao', 2), ('tanvir-ahmed', 'ShopUp', 3),
  ('mahin-studio', 'Daraz Seller', 1), ('mahin-studio', 'Evaly Partner', 2),
  ('code-factory', '10 Minute School', 1), ('code-factory', 'Robi', 2),
  ('seo-pro-bd', 'Startup Bangladesh', 1), ('seo-pro-bd', 'SME Foundation', 2)
) AS v(slug, cname, ord)
WHERE s.slug = v.slug;

-- Reviews
INSERT INTO marketplace_seller_reviews (seller_id, client_name, client_country, rating, review_text, project_title, created_at)
SELECT s.id, v.cname, 'Bangladesh', v.rating, v.rtext, v.ptitle, v.cdate::date
FROM marketplace_sellers s
CROSS JOIN (VALUES
  ('tanvir-ahmed', 'Rahim K.', 5, 'Excellent work on our corporate website. Fast communication and clean code.', 'Business Website', '2025-11-10'),
  ('tanvir-ahmed', 'Sadia M.', 5, 'Delivered Next.js store ahead of schedule. Highly recommended.', 'Ecommerce Platform', '2025-09-22'),
  ('mahin-studio', 'Karim U.', 5, 'WordPress site looks premium and loads fast.', 'WordPress Site', '2025-10-05'),
  ('jahid-hasan', 'Nadia H.', 5, 'Shopify setup with bKash was seamless.', 'Shopify Store', '2025-08-18'),
  ('ux-studio', 'Farhan A.', 4.5, 'Great Figma files and design system.', 'App UI Design', '2025-12-01'),
  ('code-factory', 'Enterprise Co.', 5, 'ERP module works perfectly for our team.', 'ERP Development', '2025-07-14'),
  ('ai-experts-bd', 'Retail BD', 5, 'WhatsApp bot handles 80% of support tickets.', 'AI Chatbot', '2025-11-28'),
  ('seo-pro-bd', 'Local Clinic', 4.8, 'Ranked on page 1 for key terms in 3 months.', 'SEO Campaign', '2025-06-30')
) AS v(slug, cname, rating, rtext, ptitle, cdate)
WHERE s.slug = v.slug;

-- Portfolio
INSERT INTO marketplace_seller_portfolio (seller_id, title, category, technologies, sort_order)
SELECT s.id, v.title, v.cat, v.tech, v.ord
FROM marketplace_sellers s
CROSS JOIN (VALUES
  ('tanvir-ahmed', 'SaaS Analytics Dashboard', 'SaaS', ARRAY['React','Next.js','Node.js'], 1),
  ('tanvir-ahmed', 'Corporate Website', 'Website', ARRAY['Next.js','Tailwind'], 2),
  ('mahin-studio', 'WooCommerce Fashion Store', 'Ecommerce', ARRAY['WordPress','WooCommerce'], 1),
  ('jahid-hasan', 'D2C Shopify Brand', 'Ecommerce', ARRAY['Shopify','Liquid'], 1),
  ('ux-studio', 'Fintech Mobile UI', 'Mobile', ARRAY['Figma','UI/UX'], 1),
  ('code-factory', 'Distribution ERP', 'Software', ARRAY['Laravel','Vue'], 1),
  ('appcraft-studio', 'Food Delivery App', 'Mobile App', ARRAY['Flutter','Firebase'], 1),
  ('web-builders', 'Real Estate Portal', 'Website', ARRAY['WordPress','SEO'], 1)
) AS v(slug, title, cat, tech, ord)
WHERE s.slug = v.slug;

-- Link existing services to sellers by category
UPDATE marketplace_services ms
SET
  seller_id = s.id,
  seller_slug = s.slug,
  seller_name = s.full_name,
  seller_avatar_url = s.avatar_url
FROM marketplace_sellers s
WHERE ms.seller_id IS NULL
  AND (
    (ms.row_group = 'software_development' AND s.slug = 'code-factory')
    OR (ms.row_group = 'web_development' AND s.slug = CASE (ms.sort_order % 4)
        WHEN 0 THEN 'tanvir-ahmed' WHEN 1 THEN 'mahin-studio' WHEN 2 THEN 'jahid-hasan' ELSE 'web-builders' END)
    OR (ms.row_group = 'app_development' AND s.slug = CASE (ms.sort_order % 2) WHEN 0 THEN 'appcraft-studio' ELSE 'ux-studio' END)
    OR (ms.tags && ARRAY['seo'] AND s.slug = 'seo-pro-bd')
    OR (ms.tags && ARRAY['ai'] AND s.slug = 'ai-experts-bd')
    OR (ms.row_group = 'popular' AND ms.tags && ARRAY['ai','chatbot','automation'] AND s.slug = 'ai-experts-bd')
    OR (ms.row_group = 'popular' AND ms.tags && ARRAY['seo'] AND s.slug = 'seo-pro-bd')
    OR (ms.row_group = 'popular' AND s.slug = 'design-hub')
  );

-- Fallback: any remaining unassigned → web-builders
UPDATE marketplace_services ms
SET
  seller_id = s.id,
  seller_slug = s.slug,
  seller_name = s.full_name,
  seller_avatar_url = s.avatar_url
FROM marketplace_sellers s
WHERE ms.seller_id IS NULL AND s.slug = 'web-builders';
