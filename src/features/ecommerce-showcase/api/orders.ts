import 'server-only';

import { getAdminClient, getServerClient } from '@/lib/services/client';
import type { WebsiteOrder } from '../types';

function mapOrder(row: Record<string, unknown>): WebsiteOrder {
  const project = row.ecommerce_projects as Record<string, unknown> | null;
  return {
    id: String(row.id),
    order_number: String(row.order_number),
    user_id: String(row.user_id),
    project_id: String(row.project_id),
    package_id: (row.package_id as string | null) ?? null,
    project_title: String(row.project_title ?? ''),
    package_name: String(row.package_name ?? ''),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? 'BDT'),
    customer_name: String(row.customer_name ?? ''),
    phone: String(row.phone ?? ''),
    business_name: (row.business_name as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    status: (row.status as WebsiteOrder['status']) ?? 'pending',
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    project_slug: project ? String(project.slug ?? '') : null,
  };
}

export async function listWebsiteOrdersForUser(userId: string): Promise<WebsiteOrder[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ecommerce_website_orders')
    .select('*, ecommerce_projects ( slug )')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => mapOrder(row as Record<string, unknown>));
}

export async function getWebsiteOrderForUser(orderId: string, userId: string): Promise<WebsiteOrder | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('ecommerce_website_orders')
    .select('*, ecommerce_projects ( slug )')
    .eq('id', orderId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapOrder(data as Record<string, unknown>);
}

export async function adminListWebsiteOrders(): Promise<WebsiteOrder[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ecommerce_website_orders')
    .select('*, ecommerce_projects ( slug )')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return [];
  return (data ?? []).map((row) => mapOrder(row as Record<string, unknown>));
}

export const WEBSITE_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const;
