'use client';

const SESSION_KEY = 'bitp-software-demo-session';

export function getSoftwareDemoSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sw-demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function clearSoftwareDemoSession(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(SESSION_KEY);
}
