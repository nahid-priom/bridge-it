import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold font-display text-text-primary mb-2">Service not found</h1>
      <p className="text-text-muted mb-8 max-w-md mx-auto">
        This product or service listing may have been removed or the link is incorrect.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center px-6 py-3 rounded-xl bg-bridge-primary text-white font-semibold hover:bg-bridge-primary-light transition-colors"
      >
        Browse all products
      </Link>
    </main>
  );
}
