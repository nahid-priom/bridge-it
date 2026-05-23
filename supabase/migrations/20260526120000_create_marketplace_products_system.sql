-- Product marketplace (ecommerce) — separate from service marketplace

CREATE TABLE IF NOT EXISTS marketplace_product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  category_id uuid NOT NULL REFERENCES marketplace_product_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  short_description text,
  full_description text,
  thumbnail_url text,
  gallery text[] DEFAULT '{}',
  price integer NOT NULL,
  compare_price integer,
  currency text DEFAULT 'BDT',
  stock integer DEFAULT 0,
  brand text,
  sku text,
  tags text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  rating numeric DEFAULT 4.8,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_product_categories_slug ON marketplace_product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_slug ON marketplace_products(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category_id ON marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_is_featured ON marketplace_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_is_popular ON marketplace_products(is_popular);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_tags_gin ON marketplace_products USING GIN (tags);

ALTER TABLE marketplace_product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read marketplace_product_categories" ON marketplace_product_categories;
CREATE POLICY "Public read marketplace_product_categories"
  ON marketplace_product_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read marketplace_products" ON marketplace_products;
CREATE POLICY "Public read marketplace_products"
  ON marketplace_products FOR SELECT TO anon, authenticated USING (true);

INSERT INTO marketplace_product_categories (slug, name, description, icon, sort_order, is_featured)
VALUES
  ('electronics', 'Electronics', 'Laptops, monitors & office tech', '💻', 1, true),
  ('gadgets', 'Gadgets & Accessories', 'Audio, wearables & peripherals', '🎧', 2, true),
  ('office-solutions', 'Office Solutions', 'POS, printers & business hardware', '🖨️', 3, true),
  ('smart-devices', 'Smart Devices', 'CCTV, locks & automation', '📷', 4, true),
  ('digital-products', 'Digital Products', 'Software licenses & templates', '📦', 5, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_featured = EXCLUDED.is_featured;

-- Seed products: run app fallback when empty, or extend this migration with full INSERT batch.
-- Categories above enable /products?category= filters immediately.
