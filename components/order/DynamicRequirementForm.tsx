'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import type { BitpRequirementField } from '@/types/bitp';
import { uploadRequirementFileAction } from '@/app/actions/requirement-upload';
import { cn } from '@/lib/cn';

type FormValues = Record<string, string>;

type DynamicRequirementFormProps = {
  fields: BitpRequirementField[];
  onSubmit: (values: Record<string, string>) => void;
  submitting?: boolean;
  submitLabel?: string;
  initialValues?: Record<string, string>;
  authReturnPath?: string;
};

export function DynamicRequirementForm({
  fields,
  onSubmit,
  submitting = false,
  submitLabel = 'Continue to Review',
  initialValues = {},
  authReturnPath,
}: DynamicRequirementFormProps) {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const basicFields = fields.filter((f) => (f.sort_order ?? 0) < 50);
  const advancedFields = fields.filter((f) => (f.sort_order ?? 0) >= 50);
  const groups = [
    { title: 'Basic Information', items: basicFields.length ? basicFields : fields.slice(0, Math.ceil(fields.length / 2)) },
    { title: advancedFields.length ? 'Additional Details' : null, items: advancedFields.length ? advancedFields : fields.slice(Math.ceil(fields.length / 2)) },
  ].filter((g) => g.items.length > 0);

  const handleFileChange = async (field: BitpRequirementField, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(field.field_key);
    setUploadErrors((prev) => ({ ...prev, [field.field_key]: '' }));
    const fd = new FormData();
    fd.set('file', file);
    const result = await uploadRequirementFileAction(fd);
    setUploading(null);
    if (result.error) {
      if ('needsAuth' in result && result.needsAuth && authReturnPath) {
        router.push(`/login?next=${encodeURIComponent(authReturnPath)}&message=${encodeURIComponent('Sign in to upload files')}`);
        return;
      }
      setUploadErrors((prev) => ({ ...prev, [field.field_key]: result.error! }));
      return;
    }
    if (result.path) setValue(field.field_key, result.path);
  };

  const renderField = (field: BitpRequirementField) => (
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
      ) : field.field_type === 'multi_select' ? (
        <Controller
          name={field.field_key}
          control={control}
          rules={{ required: field.required }}
          defaultValue=""
          render={({ field: ctrl }) => (
            <div className="space-y-2">
              {field.options.map((opt) => {
                const selected = (ctrl.value ?? '').split(',').filter(Boolean);
                const checked = selected.includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...selected, opt]
                          : selected.filter((s) => s !== opt);
                        ctrl.onChange(next.join(','));
                      }}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          )}
        />
      ) : field.field_type === 'checkbox' ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register(field.field_key, {
              required: field.required,
              setValueAs: (v) => (v ? 'yes' : ''),
            })}
          />
          {field.placeholder ?? field.label}
        </label>
      ) : field.field_type === 'radio' ? (
        <div className="space-y-2">
          {field.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value={opt}
                {...register(field.field_key, { required: field.required })}
              />
              {opt}
            </label>
          ))}
        </div>
      ) : field.field_type === 'date' ? (
        <input
          id={field.field_key}
          type="date"
          {...register(field.field_key, { required: field.required })}
          className={cn(
            'w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-4 py-3 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-deshi-green/40'
          )}
        />
      ) : field.field_type === 'file' ? (
        <div>
          <input
            id={field.field_key}
            type="file"
            accept="image/*,.pdf,.csv,.zip,.doc,.docx"
            onChange={(e) => handleFileChange(field, e.target.files)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold"
          />
          <input type="hidden" {...register(field.field_key, { required: field.required })} />
          {watch(field.field_key) && (
            <p className="text-xs text-emerald-600 mt-1">Uploaded: {watch(field.field_key)}</p>
          )}
          {uploading === field.field_key && (
            <p className="text-xs text-text-secondary mt-1">Uploading...</p>
          )}
          {uploadErrors[field.field_key] && (
            <p className="text-xs text-red-500 mt-1">{uploadErrors[field.field_key]}</p>
          )}
        </div>
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
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {groups.map((group, i) => (
        <div key={i} className="space-y-5">
          {group.title && (
            <h3 className="text-sm font-bold text-text-primary border-b border-slate-100 dark:border-white/5 pb-2">
              {group.title}
            </h3>
          )}
          {group.items.map(renderField)}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting || uploading !== null}
        className="deshi-btn-primary w-full py-3.5 text-sm font-bold disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}
