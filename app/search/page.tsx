import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { buildExploreSearchUrl, inferExploreType } from '@/lib/search/inferExploreType';
import { parseExploreType } from '@/components/explore/explore-types';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

/** Legacy /search route — aliases to /explore with type inference when type is missing */
export default async function SearchRoute({ searchParams }: Props) {
  const params = await searchParams;
  const q = first(params.q).trim();
  const rawType = first(params.type).trim();
  const type = rawType
    ? parseExploreType(rawType === 'creative-marketing' ? 'marketing' : rawType)
    : inferExploreType(q);
  const category = first(params.category).trim();
  const page = first(params.page).trim();

  if (!category && (!page || page === '1')) {
    redirect(buildExploreSearchUrl({ q, type }));
  }

  const next = new URLSearchParams();
  next.set('type', type);
  if (q) next.set('q', q);
  if (category && category !== 'all') next.set('category', category);
  if (page && page !== '1') next.set('page', page);

  redirect(`${ROUTES.explore}?${next.toString()}`);
}
