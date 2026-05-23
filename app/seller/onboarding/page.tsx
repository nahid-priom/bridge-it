import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/require-auth';
import { getOwnSellerApplication } from '@/lib/db/seller-applications';
import { loadMarketplaceAccessContext } from '@/lib/auth/load-marketplace-access';
import { resolveSellerOnboardingRedirect } from '@/lib/auth/resolveMarketplaceAccess';
import { sellerApplicationGate } from '@/lib/auth/seller-access';
import { SellerOnboardingForm } from '@/components/seller/SellerOnboardingForm';
import { SellerOnboardingStatusPanel } from '@/components/seller/SellerOnboardingStatus';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Become a Seller',
  description: 'Apply to sell on Deshi Fiverr',
  path: '/seller/onboarding',
  noIndex: true,
});

export default async function SellerOnboardingPage() {
  await requireAuth('/seller/onboarding');

  const ctx = await loadMarketplaceAccessContext();
  const onboardingRedirect = resolveSellerOnboardingRedirect(ctx);
  if (onboardingRedirect) redirect(onboardingRedirect);

  const application = await getOwnSellerApplication(ctx.profile!.id);
  const gate = sellerApplicationGate(application);

  return (
    <>
      <PageHero
        variant="compact"
        alignment="center"
        showDecorations
        className="max-w-3xl mx-auto"
        title={PAGE_HEROES.sellerLanding.title}
        highlightedText={PAGE_HEROES.sellerLanding.highlightedText}
        subtitle="Join Deshi Fiverr Seller Hub with verified documents and quality services. Admin reviews every application before you can publish promoted listings."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
        {gate.showActivating && (
          <SellerOnboardingStatusPanel
            status="approved"
            adminNote="Your application is approved. Your seller account is activating — refresh in a moment or sign out and back in if the dashboard does not open."
          />
        )}

        {application && !gate.showActivating && (
          <SellerOnboardingStatusPanel
            status={application.status}
            adminNote={application.admin_note}
          />
        )}

        {gate.allowForm ? (
          <SellerOnboardingForm defaultFullName={ctx.profile?.full_name ?? undefined} />
        ) : null}
      </div>
    </>
  );
}
