-- Enforce commercial listing floor: no published showcase under ৳10,000.
-- Deterministic backfill only — does not invent random prices.

-- Website templates: prior seed used ৳5,000; lift to mid simple-website band.
update public.ecommerce_projects
set
  starting_price = 15000,
  updated_at = now()
where deleted_at is null
  and starting_price is not null
  and starting_price > 0
  and starting_price < 10000;

-- Software: floor remaining under-minimum rows.
update public.software_projects
set
  starting_price = 10000,
  price_suffix = coalesce(nullif(trim(price_suffix), ''), '+'),
  updated_at = now()
where deleted_at is null
  and starting_price is not null
  and starting_price > 0
  and starting_price < 10000;

-- Creative/marketing: floor commercial starting prices (skip custom quotes).
update public.creative_marketing_projects
set
  starting_price = 10000,
  price_suffix = coalesce(nullif(trim(price_suffix), ''), '+'),
  updated_at = now()
where deleted_at is null
  and coalesce(pricing_model, '') <> 'custom'
  and starting_price is not null
  and starting_price > 0
  and starting_price < 10000;
