import { buildPageMetadata } from '@/lib/metadata';
import { requireAuth } from '@/lib/auth/require-auth';
import { getMyConsultations } from '@/lib/services/consultation.service';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';

export const metadata = buildPageMetadata({
  title: 'My Requests | Bridge IT Park',
  path: ROUTES.clientConsultations,
  noIndex: true,
});

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default async function ClientConsultationsPage() {
  await requireAuth(ROUTES.clientConsultations);
  const items = await getMyConsultations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Requests</h1>
          <p className="mt-1 text-sm text-text-muted">
            Free consultation requests linked to your phone.
          </p>
        </div>
        <Link
          href={ROUTES.consultation}
          className="deshi-btn-primary inline-flex items-center justify-center px-5 py-2.5 text-sm"
        >
          New consultation
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-text-muted dark:border-white/10 dark:bg-surface">
          No consultation requests yet.{' '}
          <Link href={ROUTES.consultation} className="font-semibold text-bridge-primary underline">
            Request a free consultation
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-surface"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-text-primary">
                    {item.service_interested_in ?? 'Consultation'}
                  </p>
                  {item.business_name ? (
                    <p className="text-sm text-text-muted">{item.business_name}</p>
                  ) : null}
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-white/10 dark:text-white/80">
                  {item.status}
                </span>
              </div>
              {item.message ? (
                <p className="mt-2 text-sm text-text-secondary whitespace-pre-wrap">{item.message}</p>
              ) : null}
              <p className="mt-3 text-xs text-text-muted">{formatWhen(item.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
