import { buildPageMetadata } from '@/lib/metadata';
import { ClientSettingsForm } from '@/components/client-dashboard/ClientSettingsForm';
import { getCurrentProfile } from '@/lib/auth/get-current-user';

export const metadata = buildPageMetadata({
  title: 'Settings',
  description: 'Account and notification preferences.',
  path: '/dashboard/settings',
  noIndex: true,
});

export default async function ClientSettingsPage() {
  const profile = await getCurrentProfile();
  return (
    <ClientSettingsForm email={profile?.email ?? null} fullName={profile?.full_name ?? null} />
  );
}
