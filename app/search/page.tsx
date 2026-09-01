import { redirect } from 'next/navigation';
import { solutionsSearchUrl, solutionsUrl } from '@/lib/routes';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy /search route — redirects to unified solutions catalog */
export default async function SearchRoute({ searchParams }: Props) {
  const params = await searchParams;
  const q =
    typeof params.q === 'string'
      ? params.q
      : Array.isArray(params.q)
        ? (params.q[0] ?? '')
        : '';
  const category =
    typeof params.category === 'string'
      ? params.category
      : Array.isArray(params.category)
        ? (params.category[0] ?? '')
        : '';

  if (category && category !== 'all') {
    redirect(solutionsUrl(category, q ? { q } : undefined));
  }
  redirect(solutionsSearchUrl(q));
}
