'use client';

import { useForm } from 'react-hook-form';
import type { BitpRequirementField } from '@/types/bitp';
import { cn } from '@/lib/cn';

type DynamicRequirementFormProps = {
  fields: BitpRequirementField[];
  onSubmit: (values: Record<string, string>) => void;
  submitting?: boolean;
};

export function DynamicRequirementForm({
  fields,
  onSubmit,
  submitting = false,
}: DynamicRequirementFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Record<string, string>>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.field_key} className="block text-sm font-semibold text-text-primary mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.help_text && (
            <p className="text-xs text-text-secondary mb-2">{field.help_text}</p>
          )}

          {field.field_type === 'textarea' ? (
            <textarea
              id={field.field_key}
              {...register(field.field_key, { required: field.required })}
              placeholder={field.placeholder ?? undefined}
              rows={4}
              className={cn(
                'w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-4 py-3 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-deshi-green/40'
              )}
            />
          ) : field.field_type === 'select' ? (
            <select
              id={field.field_key}
              {...register(field.field_key, { required: field.required })}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.field_key}
              type={field.field_type === 'number' ? 'number' : field.field_type === 'email' ? 'email' : field.field_type === 'phone' ? 'tel' : field.field_type === 'url' ? 'url' : 'text'}
              {...register(field.field_key, { required: field.required })}
              placeholder={field.placeholder ?? undefined}
              className={cn(
                'w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-4 py-3 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-deshi-green/40'
              )}
            />
          )}

          {errors[field.field_key] && (
            <p className="text-xs text-red-500 mt-1">This field is required</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="deshi-btn-primary w-full py-3.5 text-sm font-bold disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Continue to Review'}
      </button>
    </form>
  );
}
