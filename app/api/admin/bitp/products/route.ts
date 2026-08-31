import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { upsertBitpProductAction } from '@/app/actions/bitp-admin';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { getAllProductsAdmin } = await import('@/lib/services/products.service');
  const products = await getAllProductsAdmin();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const result = await upsertBitpProductAction(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ product: result.data });
}
