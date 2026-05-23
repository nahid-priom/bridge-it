import { type NextRequest } from 'next/server';
import { handleMarketplaceMiddleware } from '@/lib/auth/marketplace-middleware';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, user, supabaseResponse } = await updateSession(request);
  if (!supabase) return supabaseResponse;
  return handleMarketplaceMiddleware(request, supabase, user, supabaseResponse);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
