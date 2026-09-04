-- Align BITP products.product_type with public Products & Services menu.
-- Keeps existing rows by remapping legacy values.

-- Remap legacy values first (product_type is typically unconstrained text)
update public.products
set product_type = case product_type
  when 'website' then 'ecommerce_website'
  when 'software' then 'software_solution'
  when 'subscription' then 'saas'
  when 'service' then 'custom_development'
  when 'marketing' then 'custom_development'
  when 'creative' then 'custom_development'
  when 'digital_product' then 'custom_development'
  else product_type
end
where product_type in (
  'website',
  'software',
  'subscription',
  'service',
  'marketing',
  'creative',
  'digital_product'
);
