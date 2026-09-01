import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { safeNextPath } from '@/lib/auth/redirect';
import { loadMarketplaceAccessFromSupabase } from '@/lib/auth/load-marketplace-access';
import { resolveAuthLandingPath, resolveDashboardRoute } from '@/lib/auth/resolveMarketplaceAccess';
import { ROUTES } from '@/lib/routes';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

const DEPRECATED_SELLER_PREFIXES = [
  '/seller-dashboard',
  '/seller/onboarding',
  '/dashboard/seller',
];

export function isPublicPath(pathname: string): boolean {
  if (AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return true;
  if (pathname.startsWith('/auth/')) return true;
  if (pathname === '/unauthorized') return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api/')) return false;
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return true;

  const publicPrefixes = [
    '/',
    '/solutions',
    '/pricing',
    '/portfolio',
    '/consultation',
    '/demo',
    '/about',
    '/categories',
    '/products',
    '/services',
    '/search',
  ];

  if (publicPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;

  // Redirect deprecated seller profile routes
  if (pathname.startsWith('/seller/') || pathname.startsWith('/sellers/')) return true;

  return false;
}

export function isProtectedMarketplacePath(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return true;
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return true;
  return DEPRECATED_SELLER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

type SessionSupabase = Parameters<typeof loadMarketplaceAccessFromSupabase>[0];

function normalizeRole(role: string | undefined): string {
  if (role === 'buyer') return 'client';
  return role ?? 'client';
}

export async function handleMarketplaceMiddleware(
  request: NextRequest,
  supabase: SessionSupabase,
  user: { id: string } | null,
  supabaseResponse: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Block deprecated seller routes
  if (DEPRECATED_SELLER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!user) {
      const login = new URL('/login', request.url);
      login.searchParams.set('next', safeNextPath(pathname));
      return NextResponse.redirect(login);
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    const role = normalizeRole(profile?.role);
    if (role === 'admin' || role === 'super_admin') {
      return NextResponse.redirect(new URL(ROUTES.admin, request.url));
    }
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  // Redirect legacy seller profiles to solutions
  if (pathname.startsWith('/seller/') || pathname.startsWith('/sellers/')) {
    return NextResponse.redirect(new URL(ROUTES.solutions, request.url));
  }

  // Redirect cart to solutions
  if (pathname === '/cart') {
    return NextResponse.redirect(new URL(ROUTES.solutions, request.url));
  }

  const protectedPath = isProtectedMarketplacePath(pathname);

  if (!protectedPath && isPublicPath(pathname)) {
    if (user && AUTH_ROUTES.includes(pathname)) {
      const next = request.nextUrl.searchParams.get('next');
      if (next) {
        const safe = safeNextPath(next);
        if (safe !== '/') {
          return NextResponse.redirect(new URL(safe, request.url));
        }
      }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      const role = normalizeRole(profile?.role);
      return NextResponse.redirect(new URL(resolveAuthLandingPath(role as import('@/types/database.types').UserRole), request.url));
    }
    return supabaseResponse;
  }

  if (protectedPath && !user) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', safeNextPath(pathname));
    return NextResponse.redirect(login);
  }

  if (!user || !protectedPath) return supabaseResponse;

  const ctx = await loadMarketplaceAccessFromSupabase(supabase, user.id);
  const role = normalizeRole(ctx.profile?.role);

  if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard')) {
    if (!['client', 'buyer', 'seller', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(resolveDashboardRoute(role), request.url));
  }

  return supabaseResponse;
}
