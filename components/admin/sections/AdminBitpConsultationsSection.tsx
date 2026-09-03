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
  status: string;
  service_interested: string | null;
  created_at?: string;
};

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
              className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-sm text-white/70">{item.phone}</p>
                {item.service_interested ? (
                  <p className="text-sm text-white/60">{item.service_interested}</p>
                ) : null}
              </div>
              <select
                value={item.status}
                disabled={pending}
                onChange={(e) => updateStatus(item.id, e.target.value)}
                className={cn(
                  'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm capitalize text-white',
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
