import { buildPageMetadata } from '@/lib/metadata';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import { HomePage } from '@/components/home/HomePage';

export const metadata = buildPageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: '/',
});

export default function Home() {
  return <HomePage />;
}
