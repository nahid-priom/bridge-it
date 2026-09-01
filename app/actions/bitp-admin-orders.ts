'use server';

import { revalidatePath } from 'next/cache';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { updateOrderStatusAdmin } from '@/lib/services/orders.service';
import { createProjectFromOrderWithTemplate } from '@/lib/services/projects.service';
import { updateProjectStageAdmin } from '@/lib/services/projects.service';
import { ROUTES } from '@/lib/routes';

export async function adminConfirmOrderAction(orderId: string) {
  await assertAdminAction();
  const result = await updateOrderStatusAdmin(orderId, 'confirmed', 'Order confirmed by admin');
  revalidatePath('/admin');
  return result;
}

export async function adminCreateProjectFromOrderAction(input: {
  orderId: string;
  clientId: string;
  productId: string;
  title: string;
}) {
  await assertAdminAction();
  const { project, error } = await createProjectFromOrderWithTemplate(
    input.orderId,
    input.clientId,
    input.productId,
    input.title
  );
  if (!error) {
    await updateOrderStatusAdmin(input.orderId, 'in_progress', 'Project created');
  }
  revalidatePath('/admin');
  revalidatePath(ROUTES.clientProjects);
  return { project, error };
}

export async function adminUpdateOrderStatusAction(orderId: string, status: string, notes?: string) {
  await assertAdminAction();
  const result = await updateOrderStatusAdmin(orderId, status, notes);
  revalidatePath('/admin');
  return result;
}

export async function adminUpdateProjectStageAction(stageId: string, status: 'pending' | 'in_progress' | 'completed' | 'skipped') {
  await assertAdminAction();
  const result = await updateProjectStageAdmin(stageId, status);
  revalidatePath('/admin');
  revalidatePath(ROUTES.clientProjects);
  return result;
}
