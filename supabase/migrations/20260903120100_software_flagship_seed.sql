-- Software flagship seed — 5 showroom solutions
-- Archives legacy 3 products; adds 5 new flagships

-- Archive legacy software products
update public.products
set status = 'archived', sort_order = 99, updated_at = now()
where slug in ('custom-erp-software', 'pos-inventory-software', 'hr-payroll-software');

-- Update software-solutions category description
update public.categories
set
  description = 'Custom business software from stock management to enterprise automation. Live demo, compare packages, order online.',
  updated_at = now()
where slug = 'software-solutions';

-- ─── Stage templates ───
insert into public.project_stage_templates (slug, name, description)
values
  ('basic-stock-delivery', 'Basic Stock Software Delivery', 'Entry-level inventory system delivery'),
  ('business-mgmt-delivery', 'Business Management Delivery', 'Trading business software delivery'),
  ('advanced-erp-delivery', 'Advanced ERP Delivery', 'SME ERP delivery workflow'),
  ('manufacturing-erp-delivery', 'Manufacturing ERP Delivery', 'Production ERP delivery workflow'),
  ('enterprise-automation-delivery', 'Enterprise Automation Delivery', 'Enterprise ERP delivery workflow')
on conflict (slug) do update set name = excluded.name, description = excluded.description, updated_at = now();

-- Basic stock delivery steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.product_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Order Confirmed', 'Confirm order and assign project manager', 1),
  ('Business Analysis', 'Understand stock items, suppliers, and sales process', 2),
  ('Requirement Finalized', 'Lock modules, reports, and user roles', 3),
  ('UI/UX Design', 'Design dashboard, forms, and reports', 4),
  ('Development', 'Build stock, purchase, sales modules', 5),
  ('Module Testing', 'Test purchase-to-sale workflow', 6),
  ('Client Review', 'Client UAT and feedback', 7),
  ('Data Setup', 'Import opening stock and master data', 8),
  ('Training', 'Train staff on daily operations', 9),
  ('Final Delivery', 'Go live and handover', 10)
) as s(title, product_description, sort_order)
where t.slug = 'basic-stock-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Manufacturing delivery steps (extended)
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.product_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Order Confirmed', 'Confirm scope and timeline', 1),
  ('Business Analysis', 'Map raw materials, BOM, production steps', 2),
  ('Requirement Finalized', 'Finalize production workflow and costing', 3),
  ('UI/UX Design', 'Design production and inventory screens', 4),
  ('Development', 'Build RM, BOM, production, costing modules', 5),
  ('Production Module Testing', 'Test full production cycle', 6),
  ('Integration Testing', 'Test sales, stock, accounts integration', 7),
  ('Client Review', 'Factory team UAT', 8),
  ('Data Setup', 'Import RM, FG, opening stock', 9),
  ('Training', 'Train production and accounts team', 10),
  ('Final Delivery', 'Go live at factory', 11)
) as s(title, product_description, sort_order)
where t.slug = 'manufacturing-erp-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Enterprise delivery steps
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.product_description, s.sort_order
from public.project_stage_templates t
cross join (values
  ('Order Confirmed', 'Kickoff with stakeholders', 1),
  ('Business Analysis', 'Department-wise workflow mapping', 2),
  ('Requirement Finalized', 'Scope, integrations, approval flows', 3),
  ('Solution Architecture', 'Design modules, roles, data model', 4),
  ('UI/UX Design', 'Design dashboards per department', 5),
  ('Phase 1 Development', 'Core procurement, inventory, production', 6),
  ('Phase 2 Development', 'Sales, accounts, HR modules', 7),
  ('Integration', 'Connect existing systems if needed', 8),
  ('UAT & Client Review', 'Department-wise testing', 9),
  ('Data Migration', 'Migrate master and opening data', 10),
  ('Training', 'Train all departments', 11),
  ('Final Delivery', 'Enterprise go-live', 12)
) as s(title, product_description, sort_order)
where t.slug = 'enterprise-automation-delivery'
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- Copy basic steps to business-mgmt and advanced-erp (reuse basic-stock steps)
insert into public.project_stage_template_steps (template_id, title, description, sort_order)
select t.id, s.title, s.description, s.sort_order
from public.project_stage_templates t
join public.project_stage_templates src on src.slug = 'basic-stock-delivery'
join public.project_stage_template_steps s on s.template_id = src.id
where t.slug in ('business-mgmt-delivery', 'advanced-erp-delivery')
on conflict (template_id, sort_order) do update set title = excluded.title, description = excluded.description;

