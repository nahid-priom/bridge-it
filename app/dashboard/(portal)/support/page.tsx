import { buildPageMetadata } from '@/lib/metadata';
import { SupportTicketsPanel } from '@/components/client-dashboard/SupportTicketsPanel';
import { getClientSupportTicketsData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Support',
  description: 'Support tickets and help center.',
  path: '/dashboard/support',
  noIndex: true,
});

export default async function ClientSupportPage() {
  const tickets = await getClientSupportTicketsData();
  return <SupportTicketsPanel tickets={tickets} />;
}
