-- Solution cover images storage bucket (public read, admin write)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'solution-covers',
  'solution-covers',
  true,
  5242880,
  ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read solution covers" ON storage.objects;
CREATE POLICY "Public read solution covers"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'solution-covers');

DROP POLICY IF EXISTS "Admins insert solution covers" ON storage.objects;
CREATE POLICY "Admins insert solution covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'solution-covers' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update solution covers" ON storage.objects;
CREATE POLICY "Admins update solution covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'solution-covers' AND public.is_admin())
  WITH CHECK (bucket_id = 'solution-covers' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete solution covers" ON storage.objects;
CREATE POLICY "Admins delete solution covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'solution-covers' AND public.is_admin());
