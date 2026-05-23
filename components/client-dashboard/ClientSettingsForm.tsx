'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { updateClientProfileAction } from '@/app/actions/client-dashboard';

export function ClientSettingsForm({
  email,
  fullName,
}: {
  email: string | null;
  fullName: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(fullName ?? '');
  const [message, setMessage] = useState<string | null>(null);

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateClientProfileAction({ fullName: name });
      if ('error' in result && result.error) {
        setMessage(result.error);
        return;
      }
      setMessage('Profile updated.');
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your client account preferences.</p>
      </div>

      <DashboardCard className="p-5 space-y-4">
        <h2 className="font-semibold text-text-primary">Profile</h2>
        <div>
          <label className="text-xs font-semibold text-text-muted" htmlFor="settings-email">
            Email
          </label>
          <input
            id="settings-email"
            value={email ?? ''}
            disabled
            className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 text-sm opacity-70"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-muted" htmlFor="settings-name">
            Full name
          </label>
          <input
            id="settings-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm"
          />
        </div>
        {message && <p className="text-sm text-deshi-green">{message}</p>}
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="px-4 py-2 rounded-lg bg-deshi-green text-white text-sm font-semibold disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save profile'}
        </button>
      </DashboardCard>

      <DashboardCard className="p-5">
        <h2 className="font-semibold text-text-primary mb-2">Notifications</h2>
        <p className="text-sm text-text-muted">
          Marketplace notifications sync from your order and message activity.
        </p>
      </DashboardCard>

      <DashboardCard className="p-5">
        <h2 className="font-semibold text-text-primary mb-2">Security</h2>
        <p className="text-sm text-text-muted">
          Password changes are managed from your account email via Supabase Auth.
        </p>
      </DashboardCard>
    </div>
  );
}
