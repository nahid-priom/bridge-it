import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AuthProfile } from '@/lib/auth/types';
import type { UserRole } from '@/types/database.types';

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getCurrentProfile(): Promise<AuthProfile | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, seller_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string) ?? null,
      avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
      role: 'buyer',
      seller_id: null,
    };
  }

  return profile as AuthProfile;
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getCurrentProfile();
  return profile?.role ?? null;
}
