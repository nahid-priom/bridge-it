import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { upsertBitpCategoryAction, deleteBitpCategoryAction } from '@/app/actions/bitp-admin';

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const result = await upsertBitpCategoryAction({ ...body, id });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ category: result.data });
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const result = await deleteBitpCategoryAction(id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
