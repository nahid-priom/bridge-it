'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import type { AuthProfile } from '@/lib/auth/types';

export async function refreshProfileAction(): Promise<{
  profile: AuthProfile | null;
  error?: string;
}> {
  const profile = await getCurrentProfile();
  if (!profile) return { profile: null };

  revalidatePath('/', 'layout');
  revalidatePath('/seller/onboarding');
  revalidatePath('/seller-dashboard');
  revalidatePath('/dashboard');

  return { profile };
}
