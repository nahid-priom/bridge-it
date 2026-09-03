import type { UserRole } from '@/types/database.types';

export const SHOWCASE_EDITOR_ROLES: UserRole[] = ['admin', 'super_admin', 'marketing_manager'];
export const SHOWCASE_VIEWER_ROLES: UserRole[] = [...SHOWCASE_EDITOR_ROLES, 'viewer'];

export function isShowcaseEditorRole(role: UserRole | string | null | undefined): boolean {
  return SHOWCASE_EDITOR_ROLES.includes(role as UserRole);
}

export function isShowcaseViewerRole(role: UserRole | string | null | undefined): boolean {
  return SHOWCASE_VIEWER_ROLES.includes(role as UserRole);
}

export function isSuperAdminRole(role: UserRole | string | null | undefined): boolean {
  return role === 'super_admin';
}
