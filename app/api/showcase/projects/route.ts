import { NextRequest, NextResponse } from 'next/server';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { parseShowcaseFilters } from '@/src/features/ecommerce-showcase/utils/filters';
import { GALLERY_PAGE_SIZE } from '@/src/features/ecommerce-showcase/config/constants';

export async function GET(request: NextRequest) {
  const filters = parseShowcaseFilters(request.nextUrl.searchParams);
  const offset = Number(request.nextUrl.searchParams.get('offset') ?? 0);
  const limit = Number(request.nextUrl.searchParams.get('limit') ?? GALLERY_PAGE_SIZE);
  const result = await listProjectCards({ ...filters, offset, limit });
  return NextResponse.json(result);
}
