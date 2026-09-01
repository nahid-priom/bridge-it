'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { defaultPathForRole, safeNextPath } from '@/lib/auth/redirect';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import type { UserRole } from '@/types/database.types';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
}

export async function signInAction(input: { email: string; password: string; next?: string }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase is not configured.' };

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { error: error.message };

  const profile = await getCurrentProfile();
  const role = (profile?.role ?? 'buyer') as UserRole;
  redirect(safeNextPath(input.next, defaultPathForRole(role)));
}

export async function signUpAction(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  next?: string;
}) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase is not configured.' };

  const nextPath = safeNextPath(input.next, '/dashboard');

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.fullName, phone: input.phone ?? '' },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) return { error: error.message };

  if (data.user && !data.session) {
    return { needsConfirmation: true as const };
  }

  redirect(nextPath);
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/');
}

export async function forgotPasswordAction(email: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase is not configured.' };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: true as const };
}

export async function updatePasswordAction(password: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase is not configured.' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  redirect('/dashboard');
}
