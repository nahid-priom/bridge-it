'use server';

import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { insertAdminAuditLog } from '@/lib/db/admin';

export async function upsertReviewAction(input: Record<string, unknown>) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('reviews')
    .upsert(input as never, { onConflict: 'id' })
    .select('id')
    .single();

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'upsert',
    tableName: 'reviews',
    recordId: data?.id,
    payload: input,
    adminId: admin.userId,
  });

  revalidatePath('/products');
  revalidatePath('/admin');
  return { data };
}

export async function deleteReviewAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'delete',
    tableName: 'reviews',
    recordId: id,
    adminId: admin.userId,
  });
  revalidatePath('/products');
  revalidatePath('/admin');
  return { success: true };
}
