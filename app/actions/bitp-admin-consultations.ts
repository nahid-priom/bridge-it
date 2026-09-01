'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { updateConsultationStatusAdmin } from '@/lib/services/consultation.service';

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'] as const;

export async function updateConsultationStatusAction(id: string, status: string) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { error: 'Invalid status' };
  }

  const result = await updateConsultationStatusAdmin(id, status);
  if (result.error) return { error: result.error };

  revalidatePath('/admin');
  return { success: true as const };
}
