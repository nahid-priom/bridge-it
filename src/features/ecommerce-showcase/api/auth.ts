import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { redirect } from 'next/navigation';
import type { AuthProfile } from '@/lib/auth/types';
import { isShowcaseEditorRole, isShowcaseViewerRole, isSuperAdminRole } from '../config/roles';

export { isShowcaseEditorRole, isShowcaseViewerRole, isSuperAdminRole };

export async function requireShowcaseViewer(): Promise<AuthProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login?next=%2Fadmin%2Fecommerce-projects');
  if (!isShowcaseViewerRole(profile.role)) redirect('/unauthorized');
  return profile;
}

export async function requireShowcaseEditor(): Promise<AuthProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login?next=%2Fadmin%2Fecommerce-projects');
  if (!isShowcaseEditorRole(profile.role)) redirect('/unauthorized');
  return profile;
}

export async function assertShowcaseEditor() {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'You must be signed in.' as const };
  if (!isShowcaseEditorRole(profile.role)) return { error: 'Editor access required.' as const };
  return { profile };
}

export async function assertShowcaseViewer() {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'You must be signed in.' as const };
  if (!isShowcaseViewerRole(profile.role)) return { error: 'Staff access required.' as const };
  return { profile };
}
