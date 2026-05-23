import { buildPageMetadata } from '@/lib/metadata';
import { AboutPage } from '@/components/AboutPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'About Bridge',
  description:
    'Learn about Bridge — Bangladesh\'s premier Smart Virtual IT Park for digital services, creators, and businesses.',
  path: '/about',
});

export default function AboutRoute() {
  return (
    <>
      <PageBreadcrumbJsonLd path="/about" />
      <AboutPage />
    </>
  );
}
