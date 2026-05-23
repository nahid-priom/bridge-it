import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { safeNextPath } from '@/lib/auth/redirect';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

function isPublicPath(pathname: string): boolean {
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
    pathname.startsWith('/search') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/messages')
  ) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, user, supabaseResponse } = await updateSession(request);

  if (!supabase) return supabaseResponse;

  const needsAuth =
    pathname.startsWith('/admin') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname.startsWith('/seller/onboarding');

  if (!needsAuth && isPublicPath(pathname)) {
    if (user && AUTH_ROUTES.includes(pathname)) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      const role = profile?.role ?? 'buyer';
      const dest =
        role === 'admin'
          ? '/admin'
          : role === 'seller'
            ? '/dashboard/seller'
            : '/dashboard';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return supabaseResponse;
  }

  if (needsAuth && !user) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', safeNextPath(pathname));
    return NextResponse.redirect(login);
  }

  if (user && needsAuth) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role ?? 'buyer';

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/seller') && role !== 'seller' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname === '/dashboard' || (pathname.startsWith('/dashboard/') && !pathname.startsWith('/dashboard/seller'))) {
      if (!['buyer', 'seller', 'admin'].includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
