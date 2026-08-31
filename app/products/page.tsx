import { redirect } from 'next/navigation';
import { ROUTES, solutionsUrl } from '@/lib/routes';

export default async function ProductsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.q) qs.set('q', params.q);
  const query = qs.toString();
  redirect(query ? `${ROUTES.solutions}?${query}` : ROUTES.solutions);
}
