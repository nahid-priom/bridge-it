'use server';

import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { insertAdminAuditLog } from '@/lib/db/admin';

export async function upsertProductAction(input: Record<string, unknown>) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('products')
    .upsert(input as never, { onConflict: 'slug' })
    .select('id, slug')
    .single();

  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'upsert',
    tableName: 'products',
    recordId: data?.id,
    payload: input,
    adminId: admin.userId,
  });

  revalidatePath('/products');
  revalidatePath('/admin');
  return { data };
}

export async function deleteProductAction(id: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { error: error.message };

  await insertAdminAuditLog({
    action: 'delete',
    tableName: 'products',
    recordId: id,
    adminId: admin.userId,
  });
  revalidatePath('/products');
  revalidatePath('/admin');
  return { success: true };
}
