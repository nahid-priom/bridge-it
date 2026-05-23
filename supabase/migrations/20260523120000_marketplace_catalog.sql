-- Marketplace categories & services for Deshi Fiverr homepage
-- Idempotent: safe to re-run locally (upsert on slug)

CREATE TABLE IF NOT EXISTS marketplace_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  subtitle text,
  description text,
  icon text,
  service_count integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES marketplace_categories(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  seller_name text NOT NULL,
  seller_level text,
  thumbnail_type text DEFAULT 'gradient',
  thumbnail_url text,
  price_from integer NOT NULL,
  currency text DEFAULT 'BDT',
  delivery_days integer,
  rating numeric DEFAULT 4.8,
  review_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  row_group text NOT NULL CHECK (
    row_group IN (
      'software_development',
      'web_development',
      'app_development',
      'popular'
    )
  ),
  is_popular boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_categories_slug ON marketplace_categories(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_slug ON marketplace_services(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_category_id ON marketplace_services(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_row_group ON marketplace_services(row_group);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_is_popular ON marketplace_services(is_popular);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_is_featured ON marketplace_services(is_featured);

ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read marketplace_categories" ON marketplace_categories;
CREATE POLICY "Public read marketplace_categories"
  ON marketplace_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read marketplace_services" ON marketplace_services;
CREATE POLICY "Public read marketplace_services"
  ON marketplace_services FOR SELECT
  TO anon, authenticated
  USING (true);

-- Categories
INSERT INTO marketplace_categories (slug, name, subtitle, icon, service_count, sort_order, is_featured)
VALUES
  ('software-development', 'Software Development', 'Custom software & SaaS', '💻', 160, 1, true),
  ('web-development', 'Web Development', 'Websites & landing pages', '🌐', 260, 2, true),
  ('app-development', 'App Development', 'iOS, Android & cross-platform', '📱', 140, 3, true),
  ('digital-marketing', 'Digital Marketing', 'SEO, ads & social media', '📣', 320, 4, true),
  ('ai-automations', 'AI & Automations', 'Chatbots & workflows', '🤖', 90, 5, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  icon = EXCLUDED.icon,
  service_count = EXCLUDED.service_count,
  sort_order = EXCLUDED.sort_order,
  is_featured = EXCLUDED.is_featured;

-- Software Development
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.short_description, v.seller_name, v.seller_level, v.price_from, v.delivery_days, v.rating, v.review_count, v.row_group, v.is_popular, v.is_featured, v.sort_order
FROM marketplace_categories c
CROSS JOIN (VALUES
  ('custom-business-management-software', 'Custom Business Management Software', 'Professional custom business management software for Bangladeshi businesses.', 'CodeBridge BD', 'Top Rated Seller', 45000, 30, 4.8, 35, 'software_development', false, true, 1),
  ('pos-and-inventory-management-system', 'POS & Inventory Management System', 'Professional pos & inventory management system for Bangladeshi businesses.', 'TechPark Solutions', 'Level 2 Seller', 35000, 25, 4.9, 42, 'software_development', true, false, 2),
  ('crm-software-development', 'CRM Software Development', 'Professional crm software development for Bangladeshi businesses.', 'Dhaka Dev Studio', 'Pro Seller', 50000, 28, 4.8, 56, 'software_development', false, false, 3),
  ('erp-software-for-smes', 'ERP Software for SMEs', 'Professional erp software for smes for Bangladeshi businesses.', 'CloudNine IT', 'Top Rated Seller', 80000, 45, 4.9, 63, 'software_development', false, true, 4),
  ('saas-dashboard-development', 'SaaS Dashboard Development', 'Professional saas dashboard development for Bangladeshi businesses.', 'NexGen Bangladesh', 'Level 2 Seller', 65000, 35, 4.8, 49, 'software_development', false, false, 5),
  ('accounting-software-development', 'Accounting Software Development', 'Professional accounting software development for Bangladeshi businesses.', 'Studio 71 Digital', 'Pro Seller', 55000, 32, 4.7, 38, 'software_development', false, false, 6),
  ('school-management-software', 'School Management Software', 'Professional school management software for Bangladeshi businesses.', 'GreenCode Labs', 'Top Rated Seller', 60000, 40, 4.9, 71, 'software_development', true, false, 7),
  ('field-sales-and-distribution-erp', 'Field Sales & Distribution ERP', 'Professional field sales & distribution erp for Bangladeshi businesses.', 'ByteForge BD', 'Level 2 Seller', 90000, 50, 4.8, 84, 'software_development', false, true, 8)
) AS v(slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
WHERE c.slug = 'software-development'
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  seller_name = EXCLUDED.seller_name,
  seller_level = EXCLUDED.seller_level,
  price_from = EXCLUDED.price_from,
  delivery_days = EXCLUDED.delivery_days,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  row_group = EXCLUDED.row_group,
  is_popular = EXCLUDED.is_popular,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- Web Development
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.short_description, v.seller_name, v.seller_level, v.price_from, v.delivery_days, v.rating, v.review_count, v.row_group, v.is_popular, v.is_featured, v.sort_order
FROM marketplace_categories c
CROSS JOIN (VALUES
  ('business-website-development', 'Business Website Development', 'Professional business website development for Bangladeshi businesses.', 'CodeBridge BD', 'Top Rated Seller', 12000, 10, 4.9, 120, 'web_development', true, false, 1),
  ('landing-page-design-and-development', 'Landing Page Design & Development', 'Professional landing page design & development for Bangladeshi businesses.', 'TechPark Solutions', 'Level 2 Seller', 6000, 5, 4.8, 95, 'web_development', false, false, 2),
  ('wordpress-website-development', 'WordPress Website Development', 'Professional wordpress website development for Bangladeshi businesses.', 'Dhaka Dev Studio', 'Pro Seller', 10000, 7, 4.8, 88, 'web_development', false, false, 3),
  ('e-commerce-website-development', 'E-commerce Website Development', 'Professional e-commerce website development for Bangladeshi businesses.', 'CloudNine IT', 'Top Rated Seller', 25000, 14, 4.9, 102, 'web_development', false, true, 4),
  ('shopify-store-setup', 'Shopify Store Setup', 'Professional shopify store setup for Bangladeshi businesses.', 'NexGen Bangladesh', 'Level 2 Seller', 18000, 10, 4.8, 76, 'web_development', false, false, 5),
  ('next-js-website-development', 'Next.js Website Development', 'Professional next.js website development for Bangladeshi businesses.', 'Studio 71 Digital', 'Pro Seller', 30000, 14, 4.9, 64, 'web_development', true, false, 6),
  ('portfolio-website-development', 'Portfolio Website Development', 'Professional portfolio website development for Bangladeshi businesses.', 'GreenCode Labs', 'Top Rated Seller', 8000, 5, 4.7, 52, 'web_development', false, false, 7),
  ('website-speed-optimization', 'Website Speed Optimization', 'Professional website speed optimization for Bangladeshi businesses.', 'ByteForge BD', 'Level 2 Seller', 5000, 3, 4.8, 41, 'web_development', false, false, 8)
) AS v(slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
WHERE c.slug = 'web-development'
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  seller_name = EXCLUDED.seller_name,
  seller_level = EXCLUDED.seller_level,
  price_from = EXCLUDED.price_from,
  delivery_days = EXCLUDED.delivery_days,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  row_group = EXCLUDED.row_group,
  is_popular = EXCLUDED.is_popular,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- App Development
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.short_description, v.seller_name, v.seller_level, v.price_from, v.delivery_days, v.rating, v.review_count, v.row_group, v.is_popular, v.is_featured, v.sort_order
FROM marketplace_categories c
CROSS JOIN (VALUES
  ('android-app-development', 'Android App Development', 'Professional android app development for Bangladeshi businesses.', 'CodeBridge BD', 'Top Rated Seller', 45000, 21, 4.9, 89, 'app_development', true, false, 1),
  ('ios-app-development', 'iOS App Development', 'Professional ios app development for Bangladeshi businesses.', 'TechPark Solutions', 'Level 2 Seller', 60000, 28, 4.8, 72, 'app_development', false, false, 2),
  ('react-native-app-development', 'React Native App Development', 'Professional react native app development for Bangladeshi businesses.', 'Dhaka Dev Studio', 'Pro Seller', 70000, 30, 4.9, 58, 'app_development', false, true, 3),
  ('flutter-app-development', 'Flutter App Development', 'Professional flutter app development for Bangladeshi businesses.', 'CloudNine IT', 'Top Rated Seller', 65000, 28, 4.8, 66, 'app_development', false, false, 4),
  ('delivery-app-development', 'Delivery App Development', 'Professional delivery app development for Bangladeshi businesses.', 'NexGen Bangladesh', 'Level 2 Seller', 120000, 45, 4.9, 44, 'app_development', false, true, 5),
  ('marketplace-mobile-app', 'Marketplace Mobile App', 'Professional marketplace mobile app for Bangladeshi businesses.', 'Studio 71 Digital', 'Pro Seller', 150000, 60, 4.8, 37, 'app_development', false, false, 6),
  ('booking-app-development', 'Booking App Development', 'Professional booking app development for Bangladeshi businesses.', 'GreenCode Labs', 'Top Rated Seller', 85000, 35, 4.9, 51, 'app_development', true, false, 7),
  ('app-ui-ux-design', 'App UI/UX Design', 'Professional app ui/ux design for Bangladeshi businesses.', 'ByteForge BD', 'Level 2 Seller', 15000, 10, 4.7, 93, 'app_development', false, false, 8)
) AS v(slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
WHERE c.slug = 'app-development'
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  seller_name = EXCLUDED.seller_name,
  seller_level = EXCLUDED.seller_level,
  price_from = EXCLUDED.price_from,
  delivery_days = EXCLUDED.delivery_days,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  row_group = EXCLUDED.row_group,
  is_popular = EXCLUDED.is_popular,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- Popular (mixed categories)
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.short_description, v.seller_name, v.seller_level, v.price_from, v.delivery_days, v.rating, v.review_count, v.row_group, v.is_popular, v.is_featured, v.sort_order
FROM marketplace_categories c
INNER JOIN (VALUES
  ('facebook-ads-campaign-setup', 'Facebook Ads Campaign Setup', 'Professional facebook ads campaign setup for Bangladeshi businesses.', 'Studio 71 Digital', 'Top Rated Seller', 5000, 3, 4.9, 156, 'popular', true, false, 1, 'digital-marketing'),
  ('seo-optimization-service', 'SEO Optimization Service', 'Professional seo optimization service for Bangladeshi businesses.', 'GreenCode Labs', 'Level 2 Seller', 8000, 7, 4.9, 134, 'popular', true, false, 2, 'digital-marketing'),
  ('professional-video-editing', 'Professional Video Editing', 'Professional video editing for Bangladeshi businesses.', 'ByteForge BD', 'Pro Seller', 3000, 4, 4.8, 98, 'popular', false, false, 3, 'digital-marketing'),
  ('brand-identity-design', 'Brand Identity Design', 'Professional brand identity design for Bangladeshi businesses.', 'CodeBridge BD', 'Top Rated Seller', 7000, 5, 4.9, 112, 'popular', false, true, 4, 'digital-marketing'),
  ('ai-chatbot-automation', 'AI Chatbot Automation', 'Professional ai chatbot automation for Bangladeshi businesses.', 'TechPark Solutions', 'Level 2 Seller', 15000, 10, 4.9, 67, 'popular', false, true, 5, 'ai-automations'),
  ('payment-gateway-integration', 'Payment Gateway Integration', 'Professional payment gateway integration for Bangladeshi businesses.', 'Dhaka Dev Studio', 'Pro Seller', 10000, 5, 4.8, 45, 'popular', false, false, 6, 'software-development'),
  ('website-maintenance', 'Website Maintenance', 'Professional website maintenance for Bangladeshi businesses.', 'CloudNine IT', 'Top Rated Seller', 4000, 2, 4.7, 88, 'popular', false, false, 7, 'web-development'),
  ('social-media-content-design', 'Social Media Content Design', 'Professional social media content design for Bangladeshi businesses.', 'NexGen Bangladesh', 'Level 2 Seller', 3500, 3, 4.8, 121, 'popular', true, false, 8, 'digital-marketing')
) AS v(slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, row_group, is_popular, is_featured, sort_order, cat_slug)
  ON c.slug = v.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  seller_name = EXCLUDED.seller_name,
  seller_level = EXCLUDED.seller_level,
  price_from = EXCLUDED.price_from,
  delivery_days = EXCLUDED.delivery_days,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  row_group = EXCLUDED.row_group,
  is_popular = EXCLUDED.is_popular,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;
