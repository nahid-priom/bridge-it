import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/require-auth';
import { getOwnSellerApplication } from '@/lib/db/seller-applications';
import { SellerOnboardingForm } from '@/components/seller/SellerOnboardingForm';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Become a Seller',
  description: 'Apply to sell on Bridge Smart IT Park',
  path: '/seller/onboarding',
  noIndex: true,
});

export default async function SellerOnboardingPage() {
  const profile = await requireAuth('/seller/onboarding');

  if (profile.role === 'seller') {
    redirect('/dashboard/seller');
  }
  if (profile.role === 'admin') {
    redirect('/admin');
  }

  const application = await getOwnSellerApplication(profile.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-black font-display text-text-primary">Become a Seller</h1>
        <p className="text-text-secondary mt-2 text-sm md:text-base">
          Join Bridge IT Park with verified documents and quality services. Admin reviews every
          application before you can publish promoted listings.
        </p>
      </div>

      {application?.status === 'pending' && (
        <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-text-primary text-center">
          Your application is pending review. You can update details below until approved.
        </div>
      )}
      {application?.status === 'rejected' && (
        <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-bridge-accent/30 bg-bridge-accent/10 px-4 py-3 text-sm text-center">
          <p className="font-semibold text-text-primary">Application not approved</p>
          {application.admin_note && (
            <p className="text-text-secondary mt-1">{application.admin_note}</p>
          )}
        </div>
      )}
      {application?.status === 'approved' ? (
        <p className="text-center text-text-secondary">Redirecting to seller dashboard…</p>
      ) : (
        <SellerOnboardingForm defaultFullName={profile.full_name ?? undefined} />
      )}
    </div>
  );
}
