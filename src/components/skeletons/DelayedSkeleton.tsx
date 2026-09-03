'use client';

import type { ReactNode } from 'react';
import { useDelayedLoading } from './useDelayedLoading';

export function DelayedSkeleton({
  loading,
  delayMs = 150,
  children,
  fallback = null,
}: {
  loading: boolean;
  delayMs?: number;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const show = useDelayedLoading(loading, delayMs);
  if (!loading) return null;
  if (!show) return <>{fallback}</>;
  return <>{children}</>;
}