-- ─── Flagship products ───
insert into public.products (
  category_id, name, slug, short_description, full_description,
  product_type, pricing_type, starting_price, currency, delivery_time,
  status, featured, popular, sort_order, keywords,
  target_customer, internal_demo_slug, showroom_featured,
  demo_url, cover_image, seo_title, seo_description
)
select
  c.id,
  v.name, v.slug, v.short_desc, v.full_desc,
  'software', 'starting_from', v.price, 'BDT', v.delivery,
  'published', v.featured, v.popular, v.sort_order, v.keywords,
  v.target, v.demo_slug, true,
  '/demo/software/' || v.demo_slug,
  '/showroom/covers/software-' || v.slug || '.svg',
  v.seo_title, v.seo_desc
from public.categories c
cross join (values
  (
    'Basic Stock Management Software', 'basic-stock-management',
    'Simple real working stock/inventory system for small businesses.',
    'A practical stock management system for small shops, warehouses, traders, and wholesalers. Track products, purchases, sales, and current stock with basic income/expense and simple reports. Final software will be customized according to your business workflow.',
    10000.00, '7–14 days', true, true, 1,
    array['stock management', 'inventory', 'small business', 'warehouse'],
    'Small shop, warehouse, trader, wholesaler, small business.',
    'basic-stock',
    'Basic Stock Management Software | Bridge IT Park',
    'Starting from ৳10,000 — simple stock and inventory software with live demo.'
  ),
  (
    'Business Management Software', 'business-management-software',
    'Trading and distribution software with ledger, due, and profit/loss.',
    'Complete business management for trading, distribution, dealership, and wholesale. Includes stock, purchase, sales, customer/supplier ledger, due collection, expenses, returns, and profit/loss reports. Final software will be customized according to your business workflow.',
    20000.00, '14–21 days', true, true, 2,
    array['business management', 'ledger', 'due collection', 'trading'],
    'Trading, distribution, dealership, wholesale, retail businesses.',
    'business-management',
    'Business Management Software | Bridge IT Park',
    'Starting from ৳20,000 — trading software with ledger and live demo.'
  ),
  (
    'Advanced Business ERP', 'advanced-business-erp',
    'Growing SME ERP with multi-location, HR, and advanced reports.',
    'Advanced ERP for growing businesses with inventory, purchase, sales, stock transfer, returns, cash/bank, receivable/payable, employee management, roles, and business dashboard. Final software will be customized according to your business workflow.',
    50000.00, '21–35 days', true, true, 3,
    array['erp', 'sme', 'inventory', 'multi warehouse'],
    'Growing businesses, distributors, dealers, multi-department operations.',
    'advanced-erp',
    'Advanced Business ERP | Bridge IT Park',
    'Starting from ৳50,000 — SME ERP with live interactive demo.'
  ),
  (
    'Manufacturing & Production ERP', 'manufacturing-production-erp',
    'Production ERP with BOM, batch production, and costing for factories.',
    'Manufacturing ERP for factories: raw materials, BOM/recipe, production orders, material issue, finished goods, wastage, production costing, and profitability reports. Includes Cleaning Products Factory demo scenario. Final software will be customized according to your business workflow.',
    100000.00, '35–60 days', true, true, 4,
    array['manufacturing erp', 'production', 'bom', 'factory'],
    'Manufacturing factories and production businesses.',
    'manufacturing-erp',
    'Manufacturing & Production ERP | Bridge IT Park',
    'Starting from ৳100,000 — production ERP with interactive factory demo.'
  ),
  (
    'Enterprise Business Automation ERP', 'enterprise-business-automation',
    'Complete business automation for complex multi-department operations.',
    'Enterprise-grade automation: procurement, approvals, manufacturing, quality, sales orders, delivery, accounts, HR, payroll, roles, audit trail, and management dashboard. Final scope and pricing depend on your requirements.',
    200000.00, '60–120 days', true, false, 5,
    array['enterprise erp', 'automation', 'manufacturing', 'approval workflow'],
    'Complex manufacturing, garments, feed mills, large trading, multi-department businesses.',
    'enterprise-automation',
    'Enterprise Business Automation ERP | Bridge IT Park',
    'Starting from ৳200,000+ — enterprise automation with live demo.'
  )
) as v(name, slug, short_desc, full_desc, price, delivery, featured, popular, sort_order, keywords, target, demo_slug, seo_title, seo_desc)
where c.slug = 'software-solutions'
on conflict (slug) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  starting_price = excluded.starting_price,
  delivery_time = excluded.delivery_time,
  target_customer = excluded.target_customer,
  internal_demo_slug = excluded.internal_demo_slug,
  showroom_featured = excluded.showroom_featured,
  demo_url = excluded.demo_url,
  cover_image = excluded.cover_image,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = 'published',
  sort_order = excluded.sort_order,
  updated_at = now();

