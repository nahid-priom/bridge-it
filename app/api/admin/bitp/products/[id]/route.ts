import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { upsertBitpProductAction, deleteBitpProductAction } from '@/app/actions/bitp-admin';
import { getProductByIdAdmin } from '@/lib/services/products.service';

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const product = await getProductByIdAdmin(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const result = await upsertBitpProductAction({ ...body, id });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ product: result.data });
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const result = await deleteBitpProductAction(id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
