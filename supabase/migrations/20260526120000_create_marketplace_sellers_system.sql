-- Marketplace sellers ecosystem (Deshi Fiverr)
-- Idempotent where possible

-- ─── Core seller profile ───
CREATE TABLE IF NOT EXISTS marketplace_sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  username text UNIQUE,
  title text NOT NULL,
  short_bio text,
  about text,
  avatar_url text,
  banner_url text,
  country text DEFAULT 'Bangladesh',
  city text,
  languages text[] DEFAULT ARRAY['English', 'Bengali'],
  experience_years integer DEFAULT 3,
  response_time text DEFAULT '1 hour',
  response_rate integer DEFAULT 98,
  delivery_rate integer DEFAULT 97,
  total_orders integer DEFAULT 0,
  happy_clients integer DEFAULT 0,
  queue_orders integer DEFAULT 0,
  rating numeric DEFAULT 4.9,
  total_reviews integer DEFAULT 0,
  starting_price integer DEFAULT 5000,
  availability_status text DEFAULT 'available',
  is_top_rated boolean DEFAULT false,
  is_verified boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  member_since date DEFAULT CURRENT_DATE,
  seller_level text DEFAULT 'Level 2 Seller',
  primary_category_slug text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_seller_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES marketplace_sellers(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_percentage integer NOT NULL CHECK (skill_percentage BETWEEN 1 AND 100),
  sort_order integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS marketplace_seller_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES marketplace_sellers(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_country text DEFAULT 'Bangladesh',
  client_avatar text,
  rating numeric NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text NOT NULL,
  project_title text,
  created_at date DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS marketplace_seller_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES marketplace_sellers(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  image_url text,
  technologies text[] DEFAULT '{}',
  project_url text,
  sort_order integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS marketplace_seller_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES marketplace_sellers(id) ON DELETE CASCADE,
  verification_type text NOT NULL,
  verified boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS marketplace_seller_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES marketplace_sellers(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  logo_url text,
  sort_order integer DEFAULT 0
);

-- ─── Link services to sellers ───
ALTER TABLE marketplace_services
  ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES marketplace_sellers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS seller_slug text,
  ADD COLUMN IF NOT EXISTS seller_avatar_url text;

CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_slug ON marketplace_sellers(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_primary_category ON marketplace_sellers(primary_category_slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_is_featured ON marketplace_sellers(is_featured);
CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_is_top_rated ON marketplace_sellers(is_top_rated);
CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_rating ON marketplace_sellers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_seller_id ON marketplace_services(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_seller_slug ON marketplace_services(seller_slug);

-- RLS
ALTER TABLE marketplace_sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_seller_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_seller_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_seller_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_seller_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read marketplace_sellers" ON marketplace_sellers;
CREATE POLICY "Public read marketplace_sellers" ON marketplace_sellers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read marketplace_seller_skills" ON marketplace_seller_skills;
CREATE POLICY "Public read marketplace_seller_skills" ON marketplace_seller_skills FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read marketplace_seller_reviews" ON marketplace_seller_reviews;
CREATE POLICY "Public read marketplace_seller_reviews" ON marketplace_seller_reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read marketplace_seller_portfolio" ON marketplace_seller_portfolio;
CREATE POLICY "Public read marketplace_seller_portfolio" ON marketplace_seller_portfolio FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read marketplace_seller_verifications" ON marketplace_seller_verifications;
CREATE POLICY "Public read marketplace_seller_verifications" ON marketplace_seller_verifications FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read marketplace_seller_clients" ON marketplace_seller_clients;
CREATE POLICY "Public read marketplace_seller_clients" ON marketplace_seller_clients FOR SELECT TO anon, authenticated USING (true);
