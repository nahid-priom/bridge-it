'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sellerApplicationSchema, type SellerApplicationInput } from '@/lib/validations/seller';
import { submitSellerApplicationAction } from '@/app/actions/seller';
import { AuthField, authInputClass } from '@/components/auth/AuthField';

const PRINCIPLES = [
  'Submit authentic documents and a real portfolio.',
  'Ads must follow Bridge IT Park quality and trust policy.',
  'No misleading claims, copied work, or spam promotions.',
  'Promoted listings require admin approval before going live.',
];

export function SellerOnboardingForm({ defaultFullName }: { defaultFullName?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SellerApplicationInput>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      fullName: defaultFullName ?? '',
      adInterest: false,
      principlesAccepted: false,
      experienceLevel: 'intermediate',
    },
  });

  const adInterest = watch('adInterest');

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerError(null);
    const result = await submitSellerApplicationAction(data);
    setLoading(false);
    if (result && 'error' in result) {
      setServerError(typeof result.error === 'string' ? result.error : 'Please fix the form.');
      return;
    }
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border-subtle bg-surface/80 p-5 text-sm text-text-secondary space-y-2">
        <p className="font-semibold text-text-primary">Seller principles</p>
        <ul className="list-disc pl-5 space-y-1">
          {PRINCIPLES.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <AuthField label="Full name" error={errors.fullName}>
          <input className={authInputClass} {...register('fullName')} />
        </AuthField>
        <AuthField label="Business / studio name" error={errors.businessName}>
          <input className={authInputClass} {...register('businessName')} />
        </AuthField>
        <AuthField label="Seller display name" error={errors.displayName}>
          <input className={authInputClass} {...register('displayName')} />
        </AuthField>
        <AuthField label="Category focus" error={errors.categoryFocus}>
          <input className={authInputClass} placeholder="e.g. 2D Animation" {...register('categoryFocus')} />
        </AuthField>
      </div>

      <AuthField label="Services offered (comma-separated)" error={errors.servicesOffered}>
        <input className={authInputClass} {...register('servicesOffered')} />
      </AuthField>

      <AuthField label="Short bio" error={errors.bio}>
        <textarea className={`${authInputClass} min-h-[100px]`} {...register('bio')} />
      </AuthField>

      <div className="grid sm:grid-cols-2 gap-4">
        <AuthField label="Phone / WhatsApp" error={errors.phone}>
          <input className={authInputClass} {...register('phone')} />
        </AuthField>
        <AuthField label="Location" error={errors.location}>
          <input className={authInputClass} {...register('location')} />
        </AuthField>
        <AuthField label="Portfolio URL" error={errors.portfolioUrl}>
          <input className={authInputClass} type="url" {...register('portfolioUrl')} />
        </AuthField>
        <AuthField label="Experience level" error={errors.experienceLevel}>
          <select className={authInputClass} {...register('experienceLevel')}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
            <option value="agency">Agency</option>
          </select>
        </AuthField>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <AuthField label="LinkedIn (optional)" error={errors.linkedin}>
          <input className={authInputClass} {...register('linkedin')} />
        </AuthField>
        <AuthField label="Facebook (optional)" error={errors.facebook}>
          <input className={authInputClass} {...register('facebook')} />
        </AuthField>
        <AuthField label="Website (optional)" error={errors.website}>
          <input className={authInputClass} {...register('website')} />
        </AuthField>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="mt-1" {...register('adInterest')} />
        <span className="text-sm text-text-secondary">
          I want to run promoted services on Bridge (subject to admin approval).
        </span>
      </label>

      {adInterest && (
        <div className="grid sm:grid-cols-2 gap-4 pl-0 sm:pl-6">
          <AuthField label="Promotion category" error={errors.promotionCategory}>
            <input className={authInputClass} {...register('promotionCategory')} />
          </AuthField>
          <AuthField label="Monthly ad budget range" error={errors.adBudgetRange}>
            <input className={authInputClass} placeholder="$50–$200" {...register('adBudgetRange')} />
          </AuthField>
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="mt-1" {...register('principlesAccepted')} />
        <span className="text-sm text-text-secondary">
          I agree to the seller principles and understand that misleading ads will be rejected.
        </span>
      </label>
      {errors.principlesAccepted && (
        <p className="text-xs text-bridge-accent">{errors.principlesAccepted.message}</p>
      )}

      {serverError && (
        <p className="text-sm text-bridge-accent bg-bridge-accent/10 rounded-lg px-3 py-2">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bridge-primary to-bridge-primary-light text-white font-bold disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Submitting…' : 'Submit seller application'}
      </button>
    </form>
  );
}
