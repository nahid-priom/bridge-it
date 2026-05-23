# Data migration report — local demo → Supabase

Generated as part of Prompt 2 (seed). Static files under `/data` are **not deleted** yet; Prompt 3 will switch the app to read from Supabase.

## Seed command

```bash
# 1. Copy .env.example → .env.local and set Supabase keys
# 2. Run schema (supabase/schema.sql) + migration if needed:
#    supabase/migrations/20250523120000_add_product_type_metadata.sql
npm run seed:supabase
```

Uses **only** `SUPABASE_SERVICE_ROLE_KEY` inside `scripts/seed-supabase.ts` (server-side script). Never import the service role in app/client code.

## Source files scanned

| File | Migrated into |
|------|----------------|
| `data/categories.ts` | `categories` (12 homepage category keys/slugs) |
| `data/productCategories.ts` | `categories` (product-only keys + alias map for services) |
| `data/products.ts` | `products`, `product_images`, `product_tags` (`product_type: product`) |
| `data/productDetailContent.ts` | `products.metadata` (overview, included, process, faqs) |
| `data/productCategoryImages.ts` | `products.image_url` / `product_images` (via generated products) |
| `data/services.ts` | `products` (`product_type: service/course/software/ad`), `sellers`, service reviews |
| `data/additionalServices.ts` | `products` (included in `allMarketplaceServices`) |
| `data/additionalSellers.ts` | `sellers` (included in `allSellers`) |
| `data/reviews.ts` | `reviews` (generated per product slug) |
| `data/searchCatalog.ts` | Derived from services + sellers (no separate table; search uses `products` FTS) |
| `data/adminData.ts` | Not seeded (admin UI config only; no marketplace rows) |
| `data/heroContent.ts` | Not seeded (marketing copy) |
| `data/testimonials.ts` | Not seeded (homepage testimonials) |

## Unified products model

- **Products table** is the single marketplace listing store.
- Legacy **services** (`/services/[slug]`) are rows with `product_type` in:
  `service` | `course` | `software` | `ad` | `digital-product`
- Legacy **product catalog** (`/products/[slug]`) uses `product_type: product`.
- Service slugs preserved via `lib/slugs.ts` → `{title-slug}-{id}` (e.g. `professional-2d-character-animation-s1`).
- Product slugs preserved as `{categoryKey}-{title-slug}`.

Extra fields (overview, FAQs, currency, features, legacy IDs) live in `products.metadata` jsonb.

## Expected row counts (approximate)

Run `npm run seed:supabase` for live counts. Typical totals from demo generators:

| Entity | Approx. count |
|--------|----------------|
| Categories | ~16 (12 homepage + 4 product-only keys) |
| Sellers | ~45 (merged `allSellers` + product-only sellers) |
| Products | ~150+ (80 catalog products + ~70+ services) |
| Product images | 1+ per product (primary + gallery) |
| Product tags | 2–4 per product |
| Reviews | ~400+ product reviews + 4 sample service reviews |

## Slug preservation

| Route | Slug source |
|-------|-------------|
| `/products/[slug]` | `data/products.ts` → `products.slug` |
| `/services/[slug]` | `getServiceSlug(service)` from `data/services.ts` |
| `/sellers/[slug]` | `sellers.slug` from `allSellers` |
| `/categories/[slug]` | `categories.slug` (= category `key` / `id`) |

## Validation performed before insert

- Missing `categoryKey` on products
- Duplicate product slugs
- Missing `sellerSlug`
- Missing `image_url`
- Invalid `rating` / `price`
- Warnings for reviews pointing at unknown product slugs

## Replaceable after Prompt 3

When the app reads from `lib/db/*` with Supabase configured:

| File | Replace with |
|------|----------------|
| `data/products.ts` | `lib/db/products.ts` |
| `data/productCategories.ts` | `lib/db/categories.ts` + route adapters |
| `data/categories.ts` | `lib/db/categories.ts` (or extended category metadata table) |
| `data/services.ts` | `lib/db/products.ts` filtered by `product_type` |
| `data/additionalServices.ts` | (merged into products seed) |
| `data/additionalSellers.ts` | `lib/db/sellers.ts` |
| `data/reviews.ts` | `lib/db/reviews.ts` |
| `data/searchCatalog.ts` | `lib/db/search.ts` |
| `data/productDetailContent.ts` | `products.metadata` |

Keep until UI migration is done:

- `data/adminData.ts` — admin navigation/mock stats
- `data/heroContent.ts`, `data/testimonials.ts` — marketing sections

## Schema additions for this seed

- `products.product_type` — listing kind for services vs products
- `products.metadata` — JSON for detail page extras and legacy IDs

Apply `supabase/migrations/20250523120000_add_product_type_metadata.sql` on existing databases.
