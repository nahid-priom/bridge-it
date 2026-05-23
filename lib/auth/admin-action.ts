import { getCurrentProfile } from '@/lib/auth/get-current-user';

export type AdminActionResult<T> = { data: T } | { error: string };

export async function assertAdminAction(): Promise<
  { userId: string; email: string | null } | { error: string }
> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'You must be signed in as an admin.' };
  if (profile.role !== 'admin') return { error: 'Admin access required.' };
  return { userId: profile.id, email: profile.email };
}
