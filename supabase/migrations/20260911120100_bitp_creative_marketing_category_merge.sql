-- Merge Graphics & Creative + Digital Marketing into Creative & Digital Marketing
-- Preserve original subgroup via products.service_group / service_subcategory.
-- Do not delete products.

alter table public.products
  add column if not exists service_group text,
  add column if not exists service_subcategory text,
  add column if not exists target_business text;

-- Ensure unified category exists (BITP uses is_active)
insert into public.categories (name, slug, description, sort_order, is_active)
values (
  'Creative & Digital Marketing',
  'creative-digital-marketing',
  'Creative design and performance marketing — social creatives, branding, Meta ads and growth.',
  3,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true;

-- Backfill service_group from legacy categories before remapping
update public.products p
set
  service_group = coalesce(nullif(p.service_group, ''), 'digital-marketing'),
  service_subcategory = coalesce(nullif(p.service_subcategory, ''), 'digital-marketing'),
  product_type = case
    when p.product_type in ('marketing', 'creative', 'custom_development') then 'creative_digital_marketing'
    else p.product_type
  end
from public.categories c
where p.category_id = c.id
  and c.slug = 'digital-marketing';

update public.products p
set
  service_group = coalesce(nullif(p.service_group, ''), 'graphics-design'),
  service_subcategory = coalesce(nullif(p.service_subcategory, ''), 'graphics-creative'),
  product_type = case
    when p.product_type in ('marketing', 'creative', 'custom_development') then 'creative_digital_marketing'
    else p.product_type
  end
from public.categories c
where p.category_id = c.id
  and c.slug = 'graphics-creative';

-- Remap products to unified category
update public.products p
set category_id = (
  select id from public.categories where slug = 'creative-digital-marketing' limit 1
)
from public.categories c
where p.category_id = c.id
  and c.slug in ('digital-marketing', 'graphics-creative');

-- Soft-hide legacy category rows (keep for audit; do not hard-delete)
update public.categories
set
  is_active = false,
  name = case slug
    when 'digital-marketing' then 'Digital Marketing (merged)'
    when 'graphics-creative' then 'Graphics & Creative (merged)'
    else name
  end
where slug in ('digital-marketing', 'graphics-creative');

create index if not exists idx_products_service_group
  on public.products (service_group);
