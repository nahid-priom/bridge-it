import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAllConsultationsAdmin } from '@/lib/services/consultation.service';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const items = await getAllConsultationsAdmin();
  return NextResponse.json({ items });
}
