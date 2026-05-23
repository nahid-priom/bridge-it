import type { UserRole } from '@/types/database.types';
import { getDashboardPathForRole } from '@/lib/auth/dashboard-routes';

const ALLOWED_PREFIXES = [
  '/',
  '/categories',
  '/products',
  '/services',
  '/sellers',
  '/search',
  '/about',
  '/cart',
  '/messages',
  '/dashboard',
  '/admin',
  '/seller',
  '/login',
  '/signup',
];

/** Prevent open redirects — only same-site relative paths. */
export function safeNextPath(next: string | null | undefined, fallback = '/'): string {
  if (!next || typeof next !== 'string') return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;
  try {
    const url = new URL(trimmed, 'http://localhost');
    if (url.pathname.includes('..')) return fallback;
    const allowed = ALLOWED_PREFIXES.some(
      (p) => url.pathname === p || url.pathname.startsWith(`${p}/`)
    );
    return allowed ? `${url.pathname}${url.search}` : fallback;
  } catch {
    return fallback;
  }
}

export function defaultPathForRole(role: UserRole): string {
  return getDashboardPathForRole(role);
}
