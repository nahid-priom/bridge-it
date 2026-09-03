import { HomePage } from '@/components/home/HomePage';
import { buildPageMetadata } from '@/lib/metadata';
import { listHomepageSections } from '@/src/features/ecommerce-showcase/api/projects';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Premium Custom E-commerce Website Designs | Bridge IT Park',
  description:
    'Browse 100+ custom Next.js, React and Laravel e-commerce website designs. Preview pages, compare packages, and request a custom store.',
  keywords: [
    'custom ecommerce website Bangladesh',
    'Next.js ecommerce website',
    'React ecommerce website Bangladesh',
    'Laravel ecommerce website',
  ],
  path: '/',
});

export default async function Home() {
  const sections = await listHomepageSections();
  return <HomePage sections={sections} />;
}
