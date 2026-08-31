-- Product media storage bucket for Bridge IT Park admin uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product media" on storage.objects;
create policy "Public read product media"
  on storage.objects for select
  to public
  using (bucket_id = 'product-media');

drop policy if exists "Admins insert product media" on storage.objects;
create policy "Admins insert product media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-media' and public.is_admin());

drop policy if exists "Admins update product media" on storage.objects;
create policy "Admins update product media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-media' and public.is_admin())
  with check (bucket_id = 'product-media' and public.is_admin());

drop policy if exists "Admins delete product media" on storage.objects;
create policy "Admins delete product media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-media' and public.is_admin());
