import type { ReactNode } from 'react';
import { BridgeLogo } from '@/components/brand/BridgeLogo';

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-var(--header-offset))] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <BridgeLogo textVisibility="always" />
          </div>
          <h1 className="text-2xl font-black font-display text-text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-text-secondary mt-2">{subtitle}</p>}
        </div>
        <div className="rounded-3xl border border-border-subtle bg-surface/90 dark:bg-surface/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(15,14,23,0.08)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 sm:p-8">
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
      </div>
    </div>
  );
}
