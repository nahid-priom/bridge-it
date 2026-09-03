import Link from 'next/link';
import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignupForm } from '@/components/auth/SignupForm';
import { buildPageMetadata } from '@/lib/metadata';
import { BRANDING } from '@/lib/config/branding';
import { safeNextPath } from '@/lib/auth/redirect';

export const metadata = buildPageMetadata({
  title: 'Create account',
  description: `Join ${BRANDING.appName}`,
  path: '/signup',
  noIndex: true,
});

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  const loginHref = nextPath !== '/' ? `/login?next=${encodeURIComponent(nextPath)}` : '/login';

  return (
    <AuthCard
      title={`Join ${BRANDING.appName}`}
      subtitle="Create your account to order a website and track it in your dashboard"
      footer={
        <>
          Already have an account?{' '}
          <Link href={loginHref} className="text-bridge-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-center text-sm text-text-secondary">Loading…</p>}>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
