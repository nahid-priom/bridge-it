-- Refactor marketplace to 5 BD-focused categories and structured services only

DELETE FROM marketplace_services;
DELETE FROM marketplace_categories;

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

CREATE INDEX IF NOT EXISTS idx_marketplace_services_tags_gin ON marketplace_services USING GIN (tags);

-- Software
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, tags, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.desc, v.seller, v.level, v.price, v.days, v.rating, v.reviews, v.tags::text[], v.row_group, v.popular, v.featured, v.ord
FROM marketplace_categories c
CROSS JOIN (VALUES
  ('erp-system-development', 'ERP System Development', 'Enterprise ERP for Bangladeshi SMEs.', 'CodeBridge BD', 'Top Rated Seller', 180000, 45, 4.9, 88, '{erp,software,enterprise,sme}', 'software_development', false, true, 1),
  ('pos-software', 'POS Software', 'POS and retail management software.', 'TechPark Solutions', 'Level 2 Seller', 45000, 25, 4.8, 76, '{pos,retail,inventory}', 'software_development', true, false, 2),
  ('crm-development', 'CRM Development', 'Custom CRM for sales teams.', 'Dhaka Dev Studio', 'Pro Seller', 65000, 30, 4.8, 64, '{crm,sales,software}', 'software_development', false, false, 3),
  ('saas-platform', 'SaaS Platform', 'Multi-tenant SaaS platform development.', 'CloudNine IT', 'Top Rated Seller', 150000, 50, 4.9, 52, '{saas,platform,dashboard}', 'software_development', false, true, 4),
  ('school-management-system', 'School Management System', 'School ERP and admin portal.', 'NexGen Bangladesh', 'Level 2 Seller', 85000, 40, 4.8, 71, '{school,education,management}', 'software_development', false, false, 5),
  ('inventory-management', 'Inventory Management', 'Stock and warehouse management.', 'Studio 71 Digital', 'Pro Seller', 55000, 28, 4.7, 58, '{inventory,warehouse,stock}', 'software_development', false, false, 6),
  ('distribution-erp', 'Distribution ERP', 'Field sales and distribution ERP.', 'GreenCode Labs', 'Top Rated Seller', 200000, 55, 4.9, 44, '{erp,distribution,sales}', 'software_development', false, true, 7),
  ('hrm-software', 'HRM Software', 'HR and payroll management system.', 'ByteForge BD', 'Level 2 Seller', 90000, 35, 4.8, 49, '{hrm,hr,payroll}', 'software_development', false, false, 8)
) AS v(slug, title, desc, seller, level, price, days, rating, reviews, tags, row_group, popular, featured, ord)
WHERE c.slug = 'software-development'
ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id, title = EXCLUDED.title, price_from = EXCLUDED.price_from, tags = EXCLUDED.tags, row_group = EXCLUDED.row_group, sort_order = EXCLUDED.sort_order;

-- Web
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, tags, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.desc, v.seller, v.level, v.price, v.days, v.rating, v.reviews, v.tags::text[], v.row_group, v.popular, v.featured, v.ord
FROM marketplace_categories c
CROSS JOIN (VALUES
  ('business-website', 'Business Website', 'Corporate business website.', 'CodeBridge BD', 'Top Rated Seller', 12000, 10, 4.9, 120, '{website,business,corporate}', 'web_development', true, false, 1),
  ('ecommerce-website', 'Ecommerce Website', 'Full ecommerce website build.', 'TechPark Solutions', 'Level 2 Seller', 28000, 14, 4.9, 102, '{ecommerce,website,online-store}', 'web_development', false, true, 2),
  ('landing-page', 'Landing Page', 'High-converting landing page.', 'Dhaka Dev Studio', 'Pro Seller', 6000, 5, 4.8, 95, '{landing-page,website,conversion}', 'web_development', false, false, 3),
  ('next-js-website', 'Next.js Website', 'Next.js performance website.', 'CloudNine IT', 'Top Rated Seller', 35000, 14, 4.9, 64, '{nextjs,website,react}', 'web_development', true, false, 4),
  ('wordpress-website', 'WordPress Website', 'WordPress business website.', 'NexGen Bangladesh', 'Level 2 Seller', 10000, 7, 4.8, 88, '{wordpress,website,cms}', 'web_development', false, false, 5),
  ('portfolio-website', 'Portfolio Website', 'Creative portfolio website.', 'Studio 71 Digital', 'Pro Seller', 8000, 5, 4.7, 52, '{portfolio,website,personal}', 'web_development', false, false, 6),
  ('shopify-store', 'Shopify Store', 'Shopify ecommerce setup.', 'GreenCode Labs', 'Top Rated Seller', 18000, 10, 4.8, 76, '{shopify,ecommerce,store}', 'web_development', false, false, 7),
  ('website-optimization', 'Website Optimization', 'Speed and Core Web Vitals.', 'ByteForge BD', 'Level 2 Seller', 5000, 3, 4.8, 41, '{website,speed,performance}', 'web_development', false, false, 8)
) AS v(slug, title, desc, seller, level, price, days, rating, reviews, tags, row_group, popular, featured, ord)
WHERE c.slug = 'web-development'
ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id, title = EXCLUDED.title, price_from = EXCLUDED.price_from, tags = EXCLUDED.tags, row_group = EXCLUDED.row_group, sort_order = EXCLUDED.sort_order;

