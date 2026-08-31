import { buildPageMetadata } from '@/lib/metadata';
import { BRANDING } from '@/lib/config/branding';
import { MessagesPage } from '@/components/MessagesPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { fetchTopSellers } from '@/lib/catalog/sellers';

export const metadata = buildPageMetadata({
  title: 'Messages',
  description: `${BRANDING.appName} client messages.`,
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
