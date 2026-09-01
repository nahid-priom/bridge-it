import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Software Live Demo',
  path: '/demo/software',
  noIndex: true,
});

export default function SoftwareDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
