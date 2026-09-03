-- Archive obsolete marketplace / multi-service catalog from public surfaces.
-- Does NOT drop tables, auth users, profiles, or BITP operational rows.

-- Hide BITP solution catalog from public (orders still reference these rows)
update public.products
set status = 'archived',
    updated_at = now()
where status = 'published';

-- Marketplace gigs / products: stop public SELECT leaks
drop policy if exists "Public read marketplace_services" on public.marketplace_services;
drop policy if exists "Public read marketplace_products" on public.marketplace_products;
drop policy if exists "Public read marketplace_categories" on public.marketplace_categories;
drop policy if exists "Public read marketplace_product_categories" on public.marketplace_product_categories;

create policy "Staff read marketplace_services"
  on public.marketplace_services for select
  to authenticated
  using (public.is_admin());

create policy "Staff read marketplace_products"
  on public.marketplace_products for select
  to authenticated
  using (public.is_admin());

create policy "Staff read marketplace_categories"
  on public.marketplace_categories for select
  to authenticated
  using (public.is_admin());

create policy "Staff read marketplace_product_categories"
  on public.marketplace_product_categories for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Public read marketplace_sellers" on public.marketplace_sellers;
drop policy if exists "Staff read marketplace_sellers" on public.marketplace_sellers;
create policy "Staff read marketplace_sellers"
  on public.marketplace_sellers for select
  to authenticated
  using (public.is_admin());
