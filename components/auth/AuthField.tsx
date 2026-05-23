'use client';

import type { FieldError } from 'react-hook-form';

export function AuthField({
  label,
  error,
  children,
}: {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="text-xs text-bridge-accent">{error.message}</p>}
    </div>
  );
}

export const authInputClass =
  'w-full px-4 py-3 rounded-xl bg-background-soft border border-border-subtle dark:border-white/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20 text-sm';
