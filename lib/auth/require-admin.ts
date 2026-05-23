import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/get-current-user';

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/login?next=%2Fadmin');
  }
  if (profile.role !== 'admin') {
    redirect('/unauthorized');
  }
  return profile;
}