-- App
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, tags, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.desc, v.seller, v.level, v.price, v.days, v.rating, v.reviews, v.tags::text[], v.row_group, v.popular, v.featured, v.ord
FROM marketplace_categories c
CROSS JOIN (VALUES
  ('android-app', 'Android App', 'Native Android application.', 'CodeBridge BD', 'Top Rated Seller', 45000, 21, 4.9, 89, '{android,mobile-app,app}', 'app_development', true, false, 1),
  ('ios-app', 'iOS App', 'Native iOS application.', 'TechPark Solutions', 'Level 2 Seller', 60000, 28, 4.8, 72, '{ios,mobile-app,app}', 'app_development', false, false, 2),
  ('flutter-app', 'Flutter App', 'Cross-platform Flutter app.', 'Dhaka Dev Studio', 'Pro Seller', 65000, 28, 4.8, 66, '{flutter,cross-platform,app}', 'app_development', false, false, 3),
  ('react-native-app', 'React Native App', 'React Native mobile app.', 'CloudNine IT', 'Top Rated Seller', 70000, 30, 4.9, 58, '{react-native,mobile-app,app}', 'app_development', false, true, 4),
  ('delivery-app', 'Delivery App', 'On-demand delivery application.', 'NexGen Bangladesh', 'Level 2 Seller', 120000, 45, 4.9, 44, '{delivery,logistics,app}', 'app_development', false, true, 5),
  ('ecommerce-app', 'Ecommerce App', 'Mobile ecommerce marketplace app.', 'Studio 71 Digital', 'Pro Seller', 95000, 40, 4.8, 37, '{ecommerce,mobile-app,marketplace}', 'app_development', false, false, 6),
  ('booking-app', 'Booking App', 'Appointment and booking app.', 'GreenCode Labs', 'Top Rated Seller', 85000, 35, 4.9, 51, '{booking,appointment,app}', 'app_development', true, false, 7),
  ('lms-app', 'LMS App', 'Learning management mobile app.', 'ByteForge BD', 'Level 2 Seller', 110000, 42, 4.7, 93, '{lms,education,app}', 'app_development', false, false, 8)
) AS v(slug, title, desc, seller, level, price, days, rating, reviews, tags, row_group, popular, featured, ord)
WHERE c.slug = 'app-development'
ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id, title = EXCLUDED.title, price_from = EXCLUDED.price_from, tags = EXCLUDED.tags, row_group = EXCLUDED.row_group, sort_order = EXCLUDED.sort_order;

