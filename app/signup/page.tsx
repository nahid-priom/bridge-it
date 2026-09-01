import Link from 'next/link';
import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignupForm } from '@/components/auth/SignupForm';
import { buildPageMetadata } from '@/lib/metadata';
import { BRANDING } from '@/lib/config/branding';

export const metadata = buildPageMetadata({
  title: 'Create account',
  description: `Join ${BRANDING.appName}`,
  path: '/signup',
  noIndex: true,
});

export default function SignupPage() {
  return (
    <AuthCard
      title={`Join ${BRANDING.appName}`}
      subtitle="Create your client account to order solutions and track projects"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-bridge-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-sm text-text-secondary text-center">Loading…</p>}>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
