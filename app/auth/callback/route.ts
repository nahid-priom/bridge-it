import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { defaultPathForRole, safeNextPath } from '@/lib/auth/redirect';
import type { UserRole } from '@/types/database.types';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'), '/');

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          const role = (profile?.role ?? 'buyer') as UserRole;
          const dest =
            next === '/' ? defaultPathForRole(role) : next;
          return NextResponse.redirect(`${origin}${dest}`);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
