import { buildPageMetadata } from '@/lib/metadata';
import { getSellerProfileSnapshot } from '@/lib/db/seller-dashboard';
import { SellerProfileForm } from '@/components/seller-dashboard/SellerProfileForm';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Seller Profile',
  path: '/seller-dashboard/profile',
  noIndex: true,
});

export default async function SellerProfilePage() {
  const profileRes = await getSellerProfileSnapshot();
  const profile = profileRes.data;

  if (!profile) {
    redirect(ROUTES.sellerDashboardOnboarding);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-text-primary">Profile</h1>
        <p className="text-sm text-text-secondary mt-1">
          Bio, skills, portfolio, and public seller page SEO.
        </p>
      </div>
      <SellerProfileForm profile={profile} />
    </div>
  );
}
