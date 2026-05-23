import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { safeNextPath } from '@/lib/auth/redirect';
import {
  loadMarketplaceAccessFromSupabase,
} from '@/lib/auth/load-marketplace-access';
import {
  isSellerFullyActivated,
  resolveAuthLandingPath,
  resolveDashboardRoute,
  resolveSellerAccess,
} from '@/lib/auth/resolveMarketplaceAccess';
import { ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types/database.types';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function isPublicPath(pathname: string): boolean {
  if (AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return true;
  if (pathname.startsWith('/auth/')) return true;
  if (pathname === '/unauthorized') return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api/')) return false;
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return true;
  if (
    pathname === '/' ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/sellers') ||
    (pathname.startsWith('/seller/') && !pathname.startsWith(ROUTES.sellerOnboarding)) ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/messages')
  ) {
    return true;
  }
  return false;
}

export function isProtectedMarketplacePath(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname.startsWith('/seller/onboarding') ||
    pathname === '/seller-dashboard' ||
    pathname.startsWith('/seller-dashboard/')
  );
}

type SessionSupabase = Parameters<typeof loadMarketplaceAccessFromSupabase>[0];

export async function handleMarketplaceMiddleware(
  request: NextRequest,
  supabase: SessionSupabase,
  user: { id: string } | null,
  supabaseResponse: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const protectedPath = isProtectedMarketplacePath(pathname);

  if (!protectedPath && isPublicPath(pathname)) {
    if (user && AUTH_ROUTES.includes(pathname)) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      const role = (profile?.role as UserRole | undefined) ?? 'buyer';
      return NextResponse.redirect(new URL(resolveAuthLandingPath(role), request.url));
    }
    return supabaseResponse;
  }

  if (protectedPath && !user) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', safeNextPath(pathname));
    return NextResponse.redirect(login);
  }

  if (!user || !protectedPath) {
    return supabaseResponse;
  }

  const ctx = await loadMarketplaceAccessFromSupabase(supabase, user.id);
  const role = ctx.profile?.role ?? 'buyer';

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  const sellerPaths =
    pathname === ROUTES.sellerDashboard || pathname.startsWith(`${ROUTES.sellerDashboard}/`);

  if (sellerPaths) {
    const seller = resolveSellerAccess(ctx);
    if (!seller.canAccessSellerDashboard && seller.redirectTo) {
      return NextResponse.redirect(new URL(seller.redirectTo, request.url));
    }
  }

  if (pathname.startsWith(ROUTES.sellerOnboarding)) {
    if (isSellerFullyActivated(ctx)) {
      return NextResponse.redirect(new URL(ROUTES.sellerDashboard, request.url));
    }
  }

  if (
    pathname === ROUTES.dashboard ||
    (pathname.startsWith(`${ROUTES.dashboard}/`) && !pathname.startsWith('/dashboard/seller'))
  ) {
    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(resolveDashboardRoute(role), request.url));
  }

  return supabaseResponse;
}
