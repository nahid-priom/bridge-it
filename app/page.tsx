import { HomePage } from '@/components/home/HomePage';
import { buildPageMetadata } from '@/lib/metadata';
import { listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';

/** Homepage Design Gallery shows 4 featured-first cards (DB already sorts featured → sort_order). */
const HOME_GALLERY_LIMIT = 4;

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
  const { items } = await listProjectCards({ limit: HOME_GALLERY_LIMIT, offset: 0 });
  return <HomePage projects={items} />;
}
