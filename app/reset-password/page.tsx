'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { updatePasswordAction } from '@/app/actions/auth';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthField, authInputClass } from '@/components/auth/AuthField';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePasswordAction(password);
      if (result && 'error' in result) setError(result.error ?? 'Update failed');
    } catch {
      // redirect
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthCard title="Set new password" subtitle="Choose a strong password for your account">
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField label="New password" error={errors.password}>
          <input type="password" className={authInputClass} autoComplete="new-password" {...register('password')} />
        </AuthField>
        <AuthField label="Confirm password" error={errors.confirmPassword}>
          <input type="password" className={authInputClass} autoComplete="new-password" {...register('confirmPassword')} />
        </AuthField>
        {error && <p className="text-sm text-bridge-accent">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold text-sm disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthCard>
  );
}
