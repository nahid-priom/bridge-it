import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Add Product',
  path: '/seller-dashboard/products/new',
  noIndex: true,
});

export default function SellerCreateProductPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Add product</h1>
        <p className="text-sm text-text-secondary mt-1">List physical or digital products with inventory and shipping.</p>
      </div>
      <form className="rounded-2xl border border-border-subtle bg-surface/80 p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary">Product name</label>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary">Price (BDT)</label>
            <input type="number" min={0} className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary">Stock</label>
            <input type="number" min={0} defaultValue={10} className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Shipping notes</label>
          <input
            type="text"
            placeholder="Nationwide delivery, digital download, etc."
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <button
          type="button"
          className="w-full py-2.5 rounded-xl bg-deshi-green text-white font-bold text-sm hover:bg-deshi-green-dark"
        >
          Save product
        </button>
      </form>
      <Link href={ROUTES.sellerDashboardProducts} className="text-sm font-semibold text-deshi-green hover:underline">
        ← Back to products
      </Link>
    </div>
  );
}
