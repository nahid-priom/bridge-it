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
    <div className="flex min-h-dvh flex-col px-4 pb-10 pt-[calc(var(--header-offset)+1.5rem)] sm:pt-[calc(var(--header-offset)+2rem)]">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 inline-flex justify-center">
            <BridgeLogo variant="auth" href={false} priority />
          </div>
          <h1 className="font-display text-2xl font-black text-text-primary">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
        </div>
        <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 shadow-[0_24px_60px_rgba(15,14,23,0.08)] backdrop-blur-xl dark:bg-surface/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
          {children}
          {footer ? (
            <p className="mt-6 border-t border-border-subtle pt-5 text-center text-sm text-text-secondary">
              {footer}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
