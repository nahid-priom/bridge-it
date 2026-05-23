import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Create Service',
  path: '/seller-dashboard/services/new',
  noIndex: true,
});

export default function SellerCreateServicePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Create service</h1>
        <p className="text-sm text-text-secondary mt-1">
          Define your gig title, packages, delivery time, and pricing. Publishing links it to your seller profile.
        </p>
      </div>
      <form className="rounded-2xl border border-border-subtle bg-surface/80 p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary">Service title</label>
          <input
            type="text"
            placeholder="e.g. I will build a responsive Next.js website"
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Short description</label>
          <textarea
            rows={3}
            placeholder="What buyers get when they order..."
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary">Starting price (BDT)</label>
            <input
              type="number"
              min={500}
              defaultValue={5000}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary">Delivery (days)</label>
            <input
              type="number"
              min={1}
              defaultValue={3}
              className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Full service CRUD will sync to marketplace_services with your seller_id. Save as draft or publish when ready.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 py-2.5 rounded-xl border border-border-subtle font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/5"
          >
            Save draft
          </button>
          <button
            type="button"
            className="flex-1 py-2.5 rounded-xl bg-deshi-green text-white font-bold text-sm hover:bg-deshi-green-dark"
          >
            Publish service
          </button>
        </div>
      </form>
      <Link href={ROUTES.sellerDashboardServices} className="text-sm font-semibold text-deshi-green hover:underline">
        ← Back to services
      </Link>
    </div>
  );
}