-- ─── Packages ───
insert into public.product_packages (product_id, name, subtitle, price, currency, billing_type, delivery_days, sort_order, active, highlighted)
select p.id, 'Complete Package', v.subtitle, v.price, 'BDT', 'one_time', v.days, 1, true, true
from public.products p
join (values
  ('basic-stock-management', 'Full stock management system', 10000.00, 10),
  ('business-management-software', 'Trading + ledger system', 20000.00, 18),
  ('advanced-business-erp', 'SME ERP suite', 50000.00, 28),
  ('manufacturing-production-erp', 'Production ERP suite', 100000.00, 45),
  ('enterprise-business-automation', 'Enterprise automation suite', 200000.00, 90)
) as v(slug, subtitle, price, days) on p.slug = v.slug
on conflict (product_id, name) do update set
  price = excluded.price,
  subtitle = excluded.subtitle,
  delivery_days = excluded.delivery_days,
  updated_at = now();

-- ─── Package features ───
insert into public.package_features (package_id, feature_text, included, sort_order)
select pk.id, f.text, f.included, f.ord
from public.product_packages pk
join public.products p on p.id = pk.product_id
cross join (values
  ('basic-stock-management', 'Dashboard', true, 1),
  ('basic-stock-management', 'Products & Categories', true, 2),
  ('basic-stock-management', 'Purchase & Sales', true, 3),
  ('basic-stock-management', 'Stock In/Out tracking', true, 4),
  ('basic-stock-management', 'Low Stock alerts', true, 5),
  ('basic-stock-management', 'Basic Reports', true, 6),
  ('business-management-software', 'Everything in Basic Stock', true, 1),
  ('business-management-software', 'Customer & Supplier Ledger', true, 2),
  ('business-management-software', 'Due Collection', true, 3),
  ('business-management-software', 'Cash / Bank', true, 4),
  ('business-management-software', 'Profit/Loss Report', true, 5),
  ('advanced-business-erp', 'Everything in Business Management', true, 1),
  ('advanced-business-erp', 'Multi Warehouse ready', true, 2),
  ('advanced-business-erp', 'Stock Transfer', true, 3),
  ('advanced-business-erp', 'Employee Management', true, 4),
  ('advanced-business-erp', 'User Roles', true, 5),
  ('manufacturing-production-erp', 'Raw Materials & FG', true, 1),
  ('manufacturing-production-erp', 'BOM / Recipe', true, 2),
  ('manufacturing-production-erp', 'Production Orders', true, 3),
  ('manufacturing-production-erp', 'Production Costing', true, 4),
  ('manufacturing-production-erp', 'Wastage tracking', true, 5),
  ('enterprise-business-automation', 'Procurement & Approval', true, 1),
  ('enterprise-business-automation', 'Manufacturing + QC', true, 2),
  ('enterprise-business-automation', 'Sales Order & Delivery', true, 3),
  ('enterprise-business-automation', 'HR & Payroll architecture', true, 4),
  ('enterprise-business-automation', 'Audit Trail & Management Dashboard', true, 5)
) as f(slug, text, included, ord)
where p.slug = f.slug and pk.name = 'Complete Package'
on conflict do nothing;

