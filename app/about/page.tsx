import { buildPageMetadata } from '@/lib/metadata';
import { AboutPage } from '@/components/AboutPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { BRANDING } from '@/lib/config/branding';

export const metadata = buildPageMetadata({
  title: `About ${BRANDING.appName}`,
  description: `Learn about ${BRANDING.appName} — ${BRANDING.description}`,
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
