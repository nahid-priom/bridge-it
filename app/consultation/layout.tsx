import { buildPageMetadata } from '@/lib/metadata';
import { BRANDING } from '@/lib/config/branding';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Free Consultation',
  description: `Request a free business consultation with ${BRANDING.appName}. Tell us about your goals and we'll recommend the right digital solution.`,
  path: '/consultation',
});

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBreadcrumbJsonLd path="/consultation" />
      {children}
    </>
  );
}
