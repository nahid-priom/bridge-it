import { buildPageMetadata } from '@/lib/metadata';
import { getSellerSetupSnapshot } from '@/lib/db/seller-dashboard';
import { SellerSetupProgress } from '@/components/seller-dashboard/SellerSetupProgress';
import { SellerOnboardingChecklist } from '@/components/seller/SellerOnboardingChecklist';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Seller Setup Guide',
  path: '/seller-dashboard/onboarding',
  noIndex: true,
});

export default async function SellerDashboardOnboardingPage() {
  const setupRes = await getSellerSetupSnapshot();
  const setup = setupRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Setup guide</h1>
        <p className="text-sm text-text-secondary mt-1">
          Guided setup — your dashboard stays accessible while you complete these steps.
        </p>
      </div>

      <SellerSetupProgress percent={setup.percent} completedIds={setup.completedIds} />

      <SellerOnboardingChecklist completedIds={setup.completedIds} />

      <div className="rounded-2xl border border-border-subtle bg-surface/80 p-5">
        <h2 className="font-bold text-text-primary">Seller application</h2>
        <p className="text-sm text-text-secondary mt-2">
          Need to submit or check your seller application status?
        </p>
        <Link
          href={ROUTES.sellerOnboarding}
          className="inline-block mt-3 text-sm font-semibold text-deshi-green hover:underline"
        >
          Open application portal →
        </Link>
      </div>

      <Link
        href={ROUTES.sellerDashboard}
        className="inline-flex rounded-xl border border-emerald-500/30 px-4 py-2.5 text-sm font-bold text-deshi-green hover:bg-emerald-500/10"
      >
        Back to control center
      </Link>
    </div>
  );
}
