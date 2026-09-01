import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAdminClient } from '@/lib/services/client';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getAdminClient();
  if (!db) return NextResponse.json({ configs: [] });

  const { data } = await db
    .from('ecommerce_demo_configs')
    .select('id, demo_slug, product_id, active, products(slug, name)')
    .order('demo_slug');

  return NextResponse.json({ configs: data ?? [] });
}
