import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = createAdminSupabaseClient();
  if (!admin) return NextResponse.json({ clients: [] });

  const { data } = await admin
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at')
    .in('role', ['client', 'buyer'])
    .order('created_at', { ascending: false });

  return NextResponse.json({ clients: data ?? [] });
}
