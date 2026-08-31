import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAllCategoriesAdmin } from '@/lib/services/categories.service';
import { upsertBitpCategoryAction, deleteBitpCategoryAction } from '@/app/actions/bitp-admin';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const categories = await getAllCategoriesAdmin();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const result = await upsertBitpCategoryAction(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ category: result.data });
}
