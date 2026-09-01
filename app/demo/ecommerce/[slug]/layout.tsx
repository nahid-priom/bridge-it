import { buildPageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: `Live Demo | ${SITE_NAME}`,
  description: 'Interactive e-commerce demo — explore before you order.',
  path: '/demo/ecommerce',
  noIndex: true,
});

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
