'use client';

import { useState } from 'react';
import { reviewSellerApplicationAction } from '@/app/actions/seller';
import type { SellerApplicationRow } from '@/lib/db/seller-applications';

export function AdminSellerApplicationsSection({
  applications,
}: {
  applications: SellerApplicationRow[];
}) {
  const [items, setItems] = useState(applications);
  const [note, setNote] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const run = async (
    id: string,
    decision: 'approved' | 'rejected' | 'needs_review'
  ) => {
    setLoadingId(id);
    const result = await reviewSellerApplicationAction({
      applicationId: id,
      decision,
      adminNote: note[id],
    });
    setLoadingId(null);
    if (result && 'error' in result) {
      alert(typeof result.error === 'string' ? result.error : 'Action failed');
      return;
    }
    setItems((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: decision, admin_note: note[id] ?? a.admin_note }
          : a
      )
    );
  };

  const pending = items.filter((a) => a.status === 'pending' || a.status === 'needs_review');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Seller Applications</h2>
        <p className="text-sm text-white/60 mt-1">
          Review onboarding requests, documents, and ad preferences before approval.
        </p>
      </div>

      {pending.length === 0 ? (
        <p className="text-white/50 text-sm">No pending applications.</p>
      ) : (
        <div className="space-y-4">
          {pending.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white">{app.display_name}</h3>
                  <p className="text-xs text-white/50">
                    {app.business_name} · {app.category_focus} · {app.experience_level}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-amber-400">{app.status}</span>
              </div>
              <p className="text-sm text-white/70 line-clamp-3">{app.bio}</p>
              <p className="text-xs text-white/50">
                Services: {app.services_offered.join(', ')} · {app.phone} · {app.location}
              </p>
              {app.ad_interest && (
                <p className="text-xs text-emerald-400">
                  Wants promoted ads · budget: {app.ad_budget_range ?? 'not specified'}
                </p>
              )}
              <textarea
                value={note[app.id] ?? ''}
                onChange={(e) => setNote((n) => ({ ...n, [app.id]: e.target.value }))}
                placeholder="Admin note (required for rejection)"
                className="w-full rounded-xl bg-black/30 border border-white/10 text-sm text-white px-3 py-2 min-h-[72px]"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={loadingId === app.id}
                  onClick={() => run(app.id, 'approved')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={loadingId === app.id}
                  onClick={() => run(app.id, 'needs_review')}
                  className="px-4 py-2 rounded-lg bg-amber-600/80 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  Needs review
                </button>
                <button
                  type="button"
                  disabled={loadingId === app.id}
                  onClick={() => run(app.id, 'rejected')}
                  className="px-4 py-2 rounded-lg bg-red-600/80 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
