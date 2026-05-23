'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { forgotPasswordAction } from '@/app/actions/auth';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthField, authInputClass } from '@/components/auth/AuthField';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setError(null);
    const result = await forgotPasswordAction(email);
    if (result && 'error' in result) setError(result.error ?? 'Request failed');
    else setSent(true);
  });

  return (
    <AuthCard
      title="Reset password"
      subtitle="We will email you a secure reset link"
      footer={
        <Link href="/login" className="text-bridge-primary font-semibold hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-text-secondary text-center">Check your inbox for the reset link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <AuthField label="Email" error={errors.email}>
            <input type="email" className={authInputClass} {...register('email')} />
          </AuthField>
          {error && <p className="text-sm text-bridge-accent">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold text-sm cursor-pointer"
          >
            Send reset link
          </button>
        </form>
      )}
    </AuthCard>
  );
}
