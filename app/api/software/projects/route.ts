import { NextRequest, NextResponse } from 'next/server';
import { listSoftwareProjectCards } from '@/src/features/software-showcase/api/projects';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  SOFTWARE_GALLERY_PAGE_SIZE,
} from '@/src/features/software-showcase/config/constants';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const pageSize = Math.max(
    1,
    Math.min(Number(params.get('pageSize') ?? SOFTWARE_GALLERY_PAGE_SIZE) || SOFTWARE_GALLERY_PAGE_SIZE, 48)
  );
  const q = params.get('q')?.trim() || undefined;
  const industry =
    params.get('industry')?.trim() || params.get('category')?.trim() || undefined;
  const group = parseSoftwareGroupParam(
    params.get('group'),
    params.get('solutionGroup')
    // intentionally ignore `type` — reserved for explore pillars
  );
  const more = parseSoftwareMoreParam(params.get('more'));

  const result = await listSoftwareProjectCards({
    page,
    pageSize,
    q,
    category: industry && industry !== 'all' ? industry : undefined,
    group: group === 'all' ? undefined : group,
    more: more.length ? more : undefined,
  });

  return NextResponse.json(result);
}
