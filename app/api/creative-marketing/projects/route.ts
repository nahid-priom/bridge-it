import { NextRequest, NextResponse } from 'next/server';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';
import {
  CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
  parseCreativeGroupParam,
  parseCreativeMoreParam,
} from '@/src/features/creative-marketing-showcase/config/constants';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const pageSize = Math.max(
    1,
    Math.min(
      Number(params.get('pageSize') ?? CREATIVE_MARKETING_GALLERY_PAGE_SIZE) ||
        CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
      48
    )
  );
  const q = params.get('q')?.trim() || undefined;
  const group = parseCreativeGroupParam(params.get('group'), params.get('serviceGroup'));
  const more = parseCreativeMoreParam(params.get('more'));

  const result = await listCreativeMarketingCards({
    page,
    pageSize,
    q,
    group: group === 'all' ? undefined : group,
    more: more.length ? more : undefined,
  });

  return NextResponse.json(result);
}
