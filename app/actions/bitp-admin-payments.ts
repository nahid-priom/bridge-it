'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { verifyPaymentAdmin } from '@/lib/services/payments.service';

export async function verifyPaymentAdminAction(paymentId: string, status: 'verified' | 'rejected') {
  await assertAdminAction();
  const user = await getCurrentUser();
  const result = await verifyPaymentAdmin(paymentId, user?.id ?? 'admin', status);
  revalidatePath('/admin');
  return result;
}
