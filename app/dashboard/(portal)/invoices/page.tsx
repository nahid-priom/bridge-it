import { buildPageMetadata } from '@/lib/metadata';
import { InvoiceCards } from '@/components/client-dashboard/InvoiceCards';
import { getClientInvoicesData } from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Invoices',
  description: 'Download and preview invoices.',
  path: '/dashboard/invoices',
  noIndex: true,
});

export default async function ClientInvoicesPage() {
  const invoices = await getClientInvoicesData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
        <p className="text-sm text-text-muted mt-1">Download PDFs and track payment status.</p>
      </div>
      <InvoiceCards invoices={invoices} />
    </div>
  );
}
