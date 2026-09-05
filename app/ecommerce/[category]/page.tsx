import { permanentRedirect } from 'next/navigation';

type Props = { params: Promise<{ category: string }> };

/** Permanent redirect: /ecommerce/[category] → /websites/[category] */
export default async function EcommerceCategoryRedirect({ params }: Props) {
  const { category } = await params;
  permanentRedirect(`/websites/${category}`);
}
