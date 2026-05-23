import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerDashboardProducts } from '@/lib/db/seller-dashboard';
import { formatCurrency } from '@/types/admin';
import { ROUTES } from '@/lib/routes';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';

export const metadata = buildPageMetadata({
  title: 'Seller Products',
  path: '/seller-dashboard/products',
  noIndex: true,
});

export default async function SellerProductsPage() {
  const productsRes = await getSellerDashboardProducts();
  const products = productsRes.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black font-display text-text-primary">Products</h1>
          <p className="text-sm text-text-secondary mt-1">Inventory, pricing, and stock for your product listings.</p>
        </div>
        <Link
          href={ROUTES.sellerDashboardProductsNew}
          className="inline-flex rounded-xl bg-deshi-green px-4 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark"
        >
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <BrandedEmptyState
          title="Add your first product"
          description="Digital and physical products sync to marketplace_products linked to your seller profile."
          actionLabel="Add product"
          actionHref={ROUTES.sellerDashboardProductsNew}
        />
      ) : (
        <div className="rounded-2xl border border-border-subtle bg-surface/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs uppercase text-text-secondary">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-4 font-semibold text-text-primary">{p.name}</td>
                  <td className="px-5 py-4">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-4">{p.stock}</td>
                  <td className="px-5 py-4">
                    {p.rating.toFixed(1)} ({p.reviewCount})
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={ROUTES.product(p.slug)}
                      className="text-xs font-semibold text-deshi-green hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
