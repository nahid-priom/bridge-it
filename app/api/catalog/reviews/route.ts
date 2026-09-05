import { NextRequest, NextResponse } from 'next/server';
import {
  listApprovedReviews,
  submitCatalogReview,
  type CatalogReviewKind,
} from '@/src/features/catalog/api/reviews';

function parseKind(value: string | null): CatalogReviewKind | null {
  if (value === 'software' || value === 'websites') return value;
  return null;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const kind = parseKind(params.get('kind'));
  const productId = params.get('productId')?.trim();
  if (!kind || !productId) {
    return NextResponse.json({ error: 'kind and productId are required' }, { status: 400 });
  }
  const reviews = await listApprovedReviews(kind, productId);
  return NextResponse.json({ items: reviews });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const kind = parseKind(typeof body.kind === 'string' ? body.kind : null);
  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const clientName = typeof body.clientName === 'string' ? body.clientName : '';
  const companyName = typeof body.companyName === 'string' ? body.companyName : undefined;
  const review = typeof body.review === 'string' ? body.review : '';
  const rating = Number(body.rating);

  if (!kind || !productId) {
    return NextResponse.json({ error: 'kind and productId are required' }, { status: 400 });
  }

  const result = await submitCatalogReview({
    kind,
    productId,
    clientName,
    companyName,
    rating,
    review,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Thanks — your review was submitted and is pending approval.',
  });
}
