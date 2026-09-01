import type {
  BitpProduct,
  BitpProductDetail,
  BitpProductFaq,
  BitpProductPackage,
  DemoFeatureFlags,
  EcommerceDemoConfig,
} from '@/types/bitp';
import { getServerClient } from '@/lib/services/client';

const PRODUCT_SELECT = `
  *,
  category:categories(id, name, slug, icon, description)
`;

export async function getEcommerceFlagships(): Promise<BitpProduct[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'ecommerce-solutions')
    .maybeSingle();

  if (!cat) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category_id', cat.id)
    .eq('status', 'published')
    .order('sort_order');

  if (error) return [];
  return (data ?? []) as BitpProduct[];
}

export type FlagshipWithFeatures = BitpProduct & {
  topFeatures: string[];
  primaryPackage?: BitpProductPackage;
};

export async function getEcommerceFlagshipsWithFeatures(): Promise<FlagshipWithFeatures[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'ecommerce-solutions')
    .maybeSingle();

  if (!cat) return [];

  const { data: products, error } = await supabase
    .from('products')
    .select(
      `*, category:categories(id, name, slug, icon, description),
       packages:product_packages(id, name, price, delivery_days, sort_order, active, features:package_features(feature_text, included, sort_order))`
    )
    .eq('category_id', cat.id)
    .eq('status', 'published')
    .order('sort_order');

  if (error || !products?.length) return [];

  return (products as (BitpProduct & { packages?: BitpProductPackage[] })[]).map((p) => {
    const pkg = (p.packages ?? [])
      .filter((pk) => pk.active !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
    const features = (pkg?.features ?? [])
      .filter((f) => f.included)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((f) => f.feature_text)
      .slice(0, 5);

    const { packages: _packages, ...product } = p;
    return {
      ...product,
      topFeatures: features,
      primaryPackage: pkg,
    };
  });
}

export async function getEcommerceProductBySlug(slug: string): Promise<BitpProductDetail | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: product, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !product) return null;

  const cat = product as BitpProduct;
  const { data: category } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', cat.category_id)
    .maybeSingle();

  if (category?.slug !== 'ecommerce-solutions') return null;

  const [packagesRes, fieldsRes, faqsRes, demoRes] = await Promise.all([
    supabase
      .from('product_packages')
      .select('*, features:package_features(*)')
      .eq('product_id', product.id)
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('product_requirement_fields')
      .select('*')
      .eq('product_id', product.id)
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('product_faqs')
      .select('*')
      .eq('product_id', product.id)
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('ecommerce_demo_configs')
      .select('*')
      .eq('product_id', product.id)
      .maybeSingle(),
  ]);

  return {
    ...(product as BitpProductDetail),
    packages: (packagesRes.data ?? []).map((pkg) => ({
      ...pkg,
      features: pkg.features ?? [],
    })),
    requirement_fields: (fieldsRes.data ?? []).map((f) => ({
      ...f,
      options: Array.isArray(f.options) ? f.options : [],
    })),
    faqs: (faqsRes.data ?? []) as BitpProductFaq[],
    demo_config: demoRes.data
      ? ({
          ...(demoRes.data as EcommerceDemoConfig),
          feature_flags: (demoRes.data.feature_flags ?? {}) as DemoFeatureFlags,
          admin_modules: (demoRes.data.admin_modules ?? []) as string[],
        } as EcommerceDemoConfig)
      : undefined,
  };
}

export type ComparisonRow = {
  key: string;
  label: string;
  values: Record<string, boolean | string>;
};

const COMPARISON_ROWS: { key: string; label: string; flag: keyof DemoFeatureFlags }[] = [
  { key: 'landing', label: 'Landing Page', flag: 'landingOnly' },
  { key: 'catalog', label: 'Product Catalog', flag: 'catalog' },
  { key: 'cart', label: 'Cart', flag: 'cart' },
  { key: 'checkout', label: 'Checkout', flag: 'checkout' },
  { key: 'customer', label: 'Customer Account', flag: 'customerAccount' },
  { key: 'wishlist', label: 'Wishlist', flag: 'wishlist' },
  { key: 'coupon', label: 'Coupon', flag: 'coupon' },
  { key: 'variants', label: 'Variants', flag: 'variants' },
  { key: 'stock', label: 'Stock Management', flag: 'stock' },
  { key: 'admin', label: 'Admin Dashboard', flag: 'adminPreview' },
  { key: 'courier', label: 'Courier Automation', flag: 'courierFlow' },
  { key: 'fraud', label: 'Fraud Checker', flag: 'fraudCheckerUi' },
  { key: 'payment', label: 'Payment Gateway', flag: 'paymentGatewayUi' },
  { key: 'analytics', label: 'Analytics', flag: 'analytics' },
  { key: 'seo', label: 'SEO', flag: 'seo' },
  { key: 'pixel', label: 'Pixel / CAPI', flag: 'pixelTracking' },
  { key: 'reports', label: 'Advanced Reports', flag: 'advancedReports' },
  { key: 'returns', label: 'Returns', flag: 'returns' },
  { key: 'erp', label: 'Business Management', flag: 'roleAdmin' },
];

export async function getEcommerceComparisonMatrix(): Promise<{
  products: BitpProduct[];
  rows: ComparisonRow[];
}> {
  const products = await getEcommerceFlagships();
  const supabase = await getServerClient();
  if (!supabase) return { products, rows: [] };

  const { data: configsData } = await supabase
    .from('ecommerce_demo_configs')
    .select('product_id, feature_flags')
    .in(
      'product_id',
      products.map((p) => p.id)
    );

  const flagMap: Record<string, DemoFeatureFlags> = {};
  for (const p of products) {
    const cfg = configsData?.find((c) => c.product_id === p.id);
    flagMap[p.slug] = (cfg?.feature_flags ?? {}) as DemoFeatureFlags;
  }

  const rows: ComparisonRow[] = COMPARISON_ROWS.map((row) => ({
    key: row.key,
    label: row.label,
    values: Object.fromEntries(
      products.map((p) => {
        const flags = flagMap[p.slug] ?? {};
        let value = Boolean(flags[row.flag]);
        if (!value && row.flag === 'seo') {
          value = Boolean(flags.analytics) || ['standard-ecommerce', 'automated-ecommerce', 'premium-ecommerce'].includes(p.slug);
        }
        if (!value && row.flag === 'pixelTracking') {
          value = Boolean(flags.paymentGatewayUi || flags.fraudCheckerUi);
        }
        if (!value && row.flag === 'advancedReports') {
          value = Boolean(flags.analytics && flags.adminPreview);
        }
        return [p.slug, value];
      })
    ),
  }));

  return { products, rows };
}

export async function getStageTemplateForEcommerceProduct(productId: string) {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: link } = await supabase
    .from('product_stage_templates')
    .select('template_id')
    .eq('product_id', productId)
    .maybeSingle();

  if (!link) return null;

  const [{ data: template }, { data: steps }] = await Promise.all([
    supabase
      .from('project_stage_templates')
      .select('id, name, description')
      .eq('id', link.template_id)
      .maybeSingle(),
    supabase
      .from('project_stage_template_steps')
      .select('id, title, description, sort_order')
      .eq('template_id', link.template_id)
      .order('sort_order'),
  ]);

  if (!template) return null;

  return {
    ...template,
    steps: (steps ?? []).map((s) => ({ ...s, duration_days: null })),
  };
}
