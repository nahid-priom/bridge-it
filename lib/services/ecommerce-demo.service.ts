import type {
  DemoFeatureFlags,
  DemoOrder,
  DemoStoreCategory,
  DemoStoreProduct,
  EcommerceDemoConfig,
} from '@/types/bitp';
import { getServerClient } from '@/lib/services/client';

export async function getDemoConfigBySlug(demoSlug: string): Promise<EcommerceDemoConfig | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const { data: product } = await supabase
    .from('products')
    .select('id, name, slug, starting_price, currency, demo_url, internal_demo_slug, target_customer')
    .eq('internal_demo_slug', demoSlug)
    .eq('status', 'published')
    .maybeSingle();

  if (!product) return null;

  const { data: config, error } = await supabase
    .from('ecommerce_demo_configs')
    .select('*')
    .eq('product_id', product.id)
    .eq('active', true)
    .maybeSingle();

  if (error || !config) return null;

  const [categoriesRes, productsRes] = await Promise.all([
    supabase
      .from('demo_store_categories')
      .select('*')
      .eq('demo_config_id', config.id)
      .order('sort_order'),
    supabase
      .from('demo_store_products')
      .select('*')
      .eq('demo_config_id', config.id)
      .eq('active', true)
      .order('sort_order'),
  ]);

  return {
    ...(config as EcommerceDemoConfig),
    feature_flags: (config.feature_flags ?? {}) as DemoFeatureFlags,
    admin_modules: (config.admin_modules ?? []) as string[],
    product: product as EcommerceDemoConfig['product'],
    categories: (categoriesRes.data ?? []) as DemoStoreCategory[],
    products: (productsRes.data ?? []).map((p) => ({
      ...p,
      variants: (p.variants ?? []) as DemoStoreProduct['variants'],
    })) as DemoStoreProduct[],
  };
}

export async function getAllDemoSlugs(): Promise<string[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('products')
    .select('internal_demo_slug')
    .eq('status', 'published')
    .not('internal_demo_slug', 'is', null);

  return (data ?? []).map((r) => r.internal_demo_slug as string).filter(Boolean);
}

export async function createDemoOrder(input: {
  demo_config_id: string;
  session_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  customer_email?: string;
  items: { product_name: string; product_slug?: string; quantity: number; unit_price: number; variant_label?: string }[];
  payment_method?: string;
}): Promise<DemoOrder | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const subtotal = input.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  const { data: order, error } = await supabase
    .from('demo_orders')
    .insert({
      demo_config_id: input.demo_config_id,
      session_id: input.session_id,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_address: input.customer_address ?? null,
      customer_email: input.customer_email ?? null,
      subtotal,
      total: subtotal,
      payment_method: input.payment_method ?? 'cod',
      status: 'placed',
      is_demo: true,
    })
    .select()
    .single();

  if (error || !order) return null;

  const itemRows = input.items.map((i) => ({
    demo_order_id: order.id,
    product_name: i.product_name,
    product_slug: i.product_slug ?? null,
    quantity: i.quantity,
    unit_price: i.unit_price,
    total: i.unit_price * i.quantity,
    variant_label: i.variant_label ?? null,
  }));

  await supabase.from('demo_order_items').insert(itemRows);

  return order as DemoOrder;
}

export async function getDemoOrdersBySession(
  demoConfigId: string,
  sessionId: string
): Promise<DemoOrder[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('demo_orders')
    .select('*, items:demo_order_items(*)')
    .eq('demo_config_id', demoConfigId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  return (data ?? []) as DemoOrder[];
}

export async function updateDemoOrderStatus(
  orderId: string,
  status: string,
  courierStatus?: string
): Promise<boolean> {
  const supabase = await getServerClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('demo_orders')
    .update({
      status,
      ...(courierStatus ? { courier_status: courierStatus } : {}),
    })
    .eq('id', orderId);

  return !error;
}
