import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';
import { buildPageMetadata } from '@/lib/metadata';
import { safeNextPath } from '@/lib/auth/redirect';

export const metadata = buildPageMetadata({
  title: 'Sign in',
  description: 'Sign in to Deshi Fiverr',
  path: '/login',
  noIndex: true,
});

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Deshi Fiverr account"
      footer={
        <>
          New here?{' '}
          <Link href="/signup" className="text-bridge-primary font-semibold hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <LoginForm next={nextPath !== '/' ? nextPath : undefined} />
    </AuthCard>
  );
}
