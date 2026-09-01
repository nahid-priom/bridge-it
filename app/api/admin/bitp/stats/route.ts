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
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });

  const [orders, projects, payments, products] = await Promise.all([
    db.from('orders').select('id', { count: 'exact', head: true }).eq('order_status', 'pending'),
    db.from('projects').select('id', { count: 'exact', head: true }).in('status', ['active', 'in_progress']),
    db.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ]);

  const { data: recentOrders } = await db
    .from('orders')
    .select('id, order_number, total, order_status, created_at, product:products(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return NextResponse.json({
    stats: {
      pendingOrders: orders.count ?? 0,
      activeProjects: projects.count ?? 0,
      pendingPayments: payments.count ?? 0,
      publishedProducts: products.count ?? 0,
    },
    recentOrders: recentOrders ?? [],
  });
}
