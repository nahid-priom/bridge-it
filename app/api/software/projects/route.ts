import { NextRequest, NextResponse } from 'next/server';
import { listSoftwareProjectCards } from '@/src/features/software-showcase/api/projects';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  primaryFilterToTaxonomySlug,
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_PRIMARY_FILTERS,
} from '@/src/features/software-showcase/config/constants';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const pageSize = Math.max(
    1,
    Math.min(Number(params.get('pageSize') ?? SOFTWARE_GALLERY_PAGE_SIZE) || SOFTWARE_GALLERY_PAGE_SIZE, 48)
  );
  const q = params.get('q')?.trim() || undefined;
  const child = params.get('child')?.trim() || undefined;
  const more = parseSoftwareMoreParam(params.get('more'));

  const categoryRaw = params.get('category')?.trim();
  const group = parseSoftwareGroupParam(params.get('group'), params.get('solutionGroup'));

  let taxonomyCategory: string | undefined;
  if (categoryRaw && categoryRaw !== 'all') {
    const primaryIds = new Set(SOFTWARE_PRIMARY_FILTERS.map((f) => f.id));
    if (primaryIds.has(categoryRaw as (typeof SOFTWARE_PRIMARY_FILTERS)[number]['id'])) {
      taxonomyCategory = primaryFilterToTaxonomySlug(categoryRaw) ?? categoryRaw;
    } else {
      taxonomyCategory = categoryRaw;
    }
  } else if (group !== 'all') {
    taxonomyCategory = primaryFilterToTaxonomySlug(group) ?? group;
  }

  const result = await listSoftwareProjectCards({
    page,
    pageSize,
    q,
    taxonomyCategory,
    child: child && child !== 'all' ? child : undefined,
    group: group === 'all' ? undefined : group,
    more: more.length ? more : undefined,
  });

  return NextResponse.json(result);
}