-- Digital marketing + AI (popular row)
INSERT INTO marketplace_services (category_id, slug, title, short_description, seller_name, seller_level, price_from, delivery_days, rating, review_count, tags, row_group, is_popular, is_featured, sort_order)
SELECT c.id, v.slug, v.title, v.desc, v.seller, v.level, v.price, v.days, v.rating, v.reviews, v.tags::text[], v.row_group, v.popular, v.featured, v.ord
FROM marketplace_categories c
INNER JOIN (VALUES
  ('facebook-ads', 'Facebook Ads', 'Facebook ads campaign setup.', 'Studio 71 Digital', 'Top Rated Seller', 5000, 3, 4.9, 156, '{facebook-ads,social-media,marketing}', 'popular', true, false, 1, 'digital-marketing'),
  ('google-ads', 'Google Ads', 'Google Ads management.', 'GreenCode Labs', 'Level 2 Seller', 8000, 5, 4.8, 134, '{google-ads,ppc,marketing}', 'popular', false, false, 2, 'digital-marketing'),
  ('seo-optimization', 'SEO Optimization', 'On-page and technical SEO.', 'ByteForge BD', 'Pro Seller', 10000, 7, 4.9, 112, '{seo,search,marketing}', 'popular', true, false, 3, 'digital-marketing'),
  ('social-media-marketing', 'Social Media Marketing', 'Social media growth and ads.', 'CodeBridge BD', 'Top Rated Seller', 7000, 5, 4.8, 98, '{social-media,marketing,content}', 'popular', false, false, 4, 'digital-marketing'),
  ('content-strategy', 'Content Strategy', 'Content marketing strategy.', 'TechPark Solutions', 'Level 2 Seller', 6000, 5, 4.7, 88, '{content,strategy,marketing}', 'popular', false, false, 5, 'digital-marketing'),
  ('lead-generation', 'Lead Generation', 'B2B lead generation campaigns.', 'Dhaka Dev Studio', 'Pro Seller', 12000, 10, 4.8, 67, '{leads,funnel,marketing}', 'popular', false, false, 6, 'digital-marketing'),
  ('funnel-setup', 'Funnel Setup', 'Sales funnel setup and optimization.', 'CloudNine IT', 'Top Rated Seller', 15000, 10, 4.9, 55, '{funnel,conversion,marketing}', 'popular', false, true, 7, 'digital-marketing'),
  ('video-marketing', 'Video Marketing', 'Video ads and promo content.', 'NexGen Bangladesh', 'Level 2 Seller', 9000, 6, 4.8, 121, '{video,marketing,ads}', 'popular', false, false, 8, 'digital-marketing'),
  ('ai-chatbot', 'AI Chatbot', 'AI chatbot for websites and apps.', 'CodeBridge BD', 'Top Rated Seller', 15000, 10, 4.9, 67, '{ai,chatbot,automation}', 'popular', false, true, 9, 'ai-automations'),
  ('whatsapp-automation', 'WhatsApp Automation', 'WhatsApp business automation.', 'TechPark Solutions', 'Level 2 Seller', 12000, 7, 4.9, 58, '{whatsapp,automation,messaging}', 'popular', true, false, 10, 'ai-automations'),
  ('crm-automation', 'CRM Automation', 'CRM workflow automation.', 'Dhaka Dev Studio', 'Pro Seller', 18000, 12, 4.8, 45, '{crm,automation,workflow}', 'popular', false, false, 11, 'ai-automations'),
  ('ai-sales-assistant', 'AI Sales Assistant', 'AI-powered sales assistant.', 'CloudNine IT', 'Top Rated Seller', 25000, 14, 4.9, 39, '{ai,sales,assistant}', 'popular', false, false, 12, 'ai-automations'),
  ('ai-customer-support', 'AI Customer Support', 'AI support bot and ticketing.', 'NexGen Bangladesh', 'Level 2 Seller', 20000, 12, 4.8, 42, '{ai,support,customer-service}', 'popular', false, false, 13, 'ai-automations'),
  ('ai-lead-qualification', 'AI Lead Qualification', 'Automated lead scoring.', 'Studio 71 Digital', 'Pro Seller', 22000, 14, 4.8, 36, '{ai,leads,qualification}', 'popular', false, false, 14, 'ai-automations'),
  ('ai-workflow-system', 'AI Workflow System', 'End-to-end AI workflows.', 'GreenCode Labs', 'Top Rated Seller', 30000, 18, 4.9, 28, '{ai,workflow,automation}', 'popular', false, true, 15, 'ai-automations'),
  ('ai-voice-assistant', 'AI Voice Assistant', 'Voice AI for call centers.', 'ByteForge BD', 'Level 2 Seller', 35000, 21, 4.7, 24, '{ai,voice,assistant}', 'popular', false, false, 16, 'ai-automations')
) AS v(slug, title, desc, seller, level, price, days, rating, reviews, tags, row_group, popular, featured, ord, cat_slug)
  ON c.slug = v.cat_slug
ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id, title = EXCLUDED.title, price_from = EXCLUDED.price_from, tags = EXCLUDED.tags, row_group = EXCLUDED.row_group, sort_order = EXCLUDED.sort_order;
