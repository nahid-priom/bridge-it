import type { BitpPayment } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

export async function getClientPayments(clientId: string): Promise<BitpPayment[]> {
  const supabase = await getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpPayment[];
}

export async function submitPaymentProof(input: {
  client_id: string;
  order_id?: string;
  project_id?: string;
  amount: number;
  payment_method: string;
  transaction_reference?: string;
  proof_url?: string;
  notes?: string;
}) {
  const supabase = await getServerClient();
  if (!supabase) return { payment: null, error: 'Database not configured' };

  const { data, error } = await supabase
    .from('payments')
    .insert({
      client_id: input.client_id,
      order_id: input.order_id ?? null,
      project_id: input.project_id ?? null,
      amount: input.amount,
      payment_method: input.payment_method,
      transaction_reference: input.transaction_reference ?? null,
      proof_url: input.proof_url ?? null,
      notes: input.notes ?? null,
      payment_status: 'pending',
    })
    .select('*')
    .single();

  if (error) return { payment: null, error: error.message };
  return { payment: data as BitpPayment, error: null };
}

export async function getAllPaymentsAdmin(): Promise<BitpPayment[]> {
  const admin = await getAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpPayment[];
}

export async function verifyPaymentAdmin(paymentId: string, verifiedBy: string, status: 'verified' | 'rejected') {
  const admin = await getAdminClient();
  if (!admin) return { error: 'Admin client not configured' };

  const { error } = await admin
    .from('payments')
    .update({
      payment_status: status,
      verified_at: new Date().toISOString(),
      verified_by: verifiedBy,
    })
    .eq('id', paymentId);

  return { error: error?.message ?? null };
}
