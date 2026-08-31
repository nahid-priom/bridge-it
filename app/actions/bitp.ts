'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { createOrder } from '@/lib/services/orders.service';
import { createConsultationRequest } from '@/lib/services/consultation.service';
import { createNotification } from '@/lib/services/messages.service';
import { ROUTES } from '@/lib/routes';
import type { CreateConsultationInput } from '@/types/bitp';

export async function submitOrderAction(input: {
  product_id: string;
  package_id?: string | null;
  requirements: { field_key: string; label: string; value: string; field_id?: string }[];
  notes?: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${ROUTES.login}?next=${ROUTES.dashboard}`);
  }

  const { order, error } = await createOrder(user.id, {
    product_id: input.product_id,
    package_id: input.package_id,
    requirements: input.requirements,
    notes: input.notes,
  });

  if (error || !order) {
    return { error: error ?? 'Failed to create order' };
  }

  await createNotification({
    user_id: user.id,
    title: 'Order Confirmed',
    message: `Your order ${order.order_number} has been received.`,
    type: 'order_created',
    reference_type: 'order',
    reference_id: order.id,
  });

  revalidatePath(ROUTES.clientOrders);
  redirect(ROUTES.clientOrder(order.id));
}

export async function submitConsultationAction(input: CreateConsultationInput) {
  const { error } = await createConsultationRequest(input);
  if (error) return { error };
  return { success: true };
}

export async function acceptQuotationAction(quotationId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const { acceptQuotation } = await import('@/lib/services/quotations.service');
  const result = await acceptQuotation(user.id, quotationId);
  if (result.error) return { error: result.error };

  revalidatePath(ROUTES.clientQuotations);
  return { success: true };
}

export async function submitPaymentProofAction(input: {
  order_id?: string;
  amount: number;
  payment_method: string;
  transaction_reference?: string;
  notes?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const { submitPaymentProof } = await import('@/lib/services/payments.service');
  const { payment, error } = await submitPaymentProof({
    client_id: user.id,
    order_id: input.order_id,
    amount: input.amount,
    payment_method: input.payment_method,
    transaction_reference: input.transaction_reference,
    notes: input.notes,
  });

  if (error) return { error };
  revalidatePath(ROUTES.clientPayments);
  return { payment };
}
