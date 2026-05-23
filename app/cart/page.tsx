import { buildPageMetadata } from '@/lib/metadata';
import { CartPage } from '@/components/CartPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Shopping Cart',
  description: 'Review items in your Deshi Fiverr cart.',
  path: '/cart',
  noIndex: true,
});

export default function CartRoute() {
  return (
    <>
      <PageBreadcrumbJsonLd path="/cart" />
      <CartPage />
    </>
  );
}
