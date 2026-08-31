'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { BitpProductDetail } from '@/types/bitp';
import { DynamicRequirementForm } from '@/components/order/DynamicRequirementForm';
import { submitOrderAction } from '@/app/actions/bitp';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/format/currency';

type OrderPageClientProps = {
  product: BitpProductDetail;
  selectedPackageId?: string;
};

export function OrderPageClient({ product, selectedPackageId }: OrderPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const selectedPackage = product.packages.find((p) => p.id === selectedPackageId) ?? product.packages[0];

  const handleSubmit = (values: Record<string, string>) => {
    setError(null);
    startTransition(async () => {
      const requirements = product.requirement_fields.map((field) => ({
        field_key: field.field_key,
        label: field.label,
        value: values[field.field_key] ?? '',
        field_id: field.id,
      }));

      const result = await submitOrderAction({
        product_id: product.id,
        package_id: selectedPackage?.id ?? null,
        requirements,
      });

      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <nav className="text-sm text-text-secondary mb-6">
        <Link href={ROUTES.solution(product.slug)} className="hover:text-deshi-green">
          {product.name}
        </Link>
        <span className="mx-2">/</span>
        <span>Order</span>
      </nav>

      <h1 className="text-2xl font-black mb-2">Place Your Order</h1>
      <p className="text-text-secondary mb-6">
        {selectedPackage
          ? `${selectedPackage.name} — ${formatBdt(Number(selectedPackage.price))}`
          : `Starting from ${formatBdt(Number(product.starting_price))}`}
      </p>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">{error}</div>
      )}

      {product.requirement_fields.length > 0 ? (
        <DynamicRequirementForm
          fields={product.requirement_fields}
          onSubmit={handleSubmit}
          submitting={isPending}
        />
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit({})}
          className="deshi-btn-primary w-full py-3.5 font-bold disabled:opacity-60"
        >
          {isPending ? 'Processing...' : 'Confirm Order'}
        </button>
      )}

      <p className="text-xs text-text-secondary text-center mt-6">
        You may need to log in to complete your order.
      </p>
    </div>
  );
}
