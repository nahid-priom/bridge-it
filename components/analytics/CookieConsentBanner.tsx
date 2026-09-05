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
        'bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/90',
        'pb-[calc(0.625rem+env(safe-area-inset-bottom))] sm:px-4 sm:py-3'
      )}
      role="dialog"
      aria-label="Cookie preferences"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-text-primary sm:text-sm">Cookie preferences</p>
          <p className="mt-0.5 text-[11px] leading-snug text-text-secondary sm:text-xs">
            Necessary cookies run the site. Analytics and marketing load only if allowed.{' '}
            <Link href={ROUTES.privacy} className="font-semibold text-[#2563eb] underline">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-secondary sm:text-xs">
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
        <div className="flex shrink-0 flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className="rounded-lg border border-border-subtle px-2.5 py-1.5 text-[11px] font-semibold text-text-primary sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: prefs.analytics, marketing: prefs.marketing })}
            className="rounded-lg border border-border-subtle px-2.5 py-1.5 text-[11px] font-semibold text-text-primary sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
          >
            Save choices
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className="rounded-lg bg-[#2563eb] px-2.5 py-1.5 text-[11px] font-semibold text-white sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
