'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DEFAULT_COOKIE_CONSENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentPreferences,
} from '@/lib/analytics/cookie-consent';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState<CookieConsentPreferences>(DEFAULT_COOKIE_CONSENT);

  useEffect(() => {
    const existing = readCookieConsent();
    if (existing) {
      setPrefs(existing);
      setVisible(false);
      return;
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const save = (next: { analytics: boolean; marketing: boolean }) => {
    writeCookieConsent(next);
    setPrefs({ ...DEFAULT_COOKIE_CONSENT, ...next, updatedAt: new Date().toISOString() });
    setVisible(false);
  };

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-[80] border-t border-border-subtle',
        'bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/90',
        'pb-[calc(1rem+env(safe-area-inset-bottom))]'
      )}
      role="dialog"
      aria-label="Cookie preferences"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-text-primary">Cookie preferences</p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            We use necessary cookies to run the site. Analytics (Google Tag Manager / Microsoft Clarity)
            and marketing tags load only if you allow them. See our{' '}
            <Link href={ROUTES.privacy} className="font-semibold text-[#2563eb] underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-secondary">
            <label className="inline-flex items-center gap-1.5">
              <input type="checkbox" checked disabled className="rounded border-border-subtle" />
              Necessary
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                className="rounded border-border-subtle"
              />
              Analytics
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                className="rounded border-border-subtle"
              />
              Marketing
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className="rounded-xl border border-border-subtle px-3 py-2 text-xs font-semibold text-text-primary"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: prefs.analytics, marketing: prefs.marketing })}
            className="rounded-xl border border-border-subtle px-3 py-2 text-xs font-semibold text-text-primary"
          >
            Save choices
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className="rounded-xl bg-[#2563eb] px-3 py-2 text-xs font-semibold text-white"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