-- ─── Stage template links ───
delete from public.product_stage_templates
where product_id in (select id from public.products where slug like '%-management%' or slug like '%-erp%' or slug like '%-automation%');

insert into public.product_stage_templates (product_id, template_id)
select p.id, t.id
from public.products p
join public.project_stage_templates t on t.slug = case p.slug
  when 'basic-stock-management' then 'basic-stock-delivery'
  when 'business-management-software' then 'business-mgmt-delivery'
  when 'advanced-business-erp' then 'advanced-erp-delivery'
  when 'manufacturing-production-erp' then 'manufacturing-erp-delivery'
  else 'enterprise-automation-delivery'
end
where p.slug in (
  'basic-stock-management', 'business-management-software', 'advanced-business-erp',
  'manufacturing-production-erp', 'enterprise-business-automation'
)
on conflict (product_id) do update set template_id = excluded.template_id;

-- ─── Requirement fields (common) ───
insert into public.product_requirement_fields (product_id, field_key, label, field_type, required, placeholder, help_text, sort_order, active, options)
select p.id, f.field_key, f.label, f.field_type, f.required, f.placeholder, f.help_text, f.sort_order, true, f.options
from public.products p
cross join (values
  ('business_name', 'Business Name', 'text', true, 'Your company name', null, 1, '[]'::jsonb),
  ('business_type', 'Business Type', 'select', true, null, null, 2, '["Retail","Wholesale","Manufacturing","Distribution","Other"]'::jsonb),
  ('user_count', 'Number of Users', 'number', true, '5', null, 3, '[]'::jsonb),
  ('main_problems', 'Main Problems to Solve', 'textarea', true, 'Describe your current challenges', null, 4, '[]'::jsonb),
  ('required_modules', 'Required Modules', 'multi_select', false, null, 'Select modules you need', 5, '["Stock","Purchase","Sales","Ledger","Production","HR","Accounts"]'::jsonb),
  ('existing_software', 'Existing Software', 'text', false, 'Excel, Tally, other ERP', null, 10, '[]'::jsonb),
  ('additional_notes', 'Additional Requirements', 'textarea', false, null, null, 20, '[]'::jsonb)
) as f(field_key, label, field_type, required, placeholder, help_text, sort_order, options)
where p.slug in (
  'basic-stock-management', 'business-management-software', 'advanced-business-erp',
  'manufacturing-production-erp', 'enterprise-business-automation'
)
on conflict do nothing;

-- Manufacturing-specific fields
insert into public.product_requirement_fields (product_id, field_key, label, field_type, required, placeholder, sort_order, active)
select p.id, f.field_key, f.label, f.field_type, f.required, f.placeholder, f.sort_order, true
from public.products p
cross join (values
  ('raw_materials', 'Raw Materials List', 'textarea', true, 'List your raw materials', 30),
  ('finished_products', 'Finished Products', 'textarea', true, 'List finished goods', 31),
  ('bom_required', 'BOM/Recipe Required?', 'radio', true, null, 32),
  ('warehouse_count', 'Number of Warehouses', 'number', false, '1', 33),
  ('batch_production', 'Batch Production?', 'checkbox', false, null, 34),
  ('production_costing', 'Production Costing Required?', 'checkbox', false, null, 35)
) as f(field_key, label, field_type, required, placeholder, sort_order)
where p.slug in ('manufacturing-production-erp', 'enterprise-business-automation')
on conflict do nothing;

