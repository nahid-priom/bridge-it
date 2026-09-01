'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { signUpAction } from '@/app/actions/auth';
import { AuthField, authInputClass } from '@/components/auth/AuthField';

export function SignupForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? undefined;
  const [serverError, setServerError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const result = await signUpAction({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        next: nextPath,
      });
      if (result && 'error' in result) setServerError(result.error ?? 'Sign up failed');
      if (result && 'needsConfirmation' in result) setNeedsConfirmation(true);
    } catch {
      // redirect
    } finally {
      setLoading(false);
    }
  });

  if (needsConfirmation) {
    return (
      <p className="text-sm text-text-secondary text-center">
        Check your email to confirm your account, then sign in.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField label="Full name" error={errors.fullName}>
        <input type="text" className={authInputClass} autoComplete="name" {...register('fullName')} />
      </AuthField>
      <AuthField label="Phone" error={errors.phone}>
        <input type="tel" className={authInputClass} autoComplete="tel" {...register('phone')} />
      </AuthField>
      <AuthField label="Email" error={errors.email}>
        <input type="email" className={authInputClass} autoComplete="email" {...register('email')} />
      </AuthField>
      <AuthField label="Password" error={errors.password}>
        <input type="password" className={authInputClass} autoComplete="new-password" {...register('password')} />
      </AuthField>
      <AuthField label="Confirm password" error={errors.confirmPassword}>
        <input
          type="password"
          className={authInputClass}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
      </AuthField>
      {serverError && (
        <p className="text-sm text-bridge-accent bg-bridge-accent/10 rounded-lg px-3 py-2">{serverError}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold text-sm disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
