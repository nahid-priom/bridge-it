import { requireAuth } from '@/lib/auth/require-auth';
import { AuthProfileProvider } from '@/components/auth/AuthProfileContext';

/** Auth shell for all /dashboard routes; client UI lives in (portal)/layout.tsx */
export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAuth('/dashboard');

  return <AuthProfileProvider profile={profile}>{children}</AuthProfileProvider>;
}