-- Enterprise-specific fields
insert into public.product_requirement_fields (product_id, field_key, label, field_type, required, placeholder, sort_order, active, options)
select p.id, f.field_key, f.label, f.field_type, f.required, f.placeholder, f.sort_order, true, f.options
from public.products p
cross join (values
  ('departments', 'Departments', 'multi_select', true, null, 40, '["Procurement","Production","Sales","Accounts","HR","Management"]'::jsonb),
  ('approval_process', 'Approval Process Description', 'textarea', true, null, 41, '[]'::jsonb),
  ('integration_needs', 'Integration Needs', 'textarea', false, 'Tally, courier, payment gateway', 42, '[]'::jsonb)
) as f(field_key, label, field_type, required, placeholder, sort_order, options)
where p.slug = 'enterprise-business-automation'
on conflict do nothing;

-- ─── FAQs ───
insert into public.product_faqs (product_id, question, answer, sort_order, active)
select p.id, f.q, f.a, f.ord, true
from public.products p
cross join (values
  ('basic-stock-management', 'Is this a ready-made or custom software?', 'This is a starting package. Final software will be customized according to your business workflow.', 1),
  ('basic-stock-management', 'Can I try before ordering?', 'Yes — use the Live Demo to add products, purchases, and sales interactively.', 2),
  ('manufacturing-production-erp', 'Does the demo show real production workflow?', 'Yes — the demo includes raw material purchase, BOM, production batch, finished goods, and costing.', 1),
  ('enterprise-business-automation', 'Is ৳200,000 the final price?', 'No — this is starting from. Final scope and pricing depend on your requirements after consultation.', 1)
) as f(slug, q, a, ord)
where p.slug = f.slug
on conflict do nothing;

-- ─── Software demo configs ───
insert into public.software_demo_configs (
  product_id, internal_demo_slug, demo_title, business_type, demo_description,
  package_level, feature_flags, workflow_config, active
)
select p.id, p.internal_demo_slug, p.name, v.business_type, p.short_description,
  v.level, v.flags::jsonb, v.workflow::jsonb, true
from public.products p
join (values
  ('basic-stock-management', 'retail_trader', 1,
    '{"dashboard":true,"products":true,"purchase":true,"sales":true,"stock":true,"reports":true,"parties":false,"ledger":false,"payments":false,"expenses":false,"transfer":false,"bom":false,"production":false,"requisition":false,"approval":false}',
    '["Add Product","Opening Stock","Purchase","Sale","View Stock","View Report"]'),
  ('business-management-software', 'trading_distribution', 2,
    '{"dashboard":true,"products":true,"purchase":true,"sales":true,"stock":true,"reports":true,"parties":true,"ledger":true,"payments":true,"expenses":true,"transfer":false,"bom":false,"production":false,"requisition":false,"approval":false}',
    '["Purchase","Stock","Sale","Customer Due","Collection","Expense","Ledger"]'),
  ('advanced-business-erp', 'growing_sme', 3,
    '{"dashboard":true,"products":true,"purchase":true,"sales":true,"stock":true,"reports":true,"parties":true,"ledger":true,"payments":true,"expenses":true,"transfer":true,"returns":true,"accounts":true,"employees":true,"roles":true,"bom":false,"production":false,"requisition":false,"approval":false}',
    '["Purchase","Receive Stock","Transfer","Sale","Collection","Accounts","Reports"]'),
  ('manufacturing-production-erp', 'cleaning_products_factory', 4,
    '{"dashboard":true,"products":true,"purchase":true,"sales":true,"stock":true,"reports":true,"parties":true,"ledger":true,"payments":true,"expenses":true,"transfer":true,"bom":true,"production":true,"costing":true,"wastage":true,"requisition":false,"approval":false}',
    '["Purchase RM","Create BOM","Production Order","Issue RM","Complete Production","Sell FG","View Cost"]'),
  ('enterprise-business-automation', 'enterprise_multi_dept', 5,
    '{"dashboard":true,"products":true,"purchase":true,"sales":true,"stock":true,"reports":true,"parties":true,"ledger":true,"payments":true,"expenses":true,"transfer":true,"bom":true,"production":true,"costing":true,"wastage":true,"requisition":true,"approval":true,"salesOrders":true,"delivery":true,"audit":true}',
    '["Requisition","Approval","Production","Sales Order","Delivery","Collection","Management Report"]')
) as v(slug, business_type, level, flags, workflow) on p.slug = v.slug
on conflict (product_id) do update set
  feature_flags = excluded.feature_flags,
  workflow_config = excluded.workflow_config,
  business_type = excluded.business_type,
  package_level = excluded.package_level,
  updated_at = now();

