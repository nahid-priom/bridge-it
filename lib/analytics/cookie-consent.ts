export const COOKIE_CONSENT_KEY = 'bitp_cookie_consent_v1';

export type CookieConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const DEFAULT_COOKIE_CONSENT: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: '',
};

export function parseCookieConsent(raw: string | null | undefined): CookieConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') {
      return null;
    }
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY));
}

export function writeCookieConsent(
  prefs: Omit<CookieConsentPreferences, 'necessary' | 'updatedAt'> & { necessary?: true }
): CookieConsentPreferences {
  const next: CookieConsentPreferences = {
    necessary: true,
    analytics: Boolean(prefs.analytics),
    marketing: Boolean(prefs.marketing),
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('bitp-cookie-consent', { detail: next }));
  }
  return next;
}

export function hasAnalyticsConsent(prefs: CookieConsentPreferences | null): boolean {
  return Boolean(prefs?.analytics);
}

export function hasMarketingConsent(prefs: CookieConsentPreferences | null): boolean {
  return Boolean(prefs?.marketing);
}
