import type { BitpConsultationRequest, CreateConsultationInput } from '@/types/bitp';
import { getServerClient, getAdminClient } from '@/lib/services/client';
import { getCurrentProfile } from '@/lib/auth/get-current-user';

function serviceInterestedIn(input: CreateConsultationInput): string | null {
  const value = input.service_interested_in ?? input.service_interested;
  return value?.trim() ? value.trim() : null;
}

export async function createConsultationRequest(input: CreateConsultationInput) {
  const supabase = await getServerClient();
  if (!supabase) return { error: 'Database not configured' };

  const name = input.name?.trim();
  const phone = input.phone?.trim();
  if (!name || !phone) {
    return { error: 'Name and phone are required' };
  }

  const interested = serviceInterestedIn(input);
  if (!interested) {
    return { error: 'Please select a service you are interested in' };
  }

  const { error } = await supabase.from('consultation_requests').insert({
    name,
    phone,
    email: null,
    business_name: input.business_name?.trim() || null,
    service_interested_in: interested,
    message: input.message?.trim() || null,
    product_id: input.product_id || null,
    status: 'new',
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function getAllConsultationsAdmin(): Promise<BitpConsultationRequest[]> {
  const admin = await getAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from('consultation_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as BitpConsultationRequest[];
}

export async function getMyConsultations(): Promise<BitpConsultationRequest[]> {
  const profile = await getCurrentProfile();
  if (!profile) return [];

  const admin = await getAdminClient();
  if (!admin) return [];

  const { data: profileRow } = await admin
    .from('profiles')
    .select('email, phone')
    .eq('id', profile.id)
    .maybeSingle();

  const email = ((profileRow?.email as string | null) ?? profile.email)?.trim() || null;
  const phone = ((profileRow?.phone as string | null) ?? null)?.trim() || null;

  if (!email && !phone) return [];

  const byId = new Map<string, BitpConsultationRequest>();

  if (email) {
    const { data } = await admin
      .from('consultation_requests')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
    for (const row of data ?? []) {
      byId.set(row.id as string, row as BitpConsultationRequest);
    }
  }

  if (phone) {
    const { data } = await admin
      .from('consultation_requests')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false });
    for (const row of data ?? []) {
      byId.set(row.id as string, row as BitpConsultationRequest);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function updateConsultationStatusAdmin(id: string, status: string) {
  const admin = await getAdminClient();
  if (!admin) return { error: 'Admin client not configured' };

  const { error } = await admin.from('consultation_requests').update({ status }).eq('id', id);
  return { error: error?.message ?? null };
}
