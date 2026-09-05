-- Upsert premium screen slots for ecommerce-admin-dashboard, feed-mill-erp, garments-erp.
-- Does not delete existing screens with other keys; sets titles/sort for canonical keys.

with targets(slug, screen_key, screen_name, module_name, sort_order, is_featured) as (
  values
    -- E-commerce Admin
    ('ecommerce-admin-dashboard', 'dashboard-overview', 'Dashboard Overview', 'Dashboard', 10, true),
    ('ecommerce-admin-dashboard', 'products', 'Product Management', 'Products', 20, false),
    ('ecommerce-admin-dashboard', 'orders', 'Orders Management', 'Orders', 30, false),
    ('ecommerce-admin-dashboard', 'inventory', 'Inventory / Stock', 'Inventory', 40, false),
    ('ecommerce-admin-dashboard', 'courier', 'Courier Management', 'Courier', 50, false),
    ('ecommerce-admin-dashboard', 'customers', 'Customer Management', 'Customers', 60, false),
    ('ecommerce-admin-dashboard', 'analytics', 'Analytics', 'Analytics', 70, false),
    ('ecommerce-admin-dashboard', 'discounts', 'Discounts / Promotions', 'Promotions', 80, false),
    ('ecommerce-admin-dashboard', 'payments', 'Payment / Transaction', 'Payments', 90, false),
    ('ecommerce-admin-dashboard', 'settings', 'Settings', 'Settings', 100, false),
    -- Feed Mill ERP
    ('feed-mill-erp', 'dashboard', 'Feed Mill Dashboard', 'Dashboard', 10, true),
    ('feed-mill-erp', 'raw-purchase', 'Raw Material Purchase', 'Purchase', 20, false),
    ('feed-mill-erp', 'raw-stock', 'Raw Material Stock', 'Stock', 30, false),
    ('feed-mill-erp', 'formula', 'Formula / Recipe Management', 'Formula', 40, false),
    ('feed-mill-erp', 'production-planning', 'Production Planning', 'Planning', 50, false),
    ('feed-mill-erp', 'daily-production', 'Daily Feed Production', 'Production', 60, false),
    ('feed-mill-erp', 'finished-stock', 'Finished Goods Stock', 'Finished Goods', 70, false),
    ('feed-mill-erp', 'sales-delivery', 'Sales & Delivery', 'Sales', 80, false),
    ('feed-mill-erp', 'dealer-due', 'Dealer / Customer Due', 'Accounts', 90, false),
    ('feed-mill-erp', 'accounts-pnl', 'Accounts / Profit & Loss', 'Accounts', 100, false),
    -- Garments ERP
    ('garments-erp', 'dashboard', 'Garments Dashboard', 'Dashboard', 10, true),
    ('garments-erp', 'sales-orders', 'Sales Orders', 'Sales', 20, false),
    ('garments-erp', 'order-details', 'Order Details', 'Orders', 30, false),
    ('garments-erp', 'cutting', 'Cutting', 'Production', 40, false),
    ('garments-erp', 'sewing', 'Sewing', 'Production', 50, false),
    ('garments-erp', 'finishing', 'Finishing', 'Production', 60, false),
    ('garments-erp', 'quality-control', 'Quality Control', 'QC', 70, false),
    ('garments-erp', 'packing', 'Packing', 'Packing', 80, false),
    ('garments-erp', 'ready-stock', 'Ready Stock', 'Stock', 90, false),
    ('garments-erp', 'delivery-billing', 'Delivery / Billing', 'Delivery', 100, false)
)
insert into public.software_project_screens (
  project_id, screen_key, screen_name, module_name, sort_order, is_featured, published
)
select
  p.id,
  t.screen_key,
  t.screen_name,
  t.module_name,
  t.sort_order,
  t.is_featured,
  true
from targets t
join public.software_projects p
  on p.slug = t.slug
 and p.deleted_at is null
where not exists (
  select 1
  from public.software_project_screens s
  where s.project_id = p.id
    and s.screen_key = t.screen_key
    and s.deleted_at is null
);

-- Update titles/sort for existing matching keys
update public.software_project_screens s
set
  screen_name = t.screen_name,
  module_name = t.module_name,
  sort_order = t.sort_order,
  is_featured = t.is_featured,
  published = true,
  updated_at = now()
from (
  values
    ('ecommerce-admin-dashboard', 'dashboard-overview', 'Dashboard Overview', 'Dashboard', 10, true),
    ('ecommerce-admin-dashboard', 'products', 'Product Management', 'Products', 20, false),
    ('ecommerce-admin-dashboard', 'orders', 'Orders Management', 'Orders', 30, false),
    ('ecommerce-admin-dashboard', 'inventory', 'Inventory / Stock', 'Inventory', 40, false),
    ('ecommerce-admin-dashboard', 'courier', 'Courier Management', 'Courier', 50, false),
    ('ecommerce-admin-dashboard', 'customers', 'Customer Management', 'Customers', 60, false),
    ('ecommerce-admin-dashboard', 'analytics', 'Analytics', 'Analytics', 70, false),
    ('ecommerce-admin-dashboard', 'discounts', 'Discounts / Promotions', 'Promotions', 80, false),
    ('ecommerce-admin-dashboard', 'payments', 'Payment / Transaction', 'Payments', 90, false),
    ('ecommerce-admin-dashboard', 'settings', 'Settings', 'Settings', 100, false),
    ('feed-mill-erp', 'dashboard', 'Feed Mill Dashboard', 'Dashboard', 10, true),
    ('feed-mill-erp', 'raw-purchase', 'Raw Material Purchase', 'Purchase', 20, false),
    ('feed-mill-erp', 'raw-stock', 'Raw Material Stock', 'Stock', 30, false),
    ('feed-mill-erp', 'formula', 'Formula / Recipe Management', 'Formula', 40, false),
    ('feed-mill-erp', 'production-planning', 'Production Planning', 'Planning', 50, false),
    ('feed-mill-erp', 'daily-production', 'Daily Feed Production', 'Production', 60, false),
    ('feed-mill-erp', 'finished-stock', 'Finished Goods Stock', 'Finished Goods', 70, false),
    ('feed-mill-erp', 'sales-delivery', 'Sales & Delivery', 'Sales', 80, false),
    ('feed-mill-erp', 'dealer-due', 'Dealer / Customer Due', 'Accounts', 90, false),
    ('feed-mill-erp', 'accounts-pnl', 'Accounts / Profit & Loss', 'Accounts', 100, false),
    ('garments-erp', 'dashboard', 'Garments Dashboard', 'Dashboard', 10, true),
    ('garments-erp', 'sales-orders', 'Sales Orders', 'Sales', 20, false),
    ('garments-erp', 'order-details', 'Order Details', 'Orders', 30, false),
    ('garments-erp', 'cutting', 'Cutting', 'Production', 40, false),
    ('garments-erp', 'sewing', 'Sewing', 'Production', 50, false),
    ('garments-erp', 'finishing', 'Finishing', 'Production', 60, false),
    ('garments-erp', 'quality-control', 'Quality Control', 'QC', 70, false),
    ('garments-erp', 'packing', 'Packing', 'Packing', 80, false),
    ('garments-erp', 'ready-stock', 'Ready Stock', 'Stock', 90, false),
    ('garments-erp', 'delivery-billing', 'Delivery / Billing', 'Delivery', 100, false)
) as t(slug, screen_key, screen_name, module_name, sort_order, is_featured)
join public.software_projects p
  on p.slug = t.slug
 and p.deleted_at is null
where s.project_id = p.id
  and s.screen_key = t.screen_key
  and s.deleted_at is null;
