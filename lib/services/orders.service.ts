import type { BitpOrder, BitpOrderRequirement, CreateOrderInput } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

const ORDER_SELECT = `
  *,
  product:products(id, name, slug, thumbnail, starting_price, currency),
  package:product_packages(id, name, price, currency, delivery_days),
  client:profiles(id, full_name, email, phone),
  requirements:order_requirements(id, field_key, label, value)
`;

export async function getClientOrders(clientId: string): Promise<BitpOrder[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[orders.service] getClientOrders', error.message);
    return [];
  }
  return (data ?? []) as BitpOrder[];
}

export async function getOrderById(orderId: string, clientId?: string): Promise<BitpOrder | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  let query = supabase.from('orders').select(ORDER_SELECT).eq('id', orderId);
  if (clientId) query = query.eq('client_id', clientId);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as BitpOrder;
}

export async function getOrderRequirements(orderId: string): Promise<BitpOrderRequirement[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('order_requirements')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at');

  if (error) return [];
  return (data ?? []) as BitpOrderRequirement[];
}

import type { OrderStatusHistoryRow } from '@/types/bitp';

export async function getOrderStatusHistory(orderId: string): Promise<OrderStatusHistoryRow[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return (data ?? []) as OrderStatusHistoryRow[];
}

export async function createOrder(
  clientId: string,
  input: CreateOrderInput
): Promise<{ order: BitpOrder | null; error: string | null }> {
  const supabase = await getServerClient();
  if (!supabase) return { order: null, error: 'Database not configured' };

  const { data: product } = await supabase
    .from('products')
    .select('id, name, starting_price, currency, pricing_type')
    .eq('id', input.product_id)
    .eq('status', 'published')
    .maybeSingle();

  if (!product) return { order: null, error: 'Product not found' };

  let subtotal = Number(product.starting_price);
  let packageName = product.name;

  if (input.package_id) {
    const { data: pkg } = await supabase
      .from('product_packages')
      .select('*')
      .eq('id', input.package_id)
      .eq('product_id', input.product_id)
      .eq('active', true)
      .maybeSingle();

    if (!pkg) return { order: null, error: 'Package not found' };
    subtotal = Number(pkg.price);
    packageName = pkg.name;
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      client_id: clientId,
      product_id: input.product_id,
      package_id: input.package_id ?? null,
      subtotal,
      total: subtotal,
      currency: product.currency ?? 'BDT',
      order_status: 'requirements_submitted',
      payment_status: 'pending',
      notes: input.notes ?? null,
      source: 'website',
    })
    .select(ORDER_SELECT)
    .single();

  if (orderError || !order) {
    return { order: null, error: orderError?.message ?? 'Failed to create order' };
  }

  await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: input.product_id,
    package_id: input.package_id ?? null,
    title: packageName,
    quantity: 1,
    unit_price: subtotal,
    total: subtotal,
  });

  if (input.requirements.length > 0) {
    await supabase.from('order_requirements').insert(
      input.requirements.map((r) => ({
        order_id: order.id,
        field_id: r.field_id ?? null,
        field_key: r.field_key,
        label: r.label,
        value: r.value,
      }))
    );
  }

  await supabase.from('order_status_history').insert({
    order_id: order.id,
    status: 'requirements_submitted',
    notes: 'Order placed with requirements',
    changed_by: clientId,
  });

  return { order: order as BitpOrder, error: null };
}

export async function getAllOrdersAdmin(): Promise<BitpOrder[]> {
  const admin = await getAdminClient();
  const supabase = admin ?? (await getServerClient());
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpOrder[];
}

export async function updateOrderStatusAdmin(
  orderId: string,
  status: string,
  notes?: string,
  changedBy?: string
) {
  const admin = await getAdminClient();
  if (!admin) return { error: 'Admin client not configured' };

  const { error } = await admin.from('orders').update({ order_status: status }).eq('id', orderId);
  if (error) return { error: error.message };

  await admin.from('order_status_history').insert({
    order_id: orderId,
    status,
    notes: notes ?? null,
    changed_by: changedBy ?? null,
  });

  return { error: null };
}
