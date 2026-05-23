'use server';

import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { insertAdminAuditLog } from '@/lib/db/admin';
import { upsertProductAction, deleteProductAction } from '@/app/actions/products';
import { upsertCategoryAction, deleteCategoryAction } from '@/app/actions/categories';
import { upsertReviewAction, deleteReviewAction } from '@/app/actions/reviews';

export { upsertProductAction, deleteProductAction };
export { upsertCategoryAction, deleteCategoryAction };
export { upsertReviewAction, deleteReviewAction };

export async function upsertSellerAction(input: Record<string, unknown>) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('sellers')
    .upsert(input as never, { onConflict: 'slug' })
    .select('id, slug')
    .single();

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'upsert',
    tableName: 'sellers',
    recordId: data?.id,
    payload: input,
    adminId: admin.userId,
  });

  revalidatePath('/sellers');
  revalidatePath('/admin');
  return { data };
}

export async function deleteSellerAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('sellers').delete().eq('id', id);
  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'delete',
    tableName: 'sellers',
    recordId: id,
    adminId: admin.userId,
  });
  revalidatePath('/admin');
  return { success: true };
}

export async function upsertOrderAction(input: Record<string, unknown>) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('orders')
    .upsert(input as never, { onConflict: 'id' })
    .select('id')
    .single();

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'upsert',
    tableName: 'orders',
    recordId: data?.id,
    payload: input,
    adminId: admin.userId,
  });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { data };
}
