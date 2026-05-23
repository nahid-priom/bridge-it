'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { insertAdminAuditLog } from '@/lib/db/admin';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function updateMarketplaceSellerStatusAction(input: {
  sellerId: string;
  status: 'active' | 'suspended';
  featured?: boolean;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured.' };

  const { error } = await supabase
    .from('marketplace_sellers')
    .update({
      status: input.status,
      ...(input.featured !== undefined ? { is_featured: input.featured } : {}),
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', input.sellerId);

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: `seller_${input.status}`,
    tableName: 'marketplace_sellers',
    recordId: input.sellerId,
    payload: input,
    adminId: admin.userId,
  });

  revalidatePath('/admin');
  return { success: true as const };
}

export async function verifyMarketplaceSellerAction(input: {
  sellerId: string;
  verified: boolean;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured.' };

  const { error } = await supabase
    .from('marketplace_sellers')
    .update({ is_verified: input.verified, updated_at: new Date().toISOString() } as never)
    .eq('id', input.sellerId);

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: input.verified ? 'seller_verified' : 'seller_unverified',
    tableName: 'marketplace_sellers',
    recordId: input.sellerId,
    adminId: admin.userId,
  });

  revalidatePath('/admin');
  return { success: true as const };
}

export async function updateMarketplaceOrderStatusAction(input: {
  orderId: string;
  status: string;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured.' };

  const { error } = await supabase
    .from('marketplace_orders')
    .update({ status: input.status, updated_at: new Date().toISOString() } as never)
    .eq('id', input.orderId);

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'order_status_update',
    tableName: 'marketplace_orders',
    recordId: input.orderId,
    payload: { status: input.status },
    adminId: admin.userId,
  });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  revalidatePath('/seller-dashboard');
  return { success: true as const };
}
