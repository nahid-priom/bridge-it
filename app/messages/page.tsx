import { buildPageMetadata } from '@/lib/metadata';
import { MessagesPage } from '@/components/MessagesPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { fetchTopSellers } from '@/lib/catalog/sellers';

export const metadata = buildPageMetadata({
  title: 'Messages',
  description: 'Deshi Fiverr marketplace messages.',
  path: '/messages',
  noIndex: true,
});

export default async function MessagesRoute() {
  const contacts = await fetchTopSellers(8);

  return (
    <>
      <PageBreadcrumbJsonLd path="/messages" />
      <MessagesPage contacts={contacts} />
    </>
  );
}
