import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAllOrdersAdmin } from '@/lib/services/orders.service';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const orders = await getAllOrdersAdmin();
  return NextResponse.json({ orders });
}
