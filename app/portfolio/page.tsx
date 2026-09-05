import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

/** Portfolio nav now lives at /explore (mixed showroom). */
export default function PortfolioPage() {
  redirect(ROUTES.explore);
}
