import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getBitpClientQuotations } from '@/lib/services/dashboard.service';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/services/client';
import { AcceptQuotationButton } from '@/components/client-dashboard/AcceptQuotationButton';

export const metadata = buildPageMetadata({
  title: 'Quotations | Bridge IT Park',
  path: '/dashboard/quotations',
  noIndex: true,
});

export default async function ClientQuotationsPage() {
  const quotations = await getBitpClientQuotations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quotations</h1>
        <p className="text-sm text-text-secondary mt-1">Review and accept custom quotes from Bridge IT Park.</p>
      </div>

      {quotations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center">
          <p className="text-text-secondary mb-4">No quotation available.</p>
          <Link href={ROUTES.consultation} className="deshi-btn-primary px-6 py-2.5 inline-block text-sm">
            Request a Quote
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => (
            <article key={q.id} className="rounded-2xl border border-slate-200 dark:border-white/10 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-text-secondary">{q.quotation_number}</p>
                  <h2 className="text-lg font-bold mt-1">{q.title}</h2>
                  {q.description && <p className="text-sm text-text-secondary mt-1">{q.description}</p>}
                  <p className="text-xl font-black text-deshi-green mt-2">{formatBdt(Number(q.total))}</p>
                  <p className="text-xs text-text-secondary capitalize mt-1">Status: {q.status}</p>
                </div>
                {q.status === 'sent' && <AcceptQuotationButton quotationId={q.id} />}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
