import type {
  BitpProduct,
  BitpProductDetail,
  BitpProductPackage,
  BitpPackageFeature,
  BitpRequirementField,
  ProductSearchFilters,
} from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

const PRODUCT_SELECT = `
  *,
  category:categories(id, name, slug, icon, description)
`;

export async function getPublishedProducts(filters: ProductSearchFilters = {}): Promise<BitpProduct[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published');

  if (filters.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category)
      .maybeSingle();
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (filters.featured) query = query.eq('featured', true);
  if (filters.popular) query = query.eq('popular', true);
  if (filters.pricing_type) query = query.eq('pricing_type', filters.pricing_type);

  if (filters.q?.trim()) {
    const q = filters.q.trim();
    query = query.or(
      `name.ilike.%${q}%,short_description.ilike.%${q}%,full_description.ilike.%${q}%`
    );
  }

  switch (filters.sort) {
    case 'price_asc':
      query = query.order('starting_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('starting_price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('sort_order', { ascending: true }).order('popular', { ascending: false });
  }

  if (filters.limit) query = query.limit(filters.limit);
  if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) {
    console.error('[products.service] getPublishedProducts', error.message);
    return [];
  }
  return (data ?? []) as BitpProduct[];
}

export type ProductSitemapEntry = {
  slug: string;
  updated_at: string;
};

export async function getPublishedProductSitemapEntries(): Promise<ProductSitemapEntry[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[products.service] getPublishedProductSitemapEntries', error.message);
    return [];
  }

  return (data ?? []) as ProductSitemapEntry[];
}

export async function getProductBySlug(slug: string): Promise<BitpProductDetail | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: product, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !product) return null;

  const [packagesRes, fieldsRes] = await Promise.all([
    supabase
      .from('product_packages')
      .select('*')
      .eq('product_id', product.id)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_requirement_fields')
      .select('*')
      .eq('product_id', product.id)
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ]);

  const packages = (packagesRes.data ?? []) as BitpProductPackage[];

  if (packages.length > 0) {
    const packageIds = packages.map((p) => p.id);
    const { data: features } = await supabase
      .from('package_features')
      .select('*')
      .in('package_id', packageIds)
      .order('sort_order', { ascending: true });

    const featuresByPackage = new Map<string, typeof features>();
    for (const f of features ?? []) {
      const list = featuresByPackage.get(f.package_id) ?? [];
      list.push(f);
      featuresByPackage.set(f.package_id, list);
    }
    for (const pkg of packages) {
      pkg.features = featuresByPackage.get(pkg.id) ?? [];
    }
  }

  const requirement_fields = ((fieldsRes.data ?? []) as BitpRequirementField[]).map((f) => ({
    ...f,
    options: Array.isArray(f.options) ? f.options : [],
  }));

  return {
    ...(product as BitpProduct),
    packages,
    requirement_fields,
  };
}

export async function getRelatedProducts(product: BitpProduct, limit = 4): Promise<BitpProduct[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(limit);

  if (error) return [];
  return (data ?? []) as BitpProduct[];
}

export async function getPopularProducts(limit = 8): Promise<BitpProduct[]> {
  return getPublishedProducts({ popular: true, limit, sort: 'popular' });
}

export async function getFeaturedProducts(limit = 8): Promise<BitpProduct[]> {
  return getPublishedProducts({ featured: true, limit });
}

export async function searchProducts(q: string, limit = 12): Promise<BitpProduct[]> {
  return getPublishedProducts({ q, limit });
}

export async function getAllProductsAdmin(): Promise<BitpProduct[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data ?? []) as BitpProduct[];
}

export async function getPackagesByProductId(productId: string): Promise<BitpProductPackage[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];

  const { data: packages, error } = await supabase
    .from('product_packages')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error || !packages?.length) return [];

  const packageIds = packages.map((p) => p.id);
  const { data: features } = await supabase
    .from('package_features')
    .select('*')
    .in('package_id', packageIds)
    .order('sort_order', { ascending: true });

  const featuresByPackage = new Map<string, BitpPackageFeature[]>();
  for (const f of features ?? []) {
    const list = featuresByPackage.get(f.package_id) ?? [];
    list.push(f as BitpPackageFeature);
    featuresByPackage.set(f.package_id, list);
  }

  return packages.map((pkg) => ({
    ...(pkg as BitpProductPackage),
    features: featuresByPackage.get(pkg.id) ?? [],
  }));
}

export async function getProductByIdAdmin(id: string): Promise<BitpProductDetail | null> {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: product, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !product) return null;

  const [packages, fieldsRes] = await Promise.all([
    getPackagesByProductId(id),
    supabase.from('product_requirement_fields').select('*').eq('product_id', id).order('sort_order'),
  ]);

  return {
    ...(product as BitpProduct),
    packages,
    requirement_fields: (fieldsRes.data ?? []) as BitpRequirementField[],
  };
}

function nullIfEmpty(value: string | null | undefined): string | null {
  if (value == null || value.trim() === '') return null;
  return value;
}

export async function upsertProductAdmin(
  input: Record<string, unknown>
): Promise<{ data: BitpProduct | null; error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const payload = {
    ...input,
    thumbnail: nullIfEmpty(input.thumbnail as string | undefined),
    cover_image: nullIfEmpty(input.cover_image as string | undefined),
    demo_url: nullIfEmpty(input.demo_url as string | undefined),
    preview_url: nullIfEmpty(input.preview_url as string | undefined),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('products')
    .upsert(payload, { onConflict: 'slug' })
    .select(PRODUCT_SELECT)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as BitpProduct, error: null };
}

export async function deleteProductAdmin(id: string): Promise<{ error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function upsertPackageAdmin(
  input: Record<string, unknown>
): Promise<{ data: BitpProductPackage | null; error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('product_packages')
    .upsert(payload, { onConflict: 'product_id,name' })
    .select('*')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as BitpProductPackage, error: null };
}

export async function deletePackageAdmin(id: string): Promise<{ error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('product_packages').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function upsertPackageFeatureAdmin(
  input: Record<string, unknown>
): Promise<{ data: BitpPackageFeature | null; error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('package_features')
    .upsert(input, { onConflict: 'package_id,sort_order' })
    .select('*')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as BitpPackageFeature, error: null };
}

export async function deletePackageFeatureAdmin(id: string): Promise<{ error: string | null }> {
  const supabase = await getAdminClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('package_features').delete().eq('id', id);
  return { error: error?.message ?? null };
}
