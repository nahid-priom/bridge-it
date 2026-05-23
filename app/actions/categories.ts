'use server';

import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { insertAdminAuditLog } from '@/lib/db/admin';

export async function upsertCategoryAction(input: Record<string, unknown>) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('categories')
    .upsert(input as never, { onConflict: 'key' })
    .select('id, key')
    .single();

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'upsert',
    tableName: 'categories',
    recordId: data?.id,
    payload: input,
    adminId: admin.userId,
  });

  revalidatePath('/categories');
  revalidatePath('/admin');
  return { data };
}

export async function deleteCategoryAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'delete',
    tableName: 'categories',
    recordId: id,
    adminId: admin.userId,
  });
  revalidatePath('/categories');
  revalidatePath('/admin');
  return { success: true };
}
