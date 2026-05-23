import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignupForm } from '@/components/auth/SignupForm';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Create account',
  description: 'Join Bridge Smart IT Park',
  path: '/signup',
  noIndex: true,
});

export default function SignupPage() {
  return (
    <AuthCard
      title="Join Bridge"
      subtitle="Create a buyer account — become a seller anytime"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-bridge-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
