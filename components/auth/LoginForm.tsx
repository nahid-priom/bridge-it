'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { signInAction } from '@/app/actions/auth';
import { AuthField, authInputClass } from '@/components/auth/AuthField';

export function LoginForm({ next }: { next?: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const result = await signInAction({ ...data, next });
      if (result && 'error' in result) setServerError(result.error ?? 'Sign in failed');
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField label="Email" error={errors.email}>
        <input type="email" className={authInputClass} autoComplete="email" {...register('email')} />
      </AuthField>
      <AuthField label="Password" error={errors.password}>
        <input
          type="password"
          className={authInputClass}
          autoComplete="current-password"
          {...register('password')}
        />
      </AuthField>
      {serverError && (
        <p className="text-sm text-bridge-accent bg-bridge-accent/10 rounded-lg px-3 py-2">{serverError}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-center text-sm">
        <Link href="/forgot-password" className="text-bridge-primary hover:underline">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
