'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

type PayoutMethodOption = {
  id: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
};

const METHODS: PayoutMethodOption[] = [
  { id: 'bkash', label: 'bKash', placeholder: '01XXXXXXXXX' },
  { id: 'nagad', label: 'Nagad', placeholder: '01XXXXXXXXX' },
  { id: 'bank', label: 'Bank account', placeholder: 'Account number' },
  { id: 'paypal', label: 'PayPal (coming soon)', placeholder: 'email@example.com', disabled: true },
];

export function SellerPayoutMethodsForm({
  existingMethods,
}: {
  existingMethods: { method: string; status: string }[];
}) {
  const [selected, setSelected] = useState<string>('bkash');
  const [account, setAccount] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-3">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={m.disabled}
            onClick={() => setSelected(m.id)}
            className={cn(
              'rounded-xl border p-4 text-left transition-all',
              selected === m.id
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-border-subtle hover:border-emerald-500/20',
              m.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <p className="font-bold text-text-primary">{m.label}</p>
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold text-text-secondary">Account details</label>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder={METHODS.find((m) => m.id === selected)?.placeholder}
          className="mt-1 w-full max-w-md rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm"
        />
      </div>

      <button
        type="button"
        className="rounded-xl bg-deshi-green px-5 py-2.5 text-sm font-bold text-white hover:bg-deshi-green-dark"
      >
        Save payout method
      </button>

      {existingMethods.length > 0 && (
        <div className="rounded-xl border border-border-subtle p-4">
          <p className="text-xs font-bold uppercase text-text-secondary mb-2">Saved methods</p>
          <ul className="space-y-2">
            {existingMethods.map((m) => (
              <li key={m.method} className="flex justify-between text-sm">
                <span className="font-semibold capitalize">{m.method}</span>
                <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10">
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
