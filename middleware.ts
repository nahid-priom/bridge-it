import { type NextRequest, NextResponse } from 'next/server';
import { handleMarketplaceMiddleware } from '@/lib/auth/marketplace-middleware';
import { updateSession } from '@/lib/supabase/middleware';

function apexToWwwRedirect(request: NextRequest) {
  const hostname = (request.headers.get('host') ?? '').split(':')[0];
  if (hostname !== 'bridgeitpark.com') return null;
  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.host = 'www.bridgeitpark.com';
  return NextResponse.redirect(url, 308);
}

export async function middleware(request: NextRequest) {
  const wwwRedirect = apexToWwwRedirect(request);
  if (wwwRedirect) return wwwRedirect;

  const { supabase, user, supabaseResponse } = await updateSession(request);
  if (!supabase) return supabaseResponse;
  return handleMarketplaceMiddleware(request, supabase, user, supabaseResponse);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
