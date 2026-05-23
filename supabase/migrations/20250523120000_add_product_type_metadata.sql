-- Apply on existing Supabase projects created before product_type/metadata columns
alter table public.products
  add column if not exists product_type text not null default 'product' check (
    product_type in ('product', 'service', 'course', 'software', 'ad', 'digital-product')
  );

alter table public.products
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists products_product_type_idx on public.products (product_type);
