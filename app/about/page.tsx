import { buildPageMetadata } from '@/lib/metadata';
import { AboutPage } from '@/components/AboutPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'About Deshi Fiverr',
  description:
    'Learn about Deshi Fiverr — Bangladesh\'s trusted freelance marketplace for digital services, creators, and businesses.',
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
