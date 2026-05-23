'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileWarning, Sparkles } from 'lucide-react';
import { useAuthProfileActions } from '@/components/auth/AuthProfileContext';
import type { SellerApplicationStatus } from '@/lib/auth/types';

function statusLabel(status: SellerApplicationStatus): string {
  if (status === 'needs_review') return 'Under review';
  return status.replace('_', ' ');
}

export function SellerOnboardingStatusPanel({
  status,
  adminNote,
}: {
  status: SellerApplicationStatus;
  adminNote?: string | null;
}) {
  const { refreshProfile } = useAuthProfileActions();

  useEffect(() => {
    if (status !== 'pending' && status !== 'needs_review') return;
    const id = window.setInterval(() => void refreshProfile(), 12_000);
    return () => window.clearInterval(id);
  }, [status, refreshProfile]);

  if (status === 'pending' || status === 'needs_review') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/5 px-6 py-5 text-center"
      >
        <Clock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <p className="font-bold text-text-primary">Application {statusLabel(status)}</p>
        <p className="text-sm text-text-secondary mt-2">
          Our team is reviewing your seller profile. You&apos;ll be notified instantly when
          approved — no page refresh needed.
        </p>
      </motion.div>
    );
  }

  if (status === 'rejected') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-5 text-center"
      >
        <FileWarning className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <p className="font-bold text-text-primary">Application not approved</p>
        {adminNote && <p className="text-sm text-text-secondary mt-2">{adminNote}</p>}
        <p className="text-xs text-text-muted mt-3">Update your details below and resubmit.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5 text-center"
    >
      <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3 animate-pulse" />
      <p className="font-bold text-text-primary">Redirecting to your seller dashboard…</p>
    </motion.div>
  );
}
