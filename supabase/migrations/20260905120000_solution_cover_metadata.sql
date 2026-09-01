-- Solution cover image metadata (path, alt, prompt, timestamp)
-- Reuses existing cover_image / thumbnail_url columns as public URLs.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cover_image_path text,
  ADD COLUMN IF NOT EXISTS cover_image_alt text,
  ADD COLUMN IF NOT EXISTS cover_image_prompt text,
  ADD COLUMN IF NOT EXISTS cover_image_updated_at timestamptz;

ALTER TABLE public.marketplace_services
  ADD COLUMN IF NOT EXISTS cover_image_path text,
  ADD COLUMN IF NOT EXISTS cover_image_alt text,
  ADD COLUMN IF NOT EXISTS cover_image_prompt text,
  ADD COLUMN IF NOT EXISTS cover_image_updated_at timestamptz;

ALTER TABLE public.marketplace_products
  ADD COLUMN IF NOT EXISTS cover_image_path text,
  ADD COLUMN IF NOT EXISTS cover_image_alt text,
  ADD COLUMN IF NOT EXISTS cover_image_prompt text,
  ADD COLUMN IF NOT EXISTS cover_image_updated_at timestamptz;
