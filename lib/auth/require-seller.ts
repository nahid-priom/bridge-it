import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { safeNextPath } from '@/lib/auth/redirect';
import type { AuthProfile } from '@/lib/auth/types';

export async function requireSeller(next?: string): Promise<AuthProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    const dest = safeNextPath(next, '/dashboard/seller');
    redirect(`/login?next=${encodeURIComponent(dest)}`);
  }
  if (profile.role !== 'seller' && profile.role !== 'admin') {
    redirect('/unauthorized');
  }
  return profile;
}
