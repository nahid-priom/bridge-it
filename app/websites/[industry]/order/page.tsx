import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/require-auth';
import { buildPageMetadata } from '@/lib/metadata';
import { getProjectBySlug } from '@/src/features/ecommerce-showcase/api/projects';
import { WebsiteOrderForm } from '@/src/features/ecommerce-showcase/public/WebsiteOrderForm';
import { getProductRefById, productPath } from '@/src/features/catalog';

type Props = {
  params: Promise<{ industry: string }>;
  searchParams: Promise<{ package?: string }>;
};

/**
 * Legacy flat order URL: /websites/{productSlug}/order
 * Redirects to nested /websites/{industry}/{product}/order when industry is known.
 */
export async function generateMetadata({ params }: Props) {
  const { industry: productSlug } = await params;
  const project = await getProjectBySlug(productSlug);
  return buildPageMetadata({
    title: project ? `Order ${project.title}` : 'Order website',
    path: `/websites/${productSlug}/order`,
    noIndex: true,
  });
}

export default async function LegacyWebsiteOrderPage({ params, searchParams }: Props) {
  const { industry: productSlug } = await params;
  const { package: packageId } = await searchParams;
  const qs = packageId ? `?package=${packageId}` : '';

  const project = await getProjectBySlug(productSlug);
  if (!project || project.packages.length === 0) notFound();

  const catalogProduct = await getProductRefById('websites', project.id);
  if (catalogProduct?.industry_slug) {
    redirect(
      `${productPath('websites', catalogProduct.industry_slug, project.slug)}/order${qs}`
    );
  }

  const orderPath = `/websites/${productSlug}/order${qs}`;
  const profile = await requireAuth(orderPath);

  const selected =
    project.packages.find((pkg) => pkg.id === packageId)?.id ??
    project.packages.find((pkg) => pkg.is_popular)?.id ??
    project.packages[0]?.id;

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
        <Link href={`/websites/${project.slug}`} className="font-semibold text-[#2563eb] hover:underline">
          Back to preview
        </Link>
      </p>
    </div>
  );
}
