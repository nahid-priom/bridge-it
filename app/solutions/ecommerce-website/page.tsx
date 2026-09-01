import { redirect } from 'next/navigation';

type PageProps = { params: Promise<{ slug: string }> };

/** Legacy slug redirect */
export default async function LegacyEcommerceRedirect({ params }: PageProps) {
  const { slug } = await params;
  if (slug === 'ecommerce-website') {
    redirect('/solutions/ecommerce/automated-ecommerce');
  }
  redirect(`/solutions/${slug}`);
}
