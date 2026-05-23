import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

type Props = { params: Promise<{ slug: string }> };

/** Legacy route — redirects to /seller/[slug] */
export default async function LegacySellerRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(ROUTES.marketplaceSeller(slug));
}
