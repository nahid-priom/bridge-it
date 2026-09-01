import type {
  BitpProduct,
  BitpProductDetail,
  BitpProductFaq,
  BitpProductPackage,
  SoftwareDemoConfig,
  SoftwareFeatureFlags,
} from '@/types/bitp';
import { getServerClient } from '@/lib/services/client';

const PRODUCT_SELECT = `
  *,
  category:categories(id, name, slug, icon, description)
`;

export type SoftwareFlagshipWithFeatures = BitpProduct & {
  topFeatures: string[];
  primaryPackage?: BitpProductPackage;
};

export async function getSoftwareFlagshipsWithFeatures(): Promise<SoftwareFlagshipWithFeatures[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'software-solutions')
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
    .eq('showroom_featured', true)
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
    return { ...product, topFeatures: features, primaryPackage: pkg };
  });
}

export async function getSoftwareProductBySlug(slug: string): Promise<BitpProductDetail | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: product, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !product) return null;

  const { data: category } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', (product as BitpProduct).category_id)
    .maybeSingle();

  if (category?.slug !== 'software-solutions') return null;

  const [packagesRes, fieldsRes, faqsRes, demoRes] = await Promise.all([
    supabase.from('product_packages').select('*, features:package_features(*)').eq('product_id', product.id).eq('active', true).order('sort_order'),
    supabase.from('product_requirement_fields').select('*').eq('product_id', product.id).eq('active', true).order('sort_order'),
    supabase.from('product_faqs').select('*').eq('product_id', product.id).eq('active', true).order('sort_order'),
    supabase.from('software_demo_configs').select('*').eq('product_id', product.id).maybeSingle(),
  ]);

  return {
    ...(product as BitpProductDetail),
    packages: (packagesRes.data ?? []).map((pkg) => ({ ...pkg, features: pkg.features ?? [] })),
    requirement_fields: (fieldsRes.data ?? []).map((f) => ({ ...f, options: Array.isArray(f.options) ? f.options : [] })),
    faqs: (faqsRes.data ?? []) as BitpProductFaq[],
    software_demo_config: demoRes.data
      ? ({
          ...(demoRes.data as SoftwareDemoConfig),
          feature_flags: (demoRes.data.feature_flags ?? {}) as SoftwareFeatureFlags,
          workflow_config: Array.isArray(demoRes.data.workflow_config) ? demoRes.data.workflow_config : [],
        } as SoftwareDemoConfig)
      : undefined,
  };
}

export type SoftwareComparisonRow = {
  key: string;
  label: string;
  values: Record<string, boolean | string>;
};

const COMPARISON_ROWS: { key: string; label: string; flag: keyof SoftwareFeatureFlags }[] = [
  { key: 'stock', label: 'Stock Management', flag: 'stock' },
  { key: 'purchase', label: 'Purchase', flag: 'purchase' },
  { key: 'sales', label: 'Sales', flag: 'sales' },
  { key: 'parties', label: 'Customer / Supplier', flag: 'parties' },
  { key: 'due', label: 'Due & Collection', flag: 'payments' },
  { key: 'ledger', label: 'Ledger', flag: 'ledger' },
  { key: 'accounts', label: 'Cash / Bank / Accounts', flag: 'accounts' },
  { key: 'transfer', label: 'Multi Warehouse / Transfer', flag: 'transfer' },
  { key: 'bom', label: 'BOM / Recipe', flag: 'bom' },
  { key: 'production', label: 'Production', flag: 'production' },
  { key: 'costing', label: 'Production Costing', flag: 'costing' },
  { key: 'approval', label: 'Approval Workflow', flag: 'approval' },
  { key: 'audit', label: 'Audit Trail', flag: 'audit' },
];

export async function getSoftwareComparisonMatrix(): Promise<{
  products: BitpProduct[];
  rows: SoftwareComparisonRow[];
}> {
  const products = await getSoftwareFlagshipsWithFeatures();
  const supabase = await getServerClient();
  if (!supabase) return { products, rows: [] };

  const { data: configsData } = await supabase
    .from('software_demo_configs')
    .select('product_id, feature_flags')
    .in('product_id', products.map((p) => p.id));

  const flagMap: Record<string, SoftwareFeatureFlags> = {};
  for (const p of products) {
    const cfg = configsData?.find((c) => c.product_id === p.id);
    flagMap[p.slug] = (cfg?.feature_flags ?? {}) as SoftwareFeatureFlags;
  }

  const rows = COMPARISON_ROWS.map((row) => ({
    key: row.key,
    label: row.label,
    values: Object.fromEntries(products.map((p) => [p.slug, Boolean(flagMap[p.slug]?.[row.flag])])),
  }));

  return { products, rows };
}

export async function getStageTemplateForSoftwareProduct(productId: string) {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: link } = await supabase
    .from('product_stage_templates')
    .select('template_id')
    .eq('product_id', productId)
    .maybeSingle();

  if (!link) return null;

  const [{ data: template }, { data: steps }] = await Promise.all([
    supabase.from('project_stage_templates').select('id, name, description').eq('id', link.template_id).maybeSingle(),
    supabase.from('project_stage_template_steps').select('id, title, description, sort_order').eq('template_id', link.template_id).order('sort_order'),
  ]);

  if (!template) return null;
  return { ...template, steps: (steps ?? []).map((s) => ({ ...s, duration_days: null })) };
}
