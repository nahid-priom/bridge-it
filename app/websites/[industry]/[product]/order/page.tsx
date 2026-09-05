import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/require-auth';
import { buildPageMetadata } from '@/lib/metadata';
import { getProjectBySlug } from '@/src/features/ecommerce-showcase/api/projects';
import { WebsiteOrderForm } from '@/src/features/ecommerce-showcase/public/WebsiteOrderForm';
import { getProductByPath, productPath } from '@/src/features/catalog';

type Props = {
  params: Promise<{ industry: string; product: string }>;
  searchParams: Promise<{ package?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { industry, product: productSlug } = await params;
  const catalogProduct = await getProductByPath('websites', industry, productSlug);
  const project = catalogProduct
    ? await getProjectBySlug(productSlug)
    : null;
  const path = productPath('websites', industry, productSlug) + '/order';
  return buildPageMetadata({
    title: project ? `Order ${project.title}` : 'Order website',
    path,
    noIndex: true,
  });
}

export default async function WebsiteNestedOrderPage({ params, searchParams }: Props) {
  const { industry, product: productSlug } = await params;
  const { package: packageId } = await searchParams;

  const catalogProduct = await getProductByPath('websites', industry, productSlug);
  if (!catalogProduct) notFound();

  const orderPath = `${productPath('websites', industry, productSlug)}/order${
    packageId ? `?package=${packageId}` : ''
  }`;
  const profile = await requireAuth(orderPath);
  const project = await getProjectBySlug(productSlug);
  if (!project || project.packages.length === 0) notFound();

  const selected =
    project.packages.find((pkg) => pkg.id === packageId)?.id ??
    project.packages.find((pkg) => pkg.is_popular)?.id ??
    project.packages[0]?.id;

  const backHref = catalogProduct.canonical_path || productPath('websites', industry, productSlug);

  return (
    <div className="container mx-auto max-w-xl px-4 pb-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb]">Simple order</p>
      <h1 className="mt-2 font-display text-3xl font-black text-text-primary">Order {project.title}</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Confirm your package. We will contact you to start the website.
      </p>
      <p className="mt-1 text-sm text-text-muted">Signed in as {profile.email ?? profile.full_name}</p>

      <div className="mt-8 rounded-3xl border border-border-subtle bg-surface p-5 sm:p-7">
        <WebsiteOrderForm
          projectId={project.id}
          projectSlug={project.slug}
          packages={project.packages}
          defaultPackageId={selected}
          defaultName={profile.full_name ?? ''}
        />
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href={backHref} className="font-semibold text-[#2563eb] hover:underline">
          Back to preview
        </Link>
      </p>
    </div>
  );
}
