import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { upsertBitpProductAction } from '@/app/actions/bitp-admin';
import { adminListProjects } from '@/src/features/ecommerce-showcase/api/admin';
import { mapCard } from '@/src/features/ecommerce-showcase/api/projects';
import { BITP_ECOMMERCE_SOLUTIONS_SLUG } from '@/src/features/ecommerce-showcase/config/constants';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { getAllProductsAdmin } = await import('@/lib/services/products.service');
  const [products, showcaseRows] = await Promise.all([getAllProductsAdmin(), adminListProjects()]);
  const showcaseProjects = showcaseRows
    .map((row) => mapCard(row as Record<string, unknown>))
    .filter((row) => !row.deleted_at)
    .map((project) => ({
      ...project,
      catalog_category_slug: BITP_ECOMMERCE_SOLUTIONS_SLUG,
      catalog_category_name: 'E-commerce Solutions',
    }));

  return NextResponse.json({ products, showcaseProjects });
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
