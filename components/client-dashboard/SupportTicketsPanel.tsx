'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { createSupportTicketAction } from '@/app/actions/client-dashboard';
import type { SupportTicket } from '@/types/client-dashboard';
import { BRANDING } from '@/lib/config/branding';

export function SupportTicketsPanel({ tickets }: { tickets: SupportTicket[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [subject, setSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const openTicket = () => {
    setError(null);
    startTransition(async () => {
      const result = await createSupportTicketAction({ subject });
      if ('error' in result && result.error) {
        setError(typeof result.error === 'string' ? result.error : 'Could not create ticket.');
        return;
      }
      setSubject('');
      setShowForm(false);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Support Tickets</h1>
          <p className="text-sm text-text-muted mt-1">Get help from the {BRANDING.appName} team.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2.5 rounded-xl bg-deshi-green text-white text-sm font-semibold hover:brightness-105 shrink-0"
        >
          Open Ticket
        </button>
      </div>

      {showForm && (
        <DashboardCard className="p-5 space-y-3">
          <label className="block text-sm font-semibold text-text-primary" htmlFor="ticket-subject">
            Subject
          </label>
          <input
            id="ticket-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm"
            placeholder="Describe your issue…"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            disabled={pending}
            onClick={openTicket}
            className="px-4 py-2 rounded-lg bg-deshi-green text-white text-sm font-semibold disabled:opacity-60"
          >
            {pending ? 'Submitting…' : 'Submit ticket'}
          </button>
        </DashboardCard>
      )}

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <p className="text-sm text-text-muted">No support tickets yet.</p>
        ) : (
          tickets.map((ticket) => (
            <DashboardCard
              key={ticket.id}
              hover
              className="p-5 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted mb-0.5">#{ticket.id}</p>
                <h3 className="font-semibold text-text-primary">{ticket.subject}</h3>
                <p className="text-xs text-text-muted mt-1">Updated {ticket.updatedAt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <StatusBadge status={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </DashboardCard>
          ))
        )}
      </div>
    </div>
  );
}
