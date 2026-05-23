import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardServices } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { ROUTES } from '@/lib/routes';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';

export const metadata = buildPageMetadata({
  title: 'Seller Services',
  path: '/seller-dashboard/services',
  noIndex: true,
});

export default async function SellerServicesPage() {
  const servicesRes = await getSellerDashboardServices();
  const services = servicesRes.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black font-display text-text-primary">Services</h1>
          <p className="text-sm text-text-secondary mt-1">Create, publish, and track gig performance.</p>
        </div>
        <Link
          href={ROUTES.sellerDashboardServicesNew}
          className="inline-flex rounded-xl bg-deshi-green px-4 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark"
        >
          Create service
        </Link>
      </div>

      {services.length === 0 ? (
        <BrandedEmptyState
          title="Create your first service"
          description="List what you offer on the marketplace. Services appear in search and on your seller profile."
          actionLabel="Create service"
          actionHref={ROUTES.sellerDashboardServicesNew}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-border-subtle bg-surface/80 p-5 hover:border-emerald-500/25 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-bold text-text-primary line-clamp-2">{s.title}</h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
                  {s.status}
                </span>
              </div>
              <p className="text-lg font-black text-deshi-green mt-2">
                {formatCurrency(s.priceFrom)}
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-2">
                  <p className="font-bold text-text-primary">{s.impressions}</p>
                  <p className="text-text-muted">Views</p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-2">
                  <p className="font-bold text-text-primary">{s.clicks}</p>
                  <p className="text-text-muted">Clicks</p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-2">
                  <p className="font-bold text-text-primary">{s.orderCount}</p>
                  <p className="text-text-muted">Orders</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={ROUTES.service(s.slug)}
                  className="flex-1 text-center text-xs font-semibold py-2 rounded-lg border border-border-subtle hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  View public
                </Link>
                <Link
                  href={ROUTES.sellerDashboardServicesNew}
                  className="flex-1 text-center text-xs font-semibold py-2 rounded-lg text-deshi-green border border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
