'use client';

import { useEffect, useState, useTransition } from 'react';
import { updateConsultationStatusAction } from '@/app/actions/bitp-admin-consultations';
import { cn } from '@/lib/cn';
import { ListSkeleton } from '@/src/components/skeletons/ListSkeleton';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'closed'] as const;

type ConsultationItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  business_name: string | null;
  status: string;
  service_interested_in: string | null;
  message: string | null;
  created_at?: string;
};

function formatWhen(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function AdminBitpConsultationsSection() {
  const [items, setItems] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const load = () => {
    setLoading(true);
    fetch('/api/admin/bitp/consultations')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateConsultationStatusAction(id, status);
      if (!result.error) load();
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Consultation Requests</h2>
      {loading ? (
        <ListSkeleton rows={4} />
      ) : items.length === 0 ? (
        <p className="text-sm text-white/50">No consultation requests.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 p-4 lg:flex-row lg:items-start"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-bold text-white">{item.name}</p>
                  {item.created_at ? (
                    <span className="text-xs text-white/40">{formatWhen(item.created_at)}</span>
                  ) : null}
                </div>
                <p className="text-sm text-white/70">{item.phone}</p>
                {item.email ? <p className="text-sm text-white/60">{item.email}</p> : null}
                {item.business_name ? (
                  <p className="text-sm text-white/60">Business: {item.business_name}</p>
                ) : null}
                {item.service_interested_in ? (
                  <p className="text-sm font-medium text-emerald-300/90">{item.service_interested_in}</p>
                ) : null}
                {item.message ? (
                  <p className="text-sm text-white/50 whitespace-pre-wrap line-clamp-4">{item.message}</p>
                ) : null}
              </div>
              <select
                value={item.status}
                disabled={pending}
                onChange={(e) => updateStatus(item.id, e.target.value)}
                className={cn(
                  'shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm capitalize text-white',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/40'
                )}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-slate-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
