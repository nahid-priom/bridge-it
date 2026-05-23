import { buildPageMetadata } from '@/lib/metadata';
import { MessagesPage } from '@/components/MessagesPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Messages',
  description: 'Bridge marketplace messages.',
  path: '/messages',
  noIndex: true,
});

export default function MessagesRoute() {
  return (
    <>
      <PageBreadcrumbJsonLd path="/messages" />
      <MessagesPage />
    </>
  );
}