-- ─── Demo modules per config ───
insert into public.software_demo_modules (demo_config_id, module_key, label, icon, sort_order, route_key, active)
select c.id, m.module_key, m.label, m.icon, m.sort_order, m.route_key, true
from public.software_demo_configs c
join public.products p on p.id = c.product_id
cross join (values
  ('basic-stock-management', 'dashboard', 'Dashboard', '📊', 1, 'dashboard'),
  ('basic-stock-management', 'products', 'Products', '📦', 2, 'products'),
  ('basic-stock-management', 'purchase', 'Purchase', '🛒', 3, 'purchase'),
  ('basic-stock-management', 'sales', 'Sales', '💰', 4, 'sales'),
  ('basic-stock-management', 'stock', 'Stock', '📋', 5, 'stock'),
  ('basic-stock-management', 'reports', 'Reports', '📈', 6, 'reports'),
  ('business-management-software', 'dashboard', 'Dashboard', '📊', 1, 'dashboard'),
  ('business-management-software', 'products', 'Products', '📦', 2, 'products'),
  ('business-management-software', 'purchase', 'Purchase', '🛒', 3, 'purchase'),
  ('business-management-software', 'sales', 'Sales', '💰', 4, 'sales'),
  ('business-management-software', 'parties', 'Parties', '👥', 5, 'parties'),
  ('business-management-software', 'payments', 'Payments', '💳', 6, 'payments'),
  ('business-management-software', 'expenses', 'Expenses', '📝', 7, 'expenses'),
  ('business-management-software', 'ledger', 'Ledger', '📒', 8, 'ledger'),
  ('business-management-software', 'reports', 'Reports', '📈', 9, 'reports'),
  ('advanced-business-erp', 'dashboard', 'Dashboard', '📊', 1, 'dashboard'),
  ('advanced-business-erp', 'products', 'Products', '📦', 2, 'products'),
  ('advanced-business-erp', 'purchase', 'Purchase', '🛒', 3, 'purchase'),
  ('advanced-business-erp', 'sales', 'Sales', '💰', 4, 'sales'),
  ('advanced-business-erp', 'transfer', 'Transfer', '🔄', 5, 'transfer'),
  ('advanced-business-erp', 'parties', 'Parties', '👥', 6, 'parties'),
  ('advanced-business-erp', 'payments', 'Payments', '💳', 7, 'payments'),
  ('advanced-business-erp', 'accounts', 'Accounts', '🏦', 8, 'accounts'),
  ('advanced-business-erp', 'reports', 'Reports', '📈', 9, 'reports'),
  ('manufacturing-production-erp', 'dashboard', 'Dashboard', '📊', 1, 'dashboard'),
  ('manufacturing-production-erp', 'products', 'Products', '📦', 2, 'products'),
  ('manufacturing-production-erp', 'purchase', 'Purchase', '🛒', 3, 'purchase'),
  ('manufacturing-production-erp', 'bom', 'BOM', '🧪', 4, 'bom'),
  ('manufacturing-production-erp', 'production', 'Production', '🏭', 5, 'production'),
  ('manufacturing-production-erp', 'sales', 'Sales', '💰', 6, 'sales'),
  ('manufacturing-production-erp', 'costing', 'Costing', '💵', 7, 'costing'),
  ('manufacturing-production-erp', 'reports', 'Reports', '📈', 8, 'reports'),
  ('enterprise-business-automation', 'dashboard', 'Dashboard', '📊', 1, 'dashboard'),
  ('enterprise-business-automation', 'requisition', 'Requisitions', '📋', 2, 'requisition'),
  ('enterprise-business-automation', 'approval', 'Approvals', '✅', 3, 'approval'),
  ('enterprise-business-automation', 'production', 'Production', '🏭', 4, 'production'),
  ('enterprise-business-automation', 'salesOrders', 'Sales Orders', '📦', 5, 'salesOrders'),
  ('enterprise-business-automation', 'delivery', 'Delivery', '🚚', 6, 'delivery'),
  ('enterprise-business-automation', 'payments', 'Collections', '💳', 7, 'payments'),
  ('enterprise-business-automation', 'reports', 'Management', '📈', 8, 'reports')
) as m(slug, module_key, label, icon, sort_order, route_key)
where p.slug = m.slug
on conflict (demo_config_id, module_key) do update set
  label = excluded.label,
  sort_order = excluded.sort_order;

