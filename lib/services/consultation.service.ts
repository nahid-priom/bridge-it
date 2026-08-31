import type { CreateConsultationInput } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';

export async function createConsultationRequest(input: CreateConsultationInput) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const { error } = await supabase.from('consultation_requests').insert({
    name: input.name,
    phone: input.phone,
    business_name: input.business_name ?? null,
    service_interested: input.service_interested ?? null,
    message: input.message ?? null,
    status: 'new',
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function getAllConsultationsAdmin() {
  const admin = await getAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from('consultation_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function updateConsultationStatusAdmin(id: string, status: string) {
  const admin = await getAdminClient();
  if (!admin) return { error: 'Admin client not configured' };

  const { error } = await admin.from('consultation_requests').update({ status }).eq('id', id);
  return { error: error?.message ?? null };
}
