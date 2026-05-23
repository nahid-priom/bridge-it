import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import type { SellerApplicationStatus } from '@/lib/auth/types';

export type SellerApplicationRow = {
  id: string;
  user_id: string;
  full_name: string;
  business_name: string;
  display_name: string;
  category_focus: string;
  services_offered: string[];
  portfolio_url: string | null;
  social_links: Record<string, string>;
  phone: string;
  location: string;
  bio: string;
  experience_level: string;
  ad_interest: boolean;
  ad_budget_range: string | null;
  status: SellerApplicationStatus;
  admin_note: string | null;
  created_at: string;
};

export async function getOwnSellerApplication(userId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('seller_applications')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return data as SellerApplicationRow | null;
}

export async function listSellerApplicationsForAdmin(status?: SellerApplicationStatus) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from('seller_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (status) query = query.eq('status', status);

  const { data } = await query;
  return (data ?? []) as SellerApplicationRow[];
}

export async function listApplicationDocuments(applicationId: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('seller_documents')
    .select('id, document_type, file_url, status, created_at')
    .eq('application_id', applicationId);

  return data ?? [];
}