-- ─── Seed sets ───
insert into public.software_demo_seed_sets (business_type, name, seed_data)
values
  ('retail_trader', 'Basic Retail Trader', '{"products":[{"sku":"P001","name":"Sample Product A","type":"finished","qty":50,"cost":100,"price":150},{"sku":"P002","name":"Sample Product B","type":"finished","qty":30,"cost":200,"price":280}],"parties":[]}'),
  ('trading_distribution', 'Trading Business', '{"products":[{"sku":"P001","name":"Rice 25kg","type":"finished","qty":100,"cost":1200,"price":1350},{"sku":"P002","name":"Oil 5L","type":"finished","qty":80,"cost":650,"price":720}],"parties":[{"type":"customer","name":"Karim Traders","balance":5000},{"type":"supplier","name":"Dhaka Wholesale","balance":0}]}'),
  ('growing_sme', 'Growing SME', '{"products":[{"sku":"P001","name":"Product Alpha","type":"finished","qty":200,"cost":500,"price":650},{"sku":"P002","name":"Product Beta","type":"finished","qty":150,"cost":800,"price":950}],"parties":[{"type":"customer","name":"City Mart","balance":12000},{"type":"supplier","name":"National Supplier","balance":0}]}'),
  ('cleaning_products_factory', 'Cleaning Products Factory', '{"products":[{"sku":"RM-A","name":"Chemical A","type":"raw","qty":500,"cost":80,"price":0},{"sku":"RM-B","name":"Chemical B","type":"raw","qty":400,"cost":60,"price":0},{"sku":"RM-C","name":"Bottle","type":"raw","qty":1000,"cost":15,"price":0},{"sku":"RM-D","name":"Label","type":"raw","qty":1000,"cost":5,"price":0},{"sku":"RM-E","name":"Cap","type":"raw","qty":1000,"cost":3,"price":0},{"sku":"FG-1","name":"Hand Wash","type":"finished","qty":0,"cost":0,"price":120},{"sku":"FG-2","name":"Dish Wash","type":"finished","qty":0,"cost":0,"price":95},{"sku":"FG-3","name":"Glass Cleaner","type":"finished","qty":0,"cost":0,"price":110}],"parties":[{"type":"customer","name":"Retail Chain BD","balance":0},{"type":"supplier","name":"Chemical Supplier Ltd","balance":0}],"boms":[{"name":"Hand Wash BOM","finished":"FG-1","lines":[{"raw":"RM-A","qty":2},{"raw":"RM-B","qty":1},{"raw":"RM-C","qty":1},{"raw":"RM-D","qty":1},{"raw":"RM-E","qty":1}]}]}'),
  ('enterprise_multi_dept', 'Enterprise Multi-Department', '{"products":[{"sku":"RM-1","name":"Raw Material 1","type":"raw","qty":1000,"cost":50,"price":0},{"sku":"FG-1","name":"Finished Product 1","type":"finished","qty":200,"cost":200,"price":350}],"parties":[{"type":"customer","name":"Enterprise Client A","balance":25000},{"type":"supplier","name":"Global Supplier","balance":0}]}')
on conflict (business_type) do update set seed_data = excluded.seed_data, name = excluded.name;
