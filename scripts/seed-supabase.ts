/**
 * Seeds all local /data demo content into Supabase.
 * Uses SUPABASE_SERVICE_ROLE_KEY only — never expose this key to the browser.
 *
 * Usage: npm run seed:supabase
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { deterministicUuid, loadDemoSeedData } from './seed/demo-data';
import { validateSeedData } from './seed/validate';

config({ path: '.env.local' });
config({ path: '.env' });

type SeedSummary = {
  categories: { upserted: number };
  sellers: { upserted: number };
  products: { upserted: number };
  productImages: { inserted: number };
  productTags: { inserted: number };
  reviews: { upserted: number };
  warnings: string[];
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

async function main() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const data = loadDemoSeedData();
  const validation = validateSeedData(data);

  console.log('\nBridge — Supabase seed validation');
  console.log('--------------------------------');
  for (const issue of validation.issues) {
    console.log(`[${issue.level.toUpperCase()}] ${issue.message}`);
  }

  if (!validation.ok) {
    console.error('\nSeed aborted due to validation errors.');
    process.exit(1);
  }

  const summary: SeedSummary = {
    categories: { upserted: 0 },
    sellers: { upserted: 0 },
    products: { upserted: 0 },
    productImages: { inserted: 0 },
    productTags: { inserted: 0 },
    reviews: { upserted: 0 },
    warnings: validation.issues.filter((i) => i.level === 'warn').map((i) => i.message),
  };

  console.log('\nSeeding categories...');
  const { data: categoryRows, error: categoryError } = await supabase
    .from('categories')
    .upsert(
      data.categories.map((c) => ({
        key: c.key,
        label: c.label,
        slug: c.slug,
        icon: c.icon,
        description: c.description,
        sort_order: c.sortOrder,
        is_active: true,
      })),
      { onConflict: 'key' }
    )
    .select('id, key');

  if (categoryError) throw new Error(`Categories upsert failed: ${categoryError.message}`);
  summary.categories.upserted = categoryRows?.length ?? 0;

  const categoryIdByKey = new Map((categoryRows ?? []).map((row) => [row.key, row.id]));

  console.log('Seeding sellers...');
  const { data: sellerRows, error: sellerError } = await supabase
    .from('sellers')
    .upsert(
      data.sellers.map((s) => ({
        slug: s.slug,
        name: s.name,
        tagline: s.tagline ?? null,
        avatar_url: s.avatarUrl ?? null,
        cover_image_url: s.coverImageUrl ?? null,
        description: s.description ?? null,
        location: s.location ?? null,
        category_key: s.categoryKey ?? null,
        rating: s.rating,
        review_count: s.reviewCount,
        verified: s.verified,
        seller_level: s.sellerLevel,
        completed_projects: s.completedProjects ?? 0,
        response_time: s.responseTime ?? null,
        joined_at: s.joinedAt ? new Date(s.joinedAt).toISOString() : new Date().toISOString(),
        is_public: true,
        status: 'active' as const,
      })),
      { onConflict: 'slug' }
    )
    .select('id, slug');

  if (sellerError) throw new Error(`Sellers upsert failed: ${sellerError.message}`);
  summary.sellers.upserted = sellerRows?.length ?? 0;

  const sellerIdBySlug = new Map((sellerRows ?? []).map((row) => [row.slug, row.id]));

  console.log('Seeding products (marketplace + services)...');
  const productRows = data.products.map((p) => {
    const categoryId = categoryIdByKey.get(p.categoryKey);
    const sellerId = sellerIdBySlug.get(p.sellerSlug);
    if (!categoryId) throw new Error(`Category not found for key: ${p.categoryKey}`);
    if (!sellerId) throw new Error(`Seller not found for slug: ${p.sellerSlug}`);

    return {
      slug: p.slug,
      title: p.title,
      short_description: p.shortDescription,
      description: p.description,
      category_id: categoryId,
      seller_id: sellerId,
      price: p.price,
      old_price: p.oldPrice ?? null,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      delivery_time: p.deliveryTime,
      image_url: p.imageUrl,
      badge: p.badge ?? null,
      seller_level: p.sellerLevel,
      is_featured: p.isFeatured,
      is_promoted: p.isPromoted,
      product_type: p.productType,
      metadata: p.metadata,
      status: 'active' as const,
      created_at: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    };
  });

  const productIdBySlug = new Map<string, string>();

  for (const batch of chunk(productRows, 50)) {
    const { data: upserted, error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'slug' })
      .select('id, slug');

    if (error) throw new Error(`Products upsert failed: ${error.message}`);
    for (const row of upserted ?? []) {
      productIdBySlug.set(row.slug, row.id);
    }
    summary.products.upserted += upserted?.length ?? 0;
  }

  console.log('Seeding product images & tags...');
  for (const product of data.products) {
    const productId = productIdBySlug.get(product.slug);
    if (!productId) continue;

    await supabase.from('product_images').delete().eq('product_id', productId);
    await supabase.from('product_tags').delete().eq('product_id', productId);

    const imageUrls = [
      product.imageUrl,
      ...(product.gallery ?? []).filter((url) => url && url !== product.imageUrl),
    ];

    if (imageUrls.length > 0) {
      const { error: imageError } = await supabase.from('product_images').insert(
        imageUrls.map((url, index) => ({
          product_id: productId,
          url,
          sort_order: index,
          is_primary: index === 0,
          alt_text: product.title,
        }))
      );
      if (imageError) throw new Error(`Product images failed for ${product.slug}: ${imageError.message}`);
      summary.productImages.inserted += imageUrls.length;
    }

    const uniqueTags = [...new Set(product.tags.map((t) => t.trim()).filter(Boolean))];
    if (uniqueTags.length > 0) {
      const { error: tagError } = await supabase.from('product_tags').insert(
        uniqueTags.map((tag) => ({ product_id: productId, tag }))
      );
      if (tagError) throw new Error(`Product tags failed for ${product.slug}: ${tagError.message}`);
      summary.productTags.inserted += uniqueTags.length;
    }
  }

  console.log('Seeding reviews...');
  const reviewRows = data.reviews
    .map((review) => {
      const productId = productIdBySlug.get(review.productSlug);
      if (!productId) return null;
      return {
        id: deterministicUuid(review.legacyId),
        product_id: productId,
        reviewer_name: review.reviewerName,
        reviewer_avatar: review.reviewerAvatar ?? null,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        verified: review.verified,
        helpful_count: review.helpfulCount,
        created_at: review.createdAt ? new Date(review.createdAt).toISOString() : undefined,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  for (const batch of chunk(reviewRows, 100)) {
    const { error } = await supabase.from('reviews').upsert(batch, { onConflict: 'id' });
    if (error) throw new Error(`Reviews upsert failed: ${error.message}`);
    summary.reviews.upserted += batch.length;
  }

  console.log('\nSeed complete');
  console.log('================');
  console.log(`Categories upserted: ${summary.categories.upserted}`);
  console.log(`Sellers upserted:    ${summary.sellers.upserted}`);
  console.log(`Products upserted:   ${summary.products.upserted}`);
  console.log(`Product images:      ${summary.productImages.inserted}`);
  console.log(`Product tags:      ${summary.productTags.inserted}`);
  console.log(`Reviews upserted:    ${summary.reviews.upserted}`);

  if (summary.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of summary.warnings) console.log(`- ${warning}`);
  }

  console.log('\nNext: run supabase/migrations/20250523120000_add_product_type_metadata.sql if product_type column is missing.');
}

main().catch((error) => {
  console.error('\nSeed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
