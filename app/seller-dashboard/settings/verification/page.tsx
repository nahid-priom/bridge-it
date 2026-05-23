import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getSellerProfileSnapshot } from '@/lib/db/seller-dashboard';
import { SellerSettingsNav } from '@/components/seller-dashboard/SellerSettingsNav';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Identity Verification',
  path: '/seller-dashboard/settings/verification',
  noIndex: true,
});

export default async function SellerVerificationSettingsPage() {
  const profileRes = await getSellerProfileSnapshot();
  const profile = profileRes.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Identity verification</h1>
        <p className="text-sm text-text-secondary mt-1">Verify your identity to unlock full seller features.</p>
      </div>
      <SellerSettingsNav />
      <div className="rounded-2xl border border-border-subtle bg-surface/80 p-6 max-w-2xl">
        {profile?.isVerified ? (
          <p className="text-emerald-600 font-semibold">Your identity is verified.</p>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-4">
              Submit government ID and a selfie to complete verification. This stays in your seller workspace.
            </p>
            <Link
              href={ROUTES.sellerOnboarding}
              className="inline-flex rounded-xl bg-deshi-green px-4 py-2.5 text-sm font-bold text-white"
            >
              Continue verification application
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
